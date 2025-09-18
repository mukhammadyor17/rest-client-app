"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import EmptyHistory from "@/components/history/EmptyHistory.tsx";

const History = () => {
  const requests = useState(null)[0];
  const history = useTranslations("Main");

  return (
    <div className="w-full">
      <div className="p-4 max-w-4xl mx-auto space-y-4 w-full flex flex-col"></div>
      {requests === null ? (
        <EmptyHistory />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center">
            {history("history")}
          </h1>
          <section>
            <p>{"requests"}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default History;
