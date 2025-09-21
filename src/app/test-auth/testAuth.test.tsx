import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, waitFor } from "@testing-library/react";
import TestAuthPage from "./page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("TestAuthPage", () => {
  const pushMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it("перенаправляет если нет сессии", async () => {
    (useSession as unknown as Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<TestAuthPage />);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/auth");
    });
  });
});
