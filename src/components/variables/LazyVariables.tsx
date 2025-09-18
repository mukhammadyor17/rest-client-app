"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const VariablesContainer = dynamic(() => import("./VariablesContainer"), {
  ssr: false,
  loading: () => <div className="text-center text-2xl">Loading...</div>,
});

export default function LazyVariables() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VariablesContainer />
    </Suspense>
  );
}
