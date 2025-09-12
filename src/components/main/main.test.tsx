import { screen } from "@testing-library/react";
import React from "react";

import Main from "@/components/main/main.tsx";
import {
  mockActiveSession,
  mockInActiveSession,
  renderWithIntl,
  wrapWithSession,
} from "../../test-utils/test-utils.tsx";

it("have 2 SignInButtons if no active session", () => {
  renderWithIntl(
    wrapWithSession(<Main session={mockInActiveSession} />, mockInActiveSession)
  );
  const signInButtons = screen.getAllByRole("link");
  expect(signInButtons.length).toBe(2);
  expect(
    signInButtons.forEach(
      (button) => ((button as HTMLLinkElement).href = "/auth")
    )
  );
});

it("if the login token is valid and unexpired, the Sign In and Sign Up buttons are replaced with the buttons:'Rest Client','History','Variables'", () => {
  renderWithIntl(<Main session={mockActiveSession} />);
  const mainButtons = screen.getAllByRole("link");
  expect(mainButtons.length).toBe(3);
  expect(mainButtons.some((button) => button.innerText === "History"));
});
