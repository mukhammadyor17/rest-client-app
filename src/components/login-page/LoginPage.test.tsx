import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "./LoginPage";

// Моки
const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));
vi.mock("next-auth/react", () => ({ signIn: vi.fn() }));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/components/ui/ErrorModal.tsx", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => (
    <div data-testid="error-modal">{message}</div>
  ),
}));

// Мокаем fetch для регистрации
global.fetch = vi.fn();

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it("рендерит форму с email и password", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordLabel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "in" })).toBeInTheDocument();
  });

  it("показывает ошибку при пустом email", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "invalid" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "in" }));

    expect(await screen.findByText("emailError")).toBeInTheDocument();
  });

  it("показывает ошибку при некорректном пароле", async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "in" }));

    expect(
      await screen.findByText("passwordComplexityError")
    ).toBeInTheDocument();
  });

  it("обрабатывает успешный вход", async () => {
    const { signIn } = await import("next-auth/react");
    (signIn as any).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "in" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
    expect(refreshMock).toHaveBeenCalled();
  });

  it("показывает ошибку при неуспешной авторизации", async () => {
    const { signIn } = await import("next-auth/react");
    (signIn as any).mockResolvedValue({ error: "CredentialsSignin" });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "in" }));

    expect(await screen.findByTestId("error-modal")).toHaveTextContent(
      "invalidCredentials"
    );
  });

  it("обрабатывает регистрацию с успешным fetch", async () => {
    localStorage.setItem("Sign", "Sign Up");
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "ok" }),
    });

    const { signIn } = await import("next-auth/react");
    (signIn as any).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "reg@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "up" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/"));
  });

  it("обрабатывает регистрацию с ошибкой fetch", async () => {
    localStorage.setItem("Sign", "Sign Up");
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: "EmailTaken" }),
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "reg@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "up" }));

    expect(await screen.findByTestId("error-modal")).toHaveTextContent(
      "EmailTaken"
    );
  });

  it("обрабатывает fetch ошибку сети", async () => {
    localStorage.setItem("Sign", "Sign Up");
    (global.fetch as any).mockRejectedValue(new Error("Network error"));

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText("emailLabel"), {
      target: { value: "reg@test.com" },
    });
    fireEvent.change(screen.getByLabelText("passwordLabel"), {
      target: { value: "P@ssword1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "up" }));

    expect(await screen.findByTestId("error-modal")).toHaveTextContent(
      "unknownError"
    );
  });
});
