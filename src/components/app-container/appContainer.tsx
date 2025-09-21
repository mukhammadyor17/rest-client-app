import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import { AppContainerProps } from "../../types/app-container.ts";
import Header from "@/components/ui/Header.tsx";
import Footer from "@/components/ui/Footer.tsx";
import ClientErrorBoundary from "../ui/ErrorBoundary.tsx";
import { Session } from "next-auth";

const AppContainer = async ({ children }: AppContainerProps) => {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 flex flex-col">
      <Header session={session} />
      <ClientErrorBoundary>{children}</ClientErrorBoundary>
      <Footer />
    </div>
  );
};

export default AppContainer;
