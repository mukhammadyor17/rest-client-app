import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import {
  AppContainerProps,
  DefaultSession,
} from "../../types/app-container.ts";
import Header from "@/components/ui/Header.tsx";
import Footer from "@/components/ui/Footer.tsx";

const AppContainer = async ({ children }: AppContainerProps) => {
  const session: DefaultSession | null = await getServerSession(authOptions);

  return (
    <div className="w-screen min-h-screen font-sans bg-gray-50 text-gray-800 grid grid-rows-[auto_1fr_auto]">
      <Header session={session} />
      {children}
      <Footer />
    </div>
  );
};

export default AppContainer;
