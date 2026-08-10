import "server-only";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "documents";

function getStorageAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey || url.includes("xxxx")) {
    return null;
  }

  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

/**
 * All document storage goes through the service-role client, never the
 * anon key from the browser. The bucket can — and should — stay fully
 * private in Supabase; access control is enforced by our own session
 * cookie + auth check in the server actions that call these functions,
 * the same way the rest of the app's auth works (no Supabase Auth, no
 * Storage RLS policies needed).
 */
export async function uploadDocumentFile(
  path: string,
  file: File,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getStorageAdminClient();
  if (!supabase) return { ok: false, error: "Storage isn't configured (missing Supabase credentials)." };

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function deleteDocumentFile(path: string): Promise<boolean> {
  const supabase = getStorageAdminClient();
  if (!supabase) return false;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}

/** Short-lived (1 hour) signed URL — never a permanent public link. */
export async function getDocumentSignedUrl(path: string): Promise<string | null> {
  const supabase = getStorageAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}