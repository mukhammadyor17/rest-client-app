"use client";

import React from "react";
import dynamic from "next/dynamic";
import Loader from "../ui/Loader";

const History = dynamic(() => import("./History"), {
  ssr: false,
  loading: () => <Loader />,
});

const LazyHistory = () => {
  return <History />;
};

export default LazyHistory;
