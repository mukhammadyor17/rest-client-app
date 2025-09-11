import React from "react";
import Link from "next/link";
import { MainProps } from "../../types/main.ts";
import SignInButton from "@/components/ui/SignInButton.tsx";

const Main = ({ session }: MainProps) => {
  {
    return (
      <main className="h-[2000px] w-full h- max-w-5xl mx-auto   px-6 py-10 bg-gray-50 text-gray-800 flex flex-col items-center gap-6">
        {session ? (
          <>
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
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Welcome!</h1>
            <div className="flex gap-4">
              <SignInButton href="/auth" text="Sign In" />
              <SignInButton href="/auth" text="Sign Up" />
            </div>
          </>
        )}
      </main>
    );
  }
};

export default Main;
