import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./LoginPage";
import * as nextAuth from "next-auth/react";
import React from "react";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const pushMock = vi.fn();
const refreshMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит форму с email и password", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordLabel")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "in" })).toBeInTheDocument();
  });

  it("показывает ошибку если email пустой или некорректный", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText("emailLabel");
    const passwordInput = screen.getByLabelText("passwordLabel");
    const submitButton = screen.getByRole("button", { name: "in" });

    fireEvent.change(emailInput, { target: { value: "invalidemail" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.click(submitButton);
    expect(await screen.findByText("emailError")).toBeInTheDocument();
  });

  it("показывает ошибку если password пустой или слабый", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText("emailLabel");
    const passwordInput = screen.getByLabelText("passwordLabel");
    const submitButton = screen.getByRole("button", { name: "in" });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText("passwordComplexityError")
    ).toBeInTheDocument();
  });

  it("успешный вход вызывает signIn и router.push", async () => {
    const signInMock = vi
      .spyOn(nextAuth, "signIn")
      .mockResolvedValue({ ok: true, error: null, status: 200, url: "n" });

    render(<LoginPage />);
    const emailInput = screen.getByLabelText("emailLabel");
    const passwordInput = screen.getByLabelText("passwordLabel");
    const submitButton = screen.getByRole("button", { name: "in" });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.click(submitButton);

    await screen.findByRole("button", { name: "in" });

    expect(signInMock).toHaveBeenCalledWith("credentials", {
      email: "test@test.com",
      password: "Password1!",
      redirect: false,
    });
    expect(pushMock).toHaveBeenCalledWith("/");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("показывает ошибку если signIn возвращает ошибку", async () => {
    vi.spyOn(nextAuth, "signIn").mockResolvedValue({
      ok: false,
      error: "CredentialsSignin",
      status: 55,
      url: "str",
    });

    render(<LoginPage />);
    const emailInput = screen.getByLabelText("emailLabel");
    const passwordInput = screen.getByLabelText("passwordLabel");
    const submitButton = screen.getByRole("button", { name: "in" });

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.click(submitButton);

    expect(await screen.findByText("invalidCredentials")).toBeInTheDocument();
  });
});
