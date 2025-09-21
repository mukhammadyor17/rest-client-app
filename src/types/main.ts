import { Session } from "next-auth";

export type MainProps = {
  session: Session | null;
};
