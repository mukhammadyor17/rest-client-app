import React from "react";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LoginPage from "@/components/login-page/LoginPage.tsx";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/authOptions.ts";

const AuthPage = async () => {
  const session = await getServerSession(authOptions);
  if (session !== null) {
    redirect("/");
  }

  return (
    <AppContainer>
      <LoginPage />
    </AppContainer>
  );
};

export default AuthPage;
