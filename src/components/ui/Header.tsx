"use client";
import Link from "next/link";
import Image from "next/image";
import { MainProps } from "../../types/main.ts";
import { useEffect, useState } from "react";
import SignInButton from "@/components/ui/SignInButton.tsx";
import SignOutButton from "@/components/ui/SignOutButton.tsx";

export default function Header({ session }: MainProps) {
  const [bgColor, setBgColor] = useState("bg-white");
  const [scrollTop, setScrollTop] = useState(0);

  function onScroll() {
    const documentElement = document.documentElement;
    setScrollTop(documentElement.scrollTop);
    if (documentElement.scrollTop !== 0) {
      setBgColor("bg-gray-200");
    } else {
      setBgColor("bg-white");
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  return (
    <header
      className={`${bgColor} sticky top-0 flex w-full max-w-5xl mx-auto px-6 py-4 items-center justify-between shadow-sm rounded-b-2xl`}
    >
      <Link href="/">
        <Image
          src="logo.svg"
          alt="app icon"
          width={80}
          height={80}
          className="rounded-4xl"
          priority
        ></Image>
      </Link>
      <nav className="flex items-center gap-6">
        <select
          defaultValue="en"
          className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="en">En</option>
          <option value="ru">Ru</option>
        </select>

        {!session ? (
          <>
            <SignInButton href={"/auth"} text="Sign in" />
            <SignInButton href={"/auth"} text="Sign up" />
          </>
        ) : (
          <div className="flex gap-4 items-center">
            <SignOutButton />
          </div>
        )}
      </nav>
    </header>
  );
}
