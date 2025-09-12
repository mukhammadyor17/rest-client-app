"use client";
import Link from "next/link";
import { LinkProps } from "../../types/app-container.ts";

export default function SignInButton({ href, text }: LinkProps) {
  return (
    <Link
      href={href}
      className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm font-medium shadow-sm transition hover:bg-indigo-700"
    >
      <span className="block w-[114px] text-center">{text}</span>
    </Link>
  );
}
