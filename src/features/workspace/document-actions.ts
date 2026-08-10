"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { uploadDocumentFile, deleteDocumentFile, getDocumentSignedUrl } from "@/lib/supabase/storage";

const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB — matches the dropzone copy

export interface DocumentListItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string; // ISO — dates don't survive the server→client boundary as Date objects
  downloadUrl: string | null;
}

export async function listDocuments(workspaceId: string): Promise<DocumentListItem[]> {
  const rows = await db.document.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });

  return Promise.all(
    rows.map(async (doc) => ({
      id: doc.id,
      name: doc.name,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      uploadedBy: doc.uploadedBy,
      createdAt: doc.createdAt.toISOString(),
      downloadUrl: await getDocumentSignedUrl(doc.storagePath),
    })),
  );
}

export async function uploadDocument(
  workspaceId: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: "File is larger than 25MB." };
  }

  const id = crypto.randomUUID();
  const storagePath = `${workspaceId}/${id}-${file.name}`;

  const upload = await uploadDocumentFile(storagePath, file);
  if (!upload.ok) return { ok: false, error: upload.error };

  await db.document.create({
    data: {
      id,
      workspaceId,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      storagePath,
      uploadedBy: session.name,
    },
  });

  return { ok: true };
}

export async function deleteDocument(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) return { ok: false, error: "Document not found." };

  await deleteDocumentFile(doc.storagePath);
  await db.document.delete({ where: { id } });

  return { ok: true };
}