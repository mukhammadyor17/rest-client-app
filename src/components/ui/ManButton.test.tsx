import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MainButton from "./MainButton";

describe("MainButton component", () => {
  const href = "/test";
  const text = "Click me";

  it("рендерится с текстом", () => {
    render(<MainButton href={href} text={text} />);
    const buttonText = screen.getByText(text);
    expect(buttonText).toBeInTheDocument();
  });

  it("имеет корректный href", () => {
    render(<MainButton href={href} text={text} />);
    const linkElement = screen.getByRole("link", { name: text });
    expect(linkElement).toHaveAttribute("href", href);
  });

  it("применяет нужные классы для стиля и состояния", () => {
    render(<MainButton href={href} text={text} />);
    const linkElement = screen.getByRole("link", { name: text });
    expect(linkElement).toHaveClass(
      "bg-indigo-600",
      "text-white",
      "px-4",
      "py-1",
      "rounded",
      "hover:cursor-pointer",
      "hover:bg-indigo-500",
      "disabled:opacity-50",
      "active:scale-99"
    );
  });
});
