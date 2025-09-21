import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "./Loader";

describe("Loader component", () => {
  it("рендерится без ошибок", () => {
    render(<Loader />);
    const loaderElement =
      screen.getByRole("status", { hidden: true }) ||
      screen.getByTestId("loader");
    expect(loaderElement).toBeInTheDocument();
  });

  it("имеет корректные классы для анимации", () => {
    render(<Loader />);
    const div =
      screen.getByRole("status", { hidden: true }) ||
      screen.getByTestId("loader");
    expect(div).toHaveClass(
      "w-10",
      "h-10",
      "mx-auto",
      "my-[calc(50vh-10px)]",
      "rounded-full",
      "border-2",
      "border-neutral-900",
      "border-t-neutral-500",
      "animate-spin",
      "dark:border-neutral-50",
      "dark:border-t-neutral-400"
    );
  });
});
