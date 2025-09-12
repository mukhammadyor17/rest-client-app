import { render, screen, fireEvent } from "@testing-library/react";
import SignOutButton from "./SignOutButton";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { vi, Mock } from "vitest";

vi.mock("next-intl", () => ({
  useTranslations: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

const mockTranslate = vi.fn((key) => {
  if (key === "out") return "Sign Out";
  return "";
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("calls signOut with correct parameters when clicked", () => {
  (useTranslations as Mock).mockReturnValue(mockTranslate);
  render(<SignOutButton />);
  const button = screen.getByRole("button");
  fireEvent.click(button);
  expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/" });
});
