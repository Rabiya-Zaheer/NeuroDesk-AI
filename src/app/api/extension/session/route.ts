import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { corsPreflight, withCors } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

/**
 * @swagger
 * /api/extension/session:
 *   get:
 *     summary: Check whether the caller is signed in
 *     description: >
 *       Called by the Chrome extension's popup on open, with
 *       credentials: 'include' so the existing neurodesk_session cookie is
 *       sent automatically — there's no separate extension login step.
 *     tags: [Extension]
 *     responses:
 *       200:
 *         description: Session status. `user` is only present when authenticated is true.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 */
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