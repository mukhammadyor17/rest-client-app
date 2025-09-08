"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Authentication Test</h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Session Data:</h2>
            <pre className="mt-2 rounded bg-gray-100 p-4 text-sm">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Sign Out
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
