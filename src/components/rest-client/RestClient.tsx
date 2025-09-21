import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LazyRestClientForm from "@/components/rest-client/LazyRestClientForm.tsx";

export default async function RestClient() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppContainer>
      <div className="w-full flex-1">
        <LazyRestClientForm />
      </div>
    </AppContainer>
  );
}
