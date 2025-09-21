import { render, screen, fireEvent } from "@testing-library/react";
import CodeGenerator from "./CodeGenerator";
import { HttpMethod } from "../../types/rest-client";

const translations: Record<string, string> = {
  copy: "Copy",
};

vi.mock("next-intl", () => ({
  useTranslations: (): ((key: string) => string) => {
    return (key: string) => translations[key] ?? key;
  },
}));

describe("CodeGenerator", () => {
  const defaultProps = {
    url: "https://example.com",
    method: "GET" as HttpMethod,
    headers: { "Content-Type": "application/json" },
    body: '{"foo":"bar"}',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all language buttons", () => {
    render(<CodeGenerator {...defaultProps} />);
    const buttons = [
      "CURL",
      "FETCH",
      "XHR",
      "NODE",
      "PYTHON",
      "JAVA",
      "CSHARP",
      "GO",
    ];
    buttons.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders curl code by default", () => {
    render(<CodeGenerator {...defaultProps} />);
    expect(screen.getByText(/curl -X GET/)).toBeInTheDocument();
  });

  it("switches language to fetch and renders fetch code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("FETCH"));
    expect(
      screen.getByText(/fetch\("https:\/\/example.com"/)
    ).toBeInTheDocument();
  });

  it("generates xhr code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("XHR"));
    expect(
      screen.getByText(/const xhr = new XMLHttpRequest/)
    ).toBeInTheDocument();
  });

  it("generates node code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("NODE"));
    expect(screen.getByText(/const https = require/)).toBeInTheDocument();
  });

  it("generates python code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("PYTHON"));
    expect(screen.getByText(/import requests/)).toBeInTheDocument();
  });

  it("generates java code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("JAVA"));
    expect(screen.getByText(/public class Main/)).toBeInTheDocument();
  });

  it("generates csharp code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("CSHARP"));
    expect(screen.getByText(/using System.Net.Http/)).toBeInTheDocument();
  });

  it("generates go code", () => {
    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("GO"));
    expect(screen.getByText(/package main/)).toBeInTheDocument();
  });

  it("copies code to clipboard when clicking copy button", async () => {
    const mockClipboard: Partial<Clipboard> = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    Object.defineProperty(global.navigator, "clipboard", {
      value: mockClipboard,
      configurable: true,
    });

    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("Copy"));

    expect(mockClipboard.writeText).toHaveBeenCalled();
  });

  it("handles clipboard writeText error", () => {
    const error = new Error("copy failed");
    const mockClipboard: Partial<Clipboard> = {
      writeText: vi.fn().mockRejectedValue(error),
    };

    Object.defineProperty(global.navigator, "clipboard", {
      value: mockClipboard,
      configurable: true,
    });

    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<CodeGenerator {...defaultProps} />);
    fireEvent.click(screen.getByText("Copy"));

    return vi
      .waitFor(() => {
        expect(spy).toHaveBeenCalledWith("Failed to copy code:", error);
      })
      .finally(() => {
        spy.mockRestore();
      });
  });
});
