import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeadersTable from "./HeadersTable";
import { NextIntlClientProvider } from "next-intl";

const testMessages = {
  RestClient: {
    headers: "Headers",
    addHeader: "Add Header",
    headerKey: "Key",
    headerValue: "Value",
  },
};

function TestProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={testMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

describe("HeadersTable", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with initial headers", () => {
    const headers = [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer token" },
    ];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    expect(screen.getByText("Headers")).toBeInTheDocument();
    expect(screen.getByText("Add Header")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Content-Type")).toBeInTheDocument();
    expect(screen.getByDisplayValue("application/json")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Authorization")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bearer token")).toBeInTheDocument();
  });

  it("calls onChange when adding a new row", () => {
    const headers = [{ key: "Content-Type", value: "application/json" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const addButton = screen.getByText("Add Header");
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Content-Type", value: "application/json" },
      { key: "", value: "" },
    ]);
  });

  it("calls onChange when changing a key", () => {
    const headers = [{ key: "", value: "" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const keyInput = screen.getByPlaceholderText("Content-Type");
    fireEvent.change(keyInput, { target: { value: "Authorization" } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Authorization", value: "" },
    ]);
  });

  it("calls onChange when changing a value", () => {
    const headers = [{ key: "Authorization", value: "" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const valueInput = screen.getByPlaceholderText("application/json");
    fireEvent.change(valueInput, { target: { value: "Bearer token" } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Authorization", value: "Bearer token" },
    ]);
  });

  it("calls onChange when removing a row", () => {
    const headers = [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer token" },
    ];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const removeButtons = screen.getAllByText("✕");
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Authorization", value: "Bearer token" },
    ]);
  });

  it("renders empty state correctly", () => {
    render(
      <TestProvider>
        <HeadersTable headers={[]} onChange={mockOnChange} />
      </TestProvider>
    );

    expect(screen.getByText("Headers")).toBeInTheDocument();
    expect(screen.getByText("Add Header")).toBeInTheDocument();

    expect(screen.queryByDisplayValue("Content-Type")).not.toBeInTheDocument();
  });

  it("displays correct translation keys", () => {
    render(
      <TestProvider>
        <HeadersTable headers={[]} onChange={mockOnChange} />
      </TestProvider>
    );

    expect(screen.getByText("Headers")).toBeInTheDocument();
    expect(screen.getByText("Add Header")).toBeInTheDocument();
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("handles multiple add and remove operations", () => {
    const headers = [{ key: "Content-Type", value: "application/json" }];

    const { rerender } = render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const addButton = screen.getByText("Add Header");
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Content-Type", value: "application/json" },
      { key: "", value: "" },
    ]);

    const newHeaders = [
      { key: "Content-Type", value: "application/json" },
      { key: "Authorization", value: "Bearer token" },
      { key: "Accept", value: "application/json" },
    ];

    rerender(
      <TestProvider>
        <HeadersTable headers={newHeaders} onChange={mockOnChange} />
      </TestProvider>
    );

    // Удаляем среднюю строку
    const removeButtons = screen.getAllByText("✕");
    fireEvent.click(removeButtons[1]);

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Content-Type", value: "application/json" },
      { key: "Accept", value: "application/json" },
    ]);
  });

  it("handles empty key field change", () => {
    const headers = [{ key: "Content-Type", value: "application/json" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const keyInput = screen.getByDisplayValue("Content-Type");
    fireEvent.change(keyInput, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "", value: "application/json" },
    ]);
  });

  it("handles empty value field change", () => {
    const headers = [{ key: "Content-Type", value: "application/json" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const valueInput = screen.getByDisplayValue("application/json");
    fireEvent.change(valueInput, { target: { value: "" } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { key: "Content-Type", value: "" },
    ]);
  });

  it("has proper accessibility attributes", () => {
    const headers = [{ key: "Content-Type", value: "application/json" }];

    render(
      <TestProvider>
        <HeadersTable headers={headers} onChange={mockOnChange} />
      </TestProvider>
    );

    const addButton = screen.getByText("Add Header");
    expect(addButton).toHaveAttribute("type", "button");

    const removeButton = screen.getByText("✕");
    expect(removeButton).toHaveAttribute("type", "button");

    const keyInput = screen.getByDisplayValue("Content-Type");
    expect(keyInput).toHaveAttribute("type", "text");

    const valueInput = screen.getByDisplayValue("application/json");
    expect(valueInput).toHaveAttribute("type", "text");
  });
});
