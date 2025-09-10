import React from "react";
import Link from "next/link";
import SignInButton from "@/components/ui/SignInButton.tsx";
import { MainProps } from "../../types/main.ts";

const Main = ({ session }: MainProps) => {
  if (session) {
    return (
      <main className="w-full h- max-w-5xl mx-auto px-6 py-10 bg-gray-50 text-gray-800 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">{`Welcome Back, ${session.user?.name}!`}</h1>
        <div className="flex gap-6">
          <Link
            href="/rest-client"
            className="text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            REST Client
          </Link>
          <Link
            href="/rest-client"
            className="text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            History
          </Link>
          <Link
            href="/rest-client"
            className="text-indigo-600 hover:text-indigo-800 transition font-medium"
          >
            Variables
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-6 py-10 bg-gray-50 text-gray-800 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <div className="flex gap-4">
        <SignInButton href="/auth" text="Sign In" />
        <SignInButton href="/auth" text="Sign Up" />
      </div>
    </main>
  );
};

export default Main;
