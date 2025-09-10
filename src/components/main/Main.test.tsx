import { render, screen } from "@testing-library/react";
import Main from "@/components/main/Main.tsx";
import { DefaultSession } from "../../types/app-container.ts";

const mockSession: DefaultSession = {
  user: {
    name: "Vasya",
  },
  expires: "01.01.2026",
};

it("have heading", () => {
  render(<Main session={mockSession} />);
  const heading = screen.getByRole("heading");
  expect(heading).toBeInTheDocument();
});

it("have 2 SignInButtons", () => {
  render(<Main session={null} />);
  const signInButtons = screen.getAllByRole("link");
  expect(signInButtons.length).toBe(2);
  expect(
    signInButtons.forEach(
      (button) => ((button as HTMLLinkElement).href = "/auth")
    )
  );
});
