import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/debug/sentry-test:
 *   get:
 *     summary: Intentionally throws an error — for verifying Sentry capture
 *     description: >
 *       Not a real feature. Hit this once after setting NEXT_PUBLIC_SENTRY_DSN
 *       to confirm server-side errors reach the Sentry dashboard. Explicitly
 *       captures and flushes before responding — on Vercel's serverless
 *       runtime, the function can freeze right after sending a response,
 *       before Sentry's background network call finishes, so relying on
 *       automatic capture alone isn't reliable here.
 *     tags: [Debug]
 *     responses:
 *       500:
 *         description: Always returns 500 — that's the point.
 */
export async function GET() {
  const error = new Error("NeuroDesk Sentry test error — this one is intentional, from /api/debug/sentry-test");

  Sentry.captureException(error);
  await Sentry.flush(2000);

  return NextResponse.json({ error: error.message }, { status: 500 });
}