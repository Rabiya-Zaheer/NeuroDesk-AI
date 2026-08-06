import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Broadcasts an event onto a workspace's realtime channel from the server —
 * used so a Chrome extension capture shows up live on an already-open
 * whiteboard tab, the same way another person's cursor or sticky note does.
 *
 * Uses the service role key (server-only, never exposed to the browser)
 * rather than the anon key, since this runs outside any user's browser
 * session. Returns `false` (never throws) when Supabase isn't configured or
 * the send fails — callers should treat that as "not delivered live" and
 * degrade gracefully, exactly like the client-side demo mode does.
 */
export async function broadcastToWorkspace(
  workspaceId: string,
  event: string,
  payload: unknown,
): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey || url.includes("xxxx")) {
    return false;
  }

  try {
    const supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const channel = supabase.channel(`workspace:${workspaceId}`);
    await new Promise<void>((resolve, reject) => {
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") reject(new Error(status));
      });
    });

    await channel.send({ type: "broadcast", event, payload });
    await supabase.removeChannel(channel);
    return true;
  } catch {
    return false;
  }
}
