import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppContainer from "@/components/app-container/appContainer.tsx";
import LazyHistory from "@/components/history/LazyHistory.tsx";
import { authOptions } from "../../lib/authOptions.ts";

const HistoryPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <AppContainer>
      <LazyHistory />
    </AppContainer>
  );
};

export default HistoryPage;
