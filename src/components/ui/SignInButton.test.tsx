import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import SignInButton from "./SignInButton";

vi.mock("next/link", () => {
  return {
    default: ({
      children,
      href,
    }: {
      children: React.ReactNode;
      href: string;
    }) => (
      <div data-testid="mock-link" data-href={href}>
        {children}
      </div>
    ),
  };
});

beforeEach(() => {
  localStorage.clear();
});

describe("SignInButton", () => {
  const href = "/auth";
  const text = "Sign In";

  it("рендерит кнопку с правильным текстом", () => {
    render(<SignInButton href={href} text={text} />);
    const button = screen.getByText(text);
    expect(button).toBeInTheDocument();
  });

  it("содержит правильный href", () => {
    render(<SignInButton href={href} text={text} />);
    const link = screen.getByTestId("mock-link");
    expect(link).toHaveAttribute("data-href", href);
  });
});
