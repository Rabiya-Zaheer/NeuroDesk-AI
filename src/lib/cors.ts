import { NextResponse } from "next/server";

/**
 * Browser extensions call these routes from a `chrome-extension://<id>`
 * origin, not from the app's own origin — so unlike the rest of the app,
 * these routes need explicit CORS handling. Credentialed requests (which we
 * need, to read the session cookie) can't use a wildcard origin, so we echo
 * back the request's Origin header when it looks like an extension, rather
 * than allowlisting a specific extension ID (which changes between dev and
 * a published Chrome Web Store listing).
 */
function isAllowedExtensionOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  return origin.startsWith("chrome-extension://") || origin.startsWith("moz-extension://");
}

export function corsHeaders(origin: string | null): HeadersInit {
  if (!isAllowedExtensionOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function withCors(response: NextResponse, origin: string | null): NextResponse {
  const headers = corsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}

export function corsPreflight(origin: string | null): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }), origin);
}
