import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import { DefaultSession } from "../types/app-container.ts";
import AppContainer from "@/components/app-container/appContainer.tsx";
import Main from "@/components/main/main.tsx";

export default async function Home() {
  const session: DefaultSession | null = await getServerSession(authOptions);
  return (
    <AppContainer>
      <Main session={session} />
    </AppContainer>
  );
}
