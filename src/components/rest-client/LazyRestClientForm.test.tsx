import { render, screen } from "@testing-library/react";
import LazyRestClientForm from "./LazyRestClientForm";

vi.mock("./RestClientForm", () => ({
  __esModule: true,
  default: () => <div>RestClientForm Loaded</div>,
}));

vi.mock("@/components/ui/Loader.tsx", () => ({
  __esModule: true,
  default: () => <div>Custom Loader</div>,
}));

describe("LazyRestClientForm", () => {
  it("renders loader while loading", () => {
    render(<LazyRestClientForm />);
    expect(screen.getByText("Custom Loader")).toBeInTheDocument();
  });

  it("renders RestClientForm after load", async () => {
    render(<LazyRestClientForm />);
    expect(
      await screen.findByText("RestClientForm Loaded")
    ).toBeInTheDocument();
  });
});
