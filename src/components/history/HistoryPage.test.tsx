import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

const mockGetServerSession = vi.fn();
vi.mock("next-auth/next", () => ({
  getServerSession: (...args: any[]) => mockGetServerSession(...args),
}));

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: any[]) => redirectMock(...args),
}));

vi.mock("@/components/app-container/appContainer.tsx", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-app-container">{children}</div>
  ),
}));

vi.mock("@/components/history/LazyHistory.tsx", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-lazy-history" />,
}));

vi.mock("@/lib/supabaseServerClient.ts", () => ({
  supabaseServerClient: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
  },
}));

describe("HistoryPage (server component)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("рендерит AppContainer и LazyHistory если есть сессия", async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: "1", email: "test@test.com" },
    });

    const HistoryPage = (await import("./HistoryPage")).default;
    const result = await HistoryPage();

    render(result as React.ReactElement);

    expect(screen.getByTestId("mock-app-container")).toBeInTheDocument();
    expect(screen.getByTestId("mock-lazy-history")).toBeInTheDocument();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("вызывает redirect если сессии нет", async () => {
    mockGetServerSession.mockResolvedValue(null);

    const HistoryPage = (await import("./HistoryPage")).default;
    await HistoryPage();

    expect(redirectMock).toHaveBeenCalledWith("/");
  });
});
