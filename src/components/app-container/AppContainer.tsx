import Image from "next/image";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import SignOutButton from "@/components/ui/SignOutButton.tsx";
import SignInButton from "@/components/ui/SignInButton.tsx";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import {
  AppContainerProps,
  DefaultSession,
} from "../../types/app-container.ts";

const AppContainer = async ({ children }: AppContainerProps) => {
  const session: DefaultSession | null = await getServerSession(authOptions);

  return (
    <div className="w-screen min-h-screen font-sans bg-gray-50 text-gray-800 grid grid-rows-[auto_1fr_auto]">
      <header className="flex w-full max-w-5xl mx-auto px-6 py-4 items-center justify-between bg-white shadow-sm rounded-b-2xl">
        <Link href="/">
          <Image
            src="logo.svg"
            alt="app icon"
            width={80}
            height={80}
            className="rounded-4xl"
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
      {children}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-t border-gray-200 text-sm text-gray-600">
        <a
          className="flex items-center gap-2 hover:text-indigo-600 transition"
          href="https://github.com/mukhammadyor17"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/github-mark.svg"
            alt="github icon"
            width={20}
            height={20}
          />
          GitHub
        </a>

        <span>© 2025 Rs Client App</span>

        <a
          className="flex items-center gap-2 hover:text-indigo-600 transition"
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/rss-logo.svg"
            alt="rss-course icon"
            width={20}
            height={20}
          />
          RS School
        </a>
      </footer>
    </div>
  );
};

export default AppContainer;
