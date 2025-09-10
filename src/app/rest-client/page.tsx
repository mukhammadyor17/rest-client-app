import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route.ts";
import { redirect } from "next/navigation";

export default async function RestClient() {
  const session = await getServerSession(authOptions);
  if (session) return <h1 className="text-center mt-5">REST CLIENT</h1>;
  redirect("/");
}
