// Loader.test.tsx
import { render, screen } from "@testing-library/react";
import Loader from "./Loader";

describe("Loader", () => {
  it("рендерится без ошибок", () => {
    render(<Loader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  it("имеет правильные классы для анимации", () => {
    render(<Loader />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("animate-spin");
    expect(loader).toHaveClass("rounded-full");
  });
});
