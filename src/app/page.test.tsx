import { render, screen } from "@testing-library/react";
import Home from "./page";

it("contains footer", () => {
  render(<Home />);
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
