import { getServerSession } from "next-auth/next";

import { redirect } from "next/navigation";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LazyRestClientForm from "@/components/rest-client/LazyRestClientForm.tsx";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
