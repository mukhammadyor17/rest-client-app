import { getServerSession } from "next-auth/next";
import AppContainer from "@/components/app-container/appContainer.tsx";
import Main from "@/components/main/main.tsx";
import { Session } from "next-auth";
import { authOptions } from "../lib/authOptions.ts";

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <AppContainer>
      <Main session={session} />
    </AppContainer>
  );
}
