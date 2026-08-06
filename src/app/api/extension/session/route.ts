import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const session = await getSession();

  if (!session) {
    return withCors(NextResponse.json({ authenticated: false }), origin);
  }

  return withCors(
    NextResponse.json({
      authenticated: true,
      user: { id: session.userId, name: session.name, email: session.email },
    }),
    origin,
  );
}
