import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "../../../lib/supabaseServerClient.ts";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route.ts";
import { Session } from "next-auth";

export async function POST(req: NextRequest) {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, method, headers, body } = await req.json();
  const start = Date.now();

  try {
    if (!url || !method) {
      return NextResponse.json(
        { error: "URL and method are required" },
        { status: 400 }
      );
    }

    let parsedHeaders: Record<string, string> = {};
    if (headers) {
      parsedHeaders = headers;
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...parsedHeaders,
      },
      body: method !== "GET" ? body : undefined,
    });

    const contentType = res.headers.get("content-type") || "";
    let responseBody: unknown;

    if (contentType.includes("application/json")) {
      responseBody = await res.json();
    } else {
      responseBody = await res.text();
    }

    await supabaseServerClient.from("request_history").insert({
      user_id: session.user.id,
      url: url,
      method: method,
      headers: headers,
      body: body,
      response: JSON.stringify(responseBody),
      status_code: res.status,
      latency_ms: Date.now() - start,
      request_size: new Blob([JSON.stringify(body)]).size,
      response_size: Buffer.byteLength(JSON.stringify(responseBody), "utf8"),
    });

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      body: responseBody,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      await supabaseServerClient.from("request_history").insert({
        user_id: session.user.id,
        url: url,
        method: method,
        headers: headers,
        body: body,
        error: err.message,
        latency_ms: Date.now() - start,
        request_size: new Blob([JSON.stringify(body.body)]).size,
        response_size: 0,
      });
      return NextResponse.json({ error: err.message, status: 500 });
    }
  }
}
