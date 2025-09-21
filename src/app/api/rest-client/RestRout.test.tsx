import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "./route";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../../lib/supabaseServerClient", () => ({
  supabaseServerClient: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  },
}));

vi.stubGlobal("fetch", vi.fn());

describe("POST /api/history", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSession = {
    user: { id: "user123" },
  };

  it("возвращает 401 если нет сессии", async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);

    const req = { json: async () => ({}) } as unknown as NextRequest;
    const res = (await POST(req)) as NextResponse;

    const json = await res.json();
    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized");
  });

  it("возвращает 400 если нет url или method", async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(mockSession);

    const req = { json: async () => ({}) } as unknown as NextRequest;
    const res = (await POST(req)) as NextResponse;

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("URL and method are required");
  });

  it("успешно записывает запрос и возвращает ответ", async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(mockSession);

    const fakeResponse = { data: "ok" };
    (global.fetch as unknown as Mock).mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: { get: () => "application/json" },
      json: async () => fakeResponse,
    });

    const insertMock = vi.fn().mockResolvedValue({});
    (supabaseServerClient.from as unknown as Mock).mockReturnValue({
      insert: insertMock,
    });

    const reqBody = {
      url: "https://example.com/api",
      method: "POST",
      headers: { "X-Test": "1" },
      body: { key: "value" },
    };

    const req = { json: async () => reqBody } as unknown as NextRequest;
    const res = (await POST(req)) as NextResponse;

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.body).toEqual(fakeResponse);
    expect(insertMock).toHaveBeenCalled();
  });
});
