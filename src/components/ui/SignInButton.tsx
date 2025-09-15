"use client";
import Link from "next/link";
import { LinkProps } from "../../types/app-container.ts";

export default function SignInButton({ href, text }: LinkProps) {
  return (
    <Link
      href={href}
      className="bg-indigo-600 text-white px-4 py-1 rounded hover:cursor-pointer hover:bg-indigo-500 disabled:opacity-50 active:scale-99"
    >
      <span className="block w-[114px] text-center">{text}</span>
    </Link>
  );
}
