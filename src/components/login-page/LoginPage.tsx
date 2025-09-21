"use client";

import { signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorModal from "@/components/ui/ErrorModal.tsx";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\p{L})(?=.*\d)(?=.*[^\p{L}\d\s]).{8,}$/u;

  const modal = useTranslations("Modal");
  const auth = useTranslations("Auth");
  const sign = useTranslations("SignInButton");

  useEffect(() => {
    const signValue = localStorage.getItem("Sign");
    if (signValue) {
      setIsRegister(signValue === "Sign Up" || signValue === "Регистрация");
    }
    return () => localStorage.removeItem("Sign");
  }, []);

  function clearFormErrors() {
    setEmailError("");
    setPasswordError("");
  }

  const validateForm = (): boolean => {
    if (!emailRegex.test(email)) {
      setEmailError(auth("emailError"));
      return false;
    }
    if (!password) {
      setPasswordError(auth("passwordEmptyError"));
      return false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(auth("passwordComplexityError"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValidForm = validateForm();
    if (!isValidForm) return;
    setIsLoading(true);
    clearFormErrors();

    try {
      if (isRegister) {
        clearFormErrors();

        const resp = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const body = await resp.json();
        if (!resp.ok) {
          setError(new Error(`${body.error}` || auth("registrationFailed")));
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? new Error(auth("invalidCredentials"))
            : new Error(auth("unknownError") + `${result.error}`)
        );
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(new Error(auth("unknownError")));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-md mt-[-150px]">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {isRegister ? sign("up") : sign("in")}
        </h1>

        {error && (
          <ErrorModal
            open={true}
            title={modal("title")}
            message={error.message}
            onClose={() => {
              setError(null);
              clearFormErrors();
            }}
          />
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          <div className="relative">
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {auth("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
              disabled={isLoading}
            />
            <p className="absolute top-16 text-red-500 text-[12px]">
              {emailError}
            </p>
          </div>

          <div className="relative">
            <div className="relative">
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {auth("passwordLabel")}
              </label>
              <input
                id="password"
                type={!showPassword ? "password" : "text"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute text-[14px] top-1/2 right-2 text-indigo-600 hover: cursor-pointer opacity-50 active:scale-99"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? auth("showPassword") : auth("hidePassword")}
              </button>
            </div>
            <p className="absolute top-16 text-red-500 text-[10px]">
              {passwordError}
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-indigo-600 py-2 text-white transition hover:bg-indigo-700 hover:cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed active:scale-99"
          >
            {isLoading ? auth("loading") : isRegister ? sign("up") : sign("in")}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? (
            <h3>{auth("alreadyHaveAccount")}</h3>
          ) : (
            <h3>{auth("noAccount")}</h3>
          )}
          <button
            type="button"
            className=" hover:cursor-pointer text-indigo-600 active:scale-99 active:underline"
            onClick={() => {
              clearFormErrors();
              setIsRegister(!isRegister);
            }}
          >
            {isRegister ? auth("switchToLogin") : auth("switchToRegister")}
          </button>
        </div>
      </div>
    </div>
  );
}
