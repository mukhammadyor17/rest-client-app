import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, body } = await req.json();

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

    return NextResponse.json({
      status: res.status,
      statusText: res.statusText,
      body: responseBody,
    });
  } catch (err: unknown) {
    {
      if (err instanceof Error) {
        return NextResponse.json({ error: err.message, status: 500 });
      }
    }
  }
}
