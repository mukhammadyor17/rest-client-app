// LazyVariables.test.tsx
import { render, screen } from "@testing-library/react";
import LazyVariables from "./LazyVariables";

vi.mock("./VariablesContainer", () => ({
  __esModule: true,
  default: () => <div>VariablesContainer loaded</div>,
}));

describe("LazyVariables", () => {
  it("renders loading fallback initially", () => {
    render(<LazyVariables />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders VariablesContainer after load", async () => {
    render(<LazyVariables />);
    expect(
      await screen.findByText("VariablesContainer loaded")
    ).toBeInTheDocument();
  });
});
