import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { workspaces } from "@/lib/dummy-data";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const session = await getSession();

  if (!session) {
    return withCors(NextResponse.json({ error: "Not authenticated" }, { status: 401 }), origin);
  }

  // Phase 1: workspaces are still dummy data app-wide (see src/lib/dummy-data.ts),
  // not yet Prisma-backed. This mirrors that — swap for a real
  // `prisma.workspace.findMany({ where: { ownerId: session.userId } })`
  // once workspace CRUD lands.
  const list = workspaces.map((w) => ({ id: w.id, name: w.name, icon: w.icon, color: w.color }));

  return withCors(NextResponse.json({ workspaces: list }), origin);
}
