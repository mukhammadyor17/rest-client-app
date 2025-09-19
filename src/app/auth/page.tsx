import React from "react";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LoginPage from "@/components/login-page/LoginPage.tsx";

const AuthPage = () => {
  return (
    <AppContainer>
      <LoginPage />
    </AppContainer>
  );
};

export default AuthPage;
