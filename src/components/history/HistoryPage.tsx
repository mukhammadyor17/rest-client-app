import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AppContainer from "@/components/app-container/appContainer.tsx";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import LazyHistory from "@/components/history/LazyHistory.tsx";

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
