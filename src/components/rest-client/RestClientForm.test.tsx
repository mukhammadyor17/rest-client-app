import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RestClientForm from "./RestClientForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      title: "REST Client",
      urlPlaceholder: "Enter URL",
      send: "Send",
      loading: "Loading...",
      body: "Body",
      response: "Response",
      clear: "Clear",
      prettify: "Prettify",
      emptyUrl: "Empty URL",
      bodyPlaceholder: "Enter body",
      responsePlaceholder: "Enter response",
      bodyError: "Body error",
      responseError: "Response error",
      omitted: "Omitted",
    };
    return dict[key] ?? key;
  },
}));

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe("RestClientForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, "", "/");
  });

  it("рендерит заголовок и кнопку", () => {
    render(<RestClientForm />);
    expect(screen.getByText("REST Client")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("позволяет редактировать URL", () => {
    render(<RestClientForm />);
    const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "https://api.test.com" } });
    expect(input.value).toBe("https://api.test.com");
  });

  it("отображает textarea для тела при методе POST", () => {
    render(<RestClientForm />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "POST" } });

    const textarea = screen.getByTestId("body-component");
    expect(textarea).toBeInTheDocument();
  });

  it("редактирует тело запроса", () => {
    render(<RestClientForm />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "POST" } });

    const textarea = screen.getByTestId(
      "body-component"
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"foo":"bar"}' } });
    expect(textarea.value).toBe('{"foo":"bar"}');
  });

  it("показывает ошибку при пустом URL", async () => {
    render(<RestClientForm />);
    const button = screen.getByText("Send");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Empty URL")).toBeInTheDocument();
    });
  });

  it("успешно отправляет запрос", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 200, data: "ok" }),
    });

    render(<RestClientForm />);
    const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "https://api.test.com" } });

    const button = screen.getByText("Send");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Prettify")).toBeInTheDocument();
    });
  });

  it("обрабатывает ошибку при fetch", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<RestClientForm />);
    const input = screen.getByPlaceholderText("Enter URL") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "https://fail.test" } });

    const button = screen.getByText("Send");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });
});
