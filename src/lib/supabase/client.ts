"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Returns a singleton Supabase browser client for Realtime channels
 * (presence + broadcast), or `null` if the project isn't configured yet.
 *
 * We deliberately don't throw here — Phase 1 workspaces should still be
 * fully usable without a Supabase project wired up, just without live
 * multiplayer. Callers fall back to a clearly-labeled demo simulation.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes("xxxx")) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, anonKey, {
    realtime: { params: { eventsPerSecond: 20 } },
  });
  return cachedClient;
}
