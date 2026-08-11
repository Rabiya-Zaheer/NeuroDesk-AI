import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { workspaces } from "@/lib/dummy-data";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

/**
 * @swagger
 * /api/extension/workspaces:
 *   get:
 *     summary: List workspaces available to the signed-in user
 *     description: >
 *       Populates the workspace picker in the extension popup. Phase 1:
 *       workspaces are still dummy data app-wide (see src/lib/dummy-data.ts),
 *       not yet Prisma-backed — this will become a real per-user query once
 *       workspace CRUD lands.
 *     tags: [Extension]
 *     security:
 *       - sessionCookie: []
 *     responses:
 *       200:
 *         description: The list of workspaces.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workspaces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       name: { type: string }
 *                       icon: { type: string }
 *                       color: { type: string }
 *       401:
 *         description: Not authenticated.
 */
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