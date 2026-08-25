import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { listWorkspacesForUser } from "@/features/workspace/workspace-actions";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

/**
 * @swagger
 * /api/extension/workspaces:
 *   get:
 *     summary: List workspaces available to the signed-in user
 *     description: >
 *       Populates the workspace picker in the extension popup. Real,
 *       per-user, Prisma-backed data — only workspaces owned by the
 *       signed-in account are returned.
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

  const workspaces = await listWorkspacesForUser();
  const list = workspaces.map((w) => ({ id: w.id, name: w.name, icon: w.icon, color: w.color }));

  return withCors(NextResponse.json({ workspaces: list }), origin);
}