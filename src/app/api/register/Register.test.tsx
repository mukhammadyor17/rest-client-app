import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import bcrypt from "bcryptjs";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/register/route.ts";

vi.mock("../../../lib/supabaseServerClient", () => ({
  supabaseServerClient: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
    }),
  },
}));

vi.mock("bcryptjs", () => {
  return {
    default: {
      hash: vi.fn(),
    },
  };
});

type JsonResponse = { error?: string; id?: string; email?: string };

describe("POST /api/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("возвращает 400 если нет email или password", async () => {
    const req = {
      json: async () => ({ email: "", password: "" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = (await res!.json()) as JsonResponse;

    expect(res!.status).toBe(400);
    expect(data.error).toBe("email and password required");
  });

  it("возвращает 400 если email некорректный", async () => {
    const req = {
      json: async () => ({ email: "invalid-email", password: "12345678" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = (await res!.json()) as JsonResponse;

    expect(res!.status).toBe(400);
    expect(data.error).toBe("invalid email");
  });

  it("возвращает 400 если пароль слишком короткий", async () => {
    const req = {
      json: async () => ({ email: "test@test.com", password: "123" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = (await res!.json()) as JsonResponse;

    expect(res!.status).toBe(400);
    expect(data.error).toBe("password too short");
  });

  it("возвращает 409 если пользователь существует", async () => {
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: { id: "1" }, error: null });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    (supabaseServerClient.from as unknown as Mock).mockReturnValue({
      select: selectMock,
    });

    const req = {
      json: async () => ({ email: "test@test.com", password: "12345678" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = await res!.json();

    expect(res!.status).toBe(409);
    expect(data.error).toBe("user exists");
  });

  it("успешная регистрация возвращает 201", async () => {
    const maybeSingleMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: null });
    const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });
    const insertMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: "123", email: "new@test.com" },
        error: null,
      }),
    });

    (supabaseServerClient.from as unknown as Mock).mockImplementation(
      (table: string) => {
        if (table === "users") {
          return { select: selectMock, insert: insertMock };
        }
        return { select: selectMock, insert: insertMock };
      }
    );

    (bcrypt.hash as unknown as Mock).mockResolvedValue("hashedPassword");

    const req = {
      json: async () => ({ email: "test@test.com", password: "12345678" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = await res!.json();

    expect(res!.status).toBe(201);
    expect(data.id).toBe("123");
    expect(data.email).toBe("new@test.com");
  });

  it("возвращает 500 при ошибке сервера", async () => {
    (supabaseServerClient.from as unknown as Mock).mockImplementation(() => {
      throw new Error("Server fail");
    });

    const req = {
      json: async () => ({ email: "test@test.com", password: "12345678" }),
    } as unknown as NextRequest;

    const res = await POST(req);
    const data = (await res!.json()) as JsonResponse;

    expect(res!.status).toBe(500);
    expect(data.error).toBe("server error");
  });
});
