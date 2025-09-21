import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import History from "./History";

vi.mock("next-auth/react", () => ({
  useSession: () => ({ status: "authenticated", data: { user: { id: "1" } } }),
}));

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/history/EmptyHistory.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="empty-history">EmptyHistory</div>,
}));
vi.mock("@/components/ui/Loader.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loader</div>,
}));
vi.mock("@/components/ui/ErrorModal.tsx", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="error-modal">{message}</div>
  ),
}));

describe("History", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("показывает Loader перед загрузкой", async () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    render(<History />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("рендерит EmptyHistory если данных нет", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });

    render(<History />);
    expect(await screen.findByTestId("empty-history")).toBeInTheDocument();
  });

  it("рендерит таблицу если есть данные", async () => {
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
            latency_ms: 123,
            request_size: 50,
            response_size: 200,
            error: null,
          },
        ],
      }),
    });

    render(<History />);
    expect(await screen.findByText("GET")).toBeInTheDocument();
    expect(screen.getByText("/test")).toBeInTheDocument();
  });

  it("показывает ErrorModal если fetch падает", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("fail"));

    render(<History />);
    expect(await screen.findByTestId("error-modal")).toHaveTextContent(
      "Ошибка загрузки истории: fail"
    );
  });

  it("перекидывает на / если fetch возвращает 401", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 401,
      ok: false,
    });

    render(<History />);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });
});
