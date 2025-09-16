"use client";

import React from "react";
import { useTranslations } from "next-intl";

const History = () => {
  const history = useTranslations("Main");
  return (
    <div className="w-full">
      <div className="p-4 max-w-4xl mx-auto space-y-4 w-full flex flex-col"></div>
      <h1 className="text-2xl font-bold text-center">{history("history")}</h1>
    </div>
  );
};

export default History;
