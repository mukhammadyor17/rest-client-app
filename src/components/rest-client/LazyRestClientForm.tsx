"use client";

import dynamic from "next/dynamic";

const RestClientForm = dynamic(() => import("./RestClientForm"), {
  ssr: false,
  loading: () => <div className="text-center text-2xl">Loading...</div>,
});

export default function LazyRestClientForm() {
  return <RestClientForm />;
}
