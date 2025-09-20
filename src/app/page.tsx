import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import AppContainer from "@/components/app-container/appContainer.tsx";
import Main from "@/components/main/main.tsx";
import { Session } from "next-auth";

export default async function Home() {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <AppContainer>
      <Main session={session} />
    </AppContainer>
  );
}
