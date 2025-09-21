"use client";
import Link from "next/link";
import Image from "next/image";
import { MainProps } from "../../types/main.ts";
import { ChangeEvent, useEffect, useState } from "react";
import SignInButton from "@/components/ui/SignInButton.tsx";
import SignOutButton from "@/components/ui/SignOutButton.tsx";
import { setLocale } from "../../service/locale/locale-service.ts";
import { useLocale, useTranslations } from "next-intl";
import MainButton from "@/components/ui/MainButton.tsx";

export default function Header({ session }: MainProps) {
  const [bgColor, setBgColor] = useState("bg-white");
  const [chosenLocale, chooseLocale] = useState(useLocale());
  const signIn = useTranslations("SignInButton");
  const main = useTranslations("Main");

  function changeLanguage(e: ChangeEvent<HTMLSelectElement>) {
    chooseLocale(e.target.value);
    setLocale(e.target.value).then(() => undefined);
  }

  function onScroll() {
    const documentElement = document.documentElement;

    if (documentElement.scrollTop !== 0) {
      setBgColor("bg-gray-200");
    } else {
      setBgColor("bg-white");
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${bgColor} border-b border-gray-200 sticky top-0 z-[2] flex w-full max-w-5xl mx-auto px-6 py-4 items-center   h-[65px] max-lg:h-[65px]`}
    >
      <div className="w-5xl">
        <nav className="flex items-center justify-between max-w-full w-full ">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/Logo.svg"
              alt="app icon"
              width={65}
              height={65}
              className="flex-shrink-0 rounded"
              priority
            ></Image>
          </Link>
          <nav className="flex items-center gap-6">
            <select
              defaultValue={chosenLocale}
              className="rounded-lg border border-gray-300 px-2 py-1 text-sm hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              onChange={changeLanguage}
            >
              bg-indigo-60
              <option value="en">En</option>
              <option value="ru">Ru</option>
            </select>

            {!session && (
              <>
                <SignInButton href={"/auth"} text={`${signIn("in")}`} />
                <SignInButton href={"/auth"} text={`${signIn("up")}`} />
              </>
            )}
            {session && (
              <>
                <MainButton href={"/"} text={main("mainButton")} />
                <SignOutButton />
              </>
            )}
          </nav>
        </nav>
      </div>
    </header>
  );
}
