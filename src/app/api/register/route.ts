import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServerClient } from "../../../lib/supabaseServerClient";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "password too short" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseServerClient
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "user exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error: insertErr } = await supabaseServerClient
      .from("users")
      .insert({ email, password_hash: passwordHash })
      .select()
      .single();

    if (insertErr) {
      return NextResponse.json({ error: "internal" }, { status: 500 });
    }

    return NextResponse.json(
      { id: data.id, email: data.email },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: "server error" }, { status: 500 });
    }
  }
}
