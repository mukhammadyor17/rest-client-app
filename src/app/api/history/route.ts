import { NextResponse } from "next/server";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "../../../lib/authOptions";

export async function GET(): Promise<NextResponse> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const { data, error } = await supabaseServerClient
      .from("request_history")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
