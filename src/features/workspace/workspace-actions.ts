"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { deleteDocumentFile } from "@/lib/supabase/storage";
import type { WorkspaceSummary } from "@/types";

const COLOR_TOKENS = ["primary", "secondary", "accent", "purple"] as const;

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "workspace";
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let attempt = 1;
  while (await db.workspace.findUnique({ where: { slug } })) {
    slug = `${base}-${attempt++}`;
  }
  return slug;
}

function toSummary(w: {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string | null;
  updatedAt: Date;
}): WorkspaceSummary {
  return {
    id: w.id,
    name: w.name,
    slug: w.slug,
    icon: w.icon,
    color: w.color,
    description: w.description ?? "",
    memberCount: 1,
    lastActivity: w.updatedAt.toISOString(),
    progress: 0,
  };
}

export async function listWorkspacesForUser(): Promise<WorkspaceSummary[]> {
  const session = await getSession();
  if (!session) return [];

  const rows = await db.workspace.findMany({
    where: { ownerId: session.userId, isArchived: false },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map(toSummary);
}

export async function getWorkspaceForUser(workspaceId: string): Promise<WorkspaceSummary | null> {
  const session = await getSession();
  if (!session) return null;

  const workspace = await db.workspace.findFirst({
    where: { id: workspaceId, ownerId: session.userId },
  });

  return workspace ? toSummary(workspace) : null;
}

export async function createWorkspace(
  name: string,
): Promise<{ ok: true; workspace: WorkspaceSummary } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Name can't be empty." };
  if (trimmed.length > 80) return { ok: false, error: "Name is too long (80 characters max)." };

  const existingCount = await db.workspace.count({ where: { ownerId: session.userId } });
  const color = COLOR_TOKENS[existingCount % COLOR_TOKENS.length];

  const slug = await uniqueSlug(slugify(trimmed));

  const workspace = await db.workspace.create({
    data: {
      name: trimmed,
      slug,
      description: "",
      icon: "sparkles",
      color,
      ownerId: session.userId,
    },
  });

  revalidatePath("/dashboard");

  return { ok: true, workspace: toSummary(workspace) };
}

export async function renameWorkspace(
  workspaceId: string,
  name: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Name can't be empty." };

  const result = await db.workspace.updateMany({
    where: { id: workspaceId, ownerId: session.userId },
    data: { name: trimmed },
  });
  if (result.count === 0) return { ok: false, error: "Workspace not found." };

  revalidatePath("/dashboard");
  revalidatePath(`/workspace/${workspaceId}`);
  return { ok: true };
}

export async function deleteWorkspace(workspaceId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const workspace = await db.workspace.findFirst({ where: { id: workspaceId, ownerId: session.userId } });
  if (!workspace) return { ok: false, error: "Workspace not found." };

  const documents = await db.document.findMany({ where: { workspaceId } });
  await Promise.all(documents.map((d) => deleteDocumentFile(d.storagePath)));

  await db.$transaction([
    db.whiteboardNote.deleteMany({ where: { workspaceId } }),
    db.whiteboardElement.deleteMany({ where: { workspaceId } }),
    db.chatMessage.deleteMany({ where: { workspaceId } }),
    db.document.deleteMany({ where: { workspaceId } }),
    db.workspace.delete({ where: { id: workspaceId } }),
  ]);

  revalidatePath("/dashboard");
  return { ok: true };
}