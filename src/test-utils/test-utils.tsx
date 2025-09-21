import React from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { MainProps } from "../types/main.ts";
import { SessionProvider } from "next-auth/react";
import * as enMessage from "../../messages/en.json";
import { Session } from "next-auth";

export const mockMessages = enMessage;

export const mockActiveSession: Session = {
  user: {
    id: "kddjkvhx",
    name: "Vasya",
  },
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};

export const mockInActiveSession = null;

export function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={mockMessages}>
      {ui}
    </NextIntlClientProvider>
  );
}

export function wrapWithSession(
  ui: React.ReactNode,
  session: MainProps["session"]
) {
  return <SessionProvider session={session}>{ui}</SessionProvider>;
}

export const Geist = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const GeistProvider = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
