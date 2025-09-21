"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/ui/Loader.tsx";

const RestClientForm = dynamic(() => import("./RestClientForm"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function LazyRestClientForm() {
  return <RestClientForm />;
}
