import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LazyRestClientForm from "@/app/rest-client/LazyRestClientForm.tsx";

export default async function RestClient() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppContainer>
      <div className="p-4">
        <LazyRestClientForm />
      </div>
    </AppContainer>
  );
}
