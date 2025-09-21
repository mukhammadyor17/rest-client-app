import { NextResponse } from "next/server";
import { supabaseServerClient } from "../../../lib/supabaseServerClient.ts";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts";
import { Session } from "next-auth";

export async function GET() {
  const session: Session | null = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  {
    try {
      const userId = session.user.id;
      const { data, error } = await supabaseServerClient
        .from("request_history")
        .select("*")
        .eq("user_id", userId);

      if (!error) {
        return NextResponse.json({ data: data }, { status: 200 });
      } else {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } catch (e) {
      if (e instanceof Error) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }
  }
}
