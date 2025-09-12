"use client";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function SignOutButton() {
  const signOutBtn = useTranslations("SignOutButton");

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg bg-red-500 px-4 py-2 text-white text-sm font-medium shadow-sm transition hover:bg-red-600  cursor-pointer"
    >
      <span className="block w-[60px]  text-center">
        {" "}
        {`${signOutBtn("out")}`}
      </span>
    </button>
  );
}
