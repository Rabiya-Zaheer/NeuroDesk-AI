import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";
import { getWorkspaceById } from "@/lib/dummy-data";
import { broadcastToWorkspace } from "@/lib/supabase/server-realtime";

const capturePayloadSchema = z.object({
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(300),
  url: z.string().url(),
  excerpt: z.string().max(4000),
});

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

/**
 * @swagger
 * /api/extension/capture:
 *   post:
 *     summary: Send captured web content to a workspace whiteboard
 *     description: >
 *       Lands the capture as a sticky note using the same StickyNoteState
 *       shape and note-add broadcast event the in-app whiteboard listens
 *       for — the extension is another producer into the same workspace,
 *       not a separate storage system. If the target workspace is open in
 *       a browser tab with a live Supabase Realtime connection, the note
 *       appears immediately (deliveredLive: true); otherwise it's still
 *       saved and appears next time that workspace loads.
 *     tags: [Extension]
 *     security:
 *       - sessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workspaceId, title, url, excerpt]
 *             properties:
 *               workspaceId: { type: string }
 *               title: { type: string, maxLength: 300 }
 *               url: { type: string, format: uri }
 *               excerpt: { type: string, maxLength: 4000 }
 *     responses:
 *       200:
 *         description: Capture delivered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 *                 deliveredLive: { type: boolean }
 *       400:
 *         description: Invalid payload (fails Zod validation).
 *       401:
 *         description: Not authenticated.
 *       404:
 *         description: Workspace not found.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const session = await getSession();

  if (!session) {
    return withCors(NextResponse.json({ error: "Not authenticated" }, { status: 401 }), origin);
  }

  const body = await request.json().catch(() => null);
  const parsed = capturePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return withCors(
      NextResponse.json({ error: "Invalid capture payload", issues: parsed.error.flatten() }, { status: 400 }),
      origin,
    );
  }

  const { workspaceId, title, url, excerpt } = parsed.data;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) {
    return withCors(NextResponse.json({ error: "Workspace not found" }, { status: 404 }), origin);
  }

  // Land the capture as a sticky note on the workspace whiteboard — the
  // same StickyNoteState shape and "note-add" event the in-app whiteboard
  // already listens for (see realtime-context.tsx). A random drop position
  // keeps captures from stacking exactly on top of each other.
  const note = {
    id: crypto.randomUUID(),
    text: excerpt.length > 160 ? `${excerpt.slice(0, 157)}…` : excerpt || title,
    x: 10 + Math.random() * 60,
    y: 10 + Math.random() * 60,
    rotation: Math.round((Math.random() - 0.5) * 6),
    color: "accent" as const,
    updatedBy: `${session.name} (Chrome extension)`,
  };

  const deliveredLive = await broadcastToWorkspace(workspaceId, "note-add", note);

  return withCors(
    NextResponse.json({
      ok: true,
      deliveredLive,
      note,
      source: { title, url },
    }),
    origin,
  );
}