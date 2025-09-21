import { ReactNode } from "react";

export type AppContainerProps = {
  children: ReactNode;
};

type ISODateString = string;

export interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}

export type LinkProps = {
  href: string;
  text: string;
};
