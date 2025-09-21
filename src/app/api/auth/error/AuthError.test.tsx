import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import AuthError from "./page.tsx";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
}));

import { useSearchParams } from "next/navigation";

describe("AuthError component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит дефолтное сообщение при отсутствии error", () => {
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      get: () => null,
    });

    render(<AuthError />);

    expect(
      screen.getByText("An error occurred while trying to sign in.")
    ).toBeInTheDocument();
    expect(screen.queryByText(/Error code:/)).not.toBeInTheDocument();
  });

  it.each([
    ["Configuration", "There is a problem with the server configuration."],
    ["AccessDenied", "Access denied. You do not have permission to sign in."],
    [
      "Verification",
      "The verification token has expired or has already been used.",
    ],
  ])("рендерит корректное сообщение для error=%s", (errorCode, message) => {
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      get: () => errorCode,
    });

    render(<AuthError />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(`Error code: ${errorCode}`)).toBeInTheDocument();
  });

  it("рендерит дефолтное сообщение для неизвестного error", () => {
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      get: () => "UnknownError",
    });

    render(<AuthError />);

    expect(
      screen.getByText("An error occurred while trying to sign in.")
    ).toBeInTheDocument();
    expect(screen.getByText("Error code: UnknownError")).toBeInTheDocument();
  });

  it("рендерит кнопки Try Again и Go Home", () => {
    (useSearchParams as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      get: () => null,
    });

    render(<AuthError />);

    expect(
      screen.getByRole("link", { name: /Try Again/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Go Home/i })).toBeInTheDocument();
  });
});
