import { describe, it, vi, expect, beforeEach, Mock } from "vitest";
import { GET } from "./route";
import type { Session } from "next-auth";

type RequestHistoryRow = {
  body: string | null;
  created_at: string | null;
  error: string | null;
  headers: JSON;
  id: number;
  latency_ms: number | null;
  method: string;
  request_size: number | null;
  response: string | null;
  response_size: number | null;
  status_code: number | null;
  url: string;
  user_id: string | null;
};

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("../../../lib/supabaseServerClient", () => ({
  supabaseServerClient: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn(),
    })),
  },
}));

import { getServerSession } from "next-auth/next";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";

describe("GET handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("возвращает 401, если нет сессии", async () => {
    (getServerSession as unknown as Mock).mockResolvedValue(null);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized" });
  });

  it("возвращает данные истории запросов, если сессия есть", async () => {
    const fakeSession: Session = {
      user: { id: "user123", name: null, email: null, image: null },
      expires: "",
    };

    const fakeData: RequestHistoryRow[] = [
      {
        id: 1,
        user_id: "user123",
        body: '{"key":"value"}',
        headers: {} as JSON,
        error: null,
        created_at: "2025-09-21T00:00:00Z",
        latency_ms: 123,
        method: "GET",
        request_size: 456,
        response: '{"success":true}',
        response_size: 789,
        status_code: 200,
        url: "/api/test",
      },
    ];

    (getServerSession as unknown as Mock).mockResolvedValue(fakeSession);

    const eqMock = vi.fn().mockResolvedValue({ data: fakeData, error: null });
    (supabaseServerClient.from as unknown as Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: eqMock,
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ data: fakeData });
    expect(supabaseServerClient.from).toHaveBeenCalledWith("request_history");
    expect(eqMock).toHaveBeenCalledWith("user_id", "user123");
  });

  it("возвращает 500, если Supabase вернул ошибку", async () => {
    const fakeSession: Session = {
      user: { id: "user123", name: null, email: null, image: null },
      expires: "",
    };

    (getServerSession as unknown as Mock).mockResolvedValue(fakeSession);

    const eqMock = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "Supabase error" } });
    (supabaseServerClient.from as unknown as Mock).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: eqMock,
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: "Supabase error" });
  });

  it("возвращает 500 при выброшенной ошибке", async () => {
    (getServerSession as unknown as Mock).mockResolvedValue({
      user: { id: "user123", name: null, email: null, image: null },
      expires: "",
    });

    (supabaseServerClient.from as unknown as Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json).toEqual({ error: "Unexpected error" });
  });
});
