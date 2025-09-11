import Main from "@/components/main/Main.tsx";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import AppContainer from "@/components/app-container/AppContainer.tsx";
import { DefaultSession } from "../types/app-container.ts";

export default async function Home() {
  const session: DefaultSession | null = await getServerSession(authOptions);
  return (
    <AppContainer>
      <Main session={session}></Main>
    </AppContainer>
  );
}
