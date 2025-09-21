import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import History from "./History";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("next-auth/react", () => ({
  useSession: () => ({ status: "authenticated" }),
}));
vi.mock("@/components/history/EmptyHistory.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="empty-history" />,
}));
vi.mock("@/components/ui/Loader.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));
vi.mock("@/components/ui/ErrorModal.tsx", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="error-modal">{message}</div>
  ),
}));

vi.mock("../../utils/rest-client-utils.ts", () => ({
  createRequestUrl: (base: string, method: string, url: string) =>
    `${base}/${method}/${url}`,
}));

describe("History functional tests", () => {
  beforeEach(() => vi.resetAllMocks());

  it("вызывает router.push при клике на строку", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "1",
            method: "GET",
            url: "/test",
            status_code: 200,
            created_at: new Date().toISOString(),
            latency_ms: 50,
            request_size: 10,
            response_size: 100,
            error: null,
          },
        ],
      }),
    });

    render(<History />);
    const row = await screen.findByText("GET");
    fireEvent.click(row.closest("tr")!);

    await waitFor(() =>
      expect(pushMock).toHaveBeenCalledWith("/rest-client/GET//test")
    );
  });

  it("сортирует строки по created_at", async () => {
    const date1 = new Date("2025-01-01").toISOString();
    const date2 = new Date("2025-01-02").toISOString();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "1",
            method: "GET",
            url: "/a",
            status_code: 200,
            created_at: date1,
            latency_ms: 10,
            request_size: 1,
            response_size: 1,
            error: null,
          },
          {
            id: "2",
            method: "POST",
            url: "/b",
            status_code: 200,
            created_at: date2,
            latency_ms: 10,
            request_size: 1,
            response_size: 1,
            error: null,
          },
        ],
      }),
    });

    render(<History />);
    const rows = await screen.findAllByRole("row");

    expect(rows[1]).toHaveTextContent("POST");
    expect(rows[2]).toHaveTextContent("GET");
  });

  it("отображает зеленый/красный текст для status_code", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "1",
            method: "GET",
            url: "/ok",
            status_code: 200,
            created_at: new Date().toISOString(),
            latency_ms: 10,
            request_size: 1,
            response_size: 1,
            error: null,
          },
          {
            id: "2",
            method: "GET",
            url: "/fail",
            status_code: 404,
            created_at: new Date().toISOString(),
            latency_ms: 10,
            request_size: 1,
            response_size: 1,
            error: null,
          },
        ],
      }),
    });

    render(<History />);
    const greenCell = await screen.findByText("200");
    const redCell = await screen.findByText("404");

    expect(greenCell).toHaveClass("text-green-600");
    expect(redCell).toHaveClass("text-red-600");
  });
});
