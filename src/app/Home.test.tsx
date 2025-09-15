import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "./page";
import { getServerSession } from "next-auth/next";
import React from "react";

type SessionType = {
  user: {
    name: string;
  };
};

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(() =>
    Promise.resolve({
      user: { name: "Test User", email: "test@example.com" },
    })
  ),
}));

vi.mock("@/components/app-container/appContainer.tsx", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/main/main.tsx", () => ({
  default: ({ session }: { session: SessionType }) => (
    <div>Session: {session?.user?.name}</div>
  ),
}));

describe("Home Page", () => {
  it("renders with session data", async () => {
    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText("Session: Test User")).toBeInTheDocument();
  });

  it("handles null session", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const HomeComponent = await Home();
    render(HomeComponent);

    expect(screen.getByText("Session:")).toBeInTheDocument();
  });
});
