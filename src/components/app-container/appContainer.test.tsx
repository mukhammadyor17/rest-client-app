import { render, screen } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";
import * as nextAuth from "next-auth/next";
import { DefaultSession } from "../../types/app-container.ts";
import AppContainer from "@/components/app-container/appContainer.tsx";

vi.mock("next-auth/next");

vi.mock("@/components/ui/Header.tsx", () => ({
  default: ({ session }: { session: DefaultSession | null }) => (
    <header data-testid="header">
      {session ? "Header with session" : "Header without session"}
    </header>
  ),
}));

vi.mock("@/components/ui/Footer.tsx", () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));

it("renders with session", async () => {
  const mockSession: DefaultSession = {
    user: { name: "Test User", email: "test@example.com", image: null },
    expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
  };

  vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce(mockSession);

  render(await AppContainer({ children: <div>Child content</div> }));

  expect(screen.getByTestId("header")).toHaveTextContent("with session");
  expect(screen.getByText("Child content")).toBeInTheDocument();
  expect(screen.getByTestId("footer")).toBeInTheDocument();
});

it("renders without session", async () => {
  vi.spyOn(nextAuth, "getServerSession").mockResolvedValueOnce(null);

  render(await AppContainer({ children: <div>No session</div> }));

  expect(screen.getByTestId("header")).toHaveTextContent("without session");
  expect(screen.getByText("No session")).toBeInTheDocument();
  expect(screen.getByTestId("footer")).toBeInTheDocument();
});
