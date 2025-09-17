import React from "react";
import Link from "next/link";
import { MainProps } from "../../types/main.ts";
import SignInButton from "@/components/ui/SignInButton.tsx";
import { useTranslations } from "next-intl";

const Main = ({ session }: MainProps) => {
  const main = useTranslations("Main");
  const signIn = useTranslations("SignInButton");

  {
    return (
      <main className=" w-full h- max-w-5xl mx-auto   px-6 py-10 bg-gray-50 text-gray-800 flex flex-col items-center gap-6">
        {session ? (
          <>
            <h1 className="text-2xl text-center font-bold">{`${main("welcomeBack")}, ${session.user?.name}!`}</h1>
            <div className="flex gap-6 max-md:gap-2 ">
              <Link
                href="/rest-client"
                className="text-indigo-600 whitespace-nowrap max-md:text-[14px] hover:text-indigo-800 transition font-medium active:scale-95"
              >
                {`${main("rest")}`}
              </Link>
              <Link
                href="/rest-client"
                className="text-indigo-600 whitespace-nowrap max-md:text-[14px] hover:text-indigo-800 transition font-medium active:scale-95"
              >
                {`${main("history")}`}
              </Link>
              <Link
                href="/variables"
                className="text-indigo-600 whitespace-nowrap  hover:text-indigo-800 transition font-medium active:scale-95"
              >
                {`${main("variables")}`}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{`${main("welcome")}`}!</h1>
            <div className="flex gap-4">
              <SignInButton href="/auth" text={`${signIn("in")}`} />
              <SignInButton href="/auth" text={`${signIn("up")}`} />
            </div>
          </>
        )}
      </main>
    );
  }
};

export default Main;
