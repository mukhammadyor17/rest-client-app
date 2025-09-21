import { render, screen, fireEvent } from "@testing-library/react";
import VariablesContainer from "./VariablesContainer";
import { vi } from "vitest";

const mockSetItems = vi.fn();

vi.mock("@/hooks/useLocalStorage", () => ({
  __esModule: true,
  default: () => [[], mockSetItems],
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      title: "Variables",
      namePlaceholder: "Enter name",
      valuePlaceholder: "Enter value",
      name: "Name",
      value: "Value",
      empty: "No variables",
      duplicateError: "Duplicate name",
    };
    return dict[key] ?? key;
  },
}));

describe("VariablesContainer", () => {
  beforeEach(() => {
    mockSetItems.mockClear();
  });

  it("renders title and empty message", () => {
    render(<VariablesContainer />);
    expect(screen.getByText("Variables")).toBeInTheDocument();
    expect(screen.getByText("No variables")).toBeInTheDocument();
  });

  it("adds a new variable when inputs are filled and + clicked", () => {
    render(<VariablesContainer />);

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "API_KEY" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter value"), {
      target: { value: "12345" },
    });
    fireEvent.click(screen.getByText("+"));

    expect(mockSetItems).toHaveBeenCalledWith([
      { name: "API_KEY", value: "12345" },
    ]);
  });

  it("does not add variable when inputs are empty", () => {
    render(<VariablesContainer />);
    fireEvent.click(screen.getByText("+"));
    expect(mockSetItems).not.toHaveBeenCalled();
  });
});
