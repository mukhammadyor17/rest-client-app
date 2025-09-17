import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LazyVariables from "@/components/variables/LazyVariables.tsx";

export default async function RestClient() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppContainer>
      <div className="w-full">
        <LazyVariables />
      </div>
    </AppContainer>
  );
}
