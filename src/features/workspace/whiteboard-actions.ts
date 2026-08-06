"use server";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { DrawElement, DrawPoint, DrawRect, DrawStroke, StickyNoteState } from "@/types";

/**
 * Loads everything currently on a workspace's whiteboard. Called once,
 * server-side, when the whiteboard page renders — this is what makes a
 * workspace survive a refresh, unlike the pre-persistence version where
 * every reload reset back to a hardcoded seed array.
 */
export async function getWhiteboardState(
  workspaceId: string,
): Promise<{ notes: StickyNoteState[]; elements: DrawElement[] }> {
  const [noteRows, elementRows] = await Promise.all([
    db.whiteboardNote.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } }),
    db.whiteboardElement.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } }),
  ]);

  const notes: StickyNoteState[] = noteRows.map((n) => ({
    id: n.id,
    text: n.text,
    x: n.x,
    y: n.y,
    rotation: n.rotation,
    color: n.color as StickyNoteState["color"],
    updatedBy: n.updatedBy ?? undefined,
  }));

  const elements: DrawElement[] = elementRows.map((e): DrawElement => {
    const shape = e.data as Record<string, unknown>;
    const base = { id: e.id, color: e.color, width: e.width, authorId: e.authorId };

    if (e.kind === "rect") {
      const rect: DrawRect = {
        ...base,
        kind: "rect",
        start: shape.start as DrawPoint,
        end: shape.end as DrawPoint,
      };
      return rect;
    }

    const stroke: DrawStroke = {
      ...base,
      kind: "stroke",
      points: (shape.points as DrawPoint[]) ?? [],
    };
    return stroke;
  });

  return { notes, elements };
}

export async function persistNoteCreate(workspaceId: string, note: StickyNoteState): Promise<void> {
  await db.whiteboardNote
    .create({
      data: {
        id: note.id,
        workspaceId,
        text: note.text,
        x: note.x,
        y: note.y,
        rotation: note.rotation,
        color: note.color,
        updatedBy: note.updatedBy,
      },
    })
    .catch((err) => {
      // Don't let a persistence hiccup take down the live collaborative
      // experience — the note already exists for every connected client
      // via the broadcast; failing to save is degraded, not broken.
      console.error("[whiteboard] failed to persist new note", err);
    });
}

export async function persistNotePosition(id: string, x: number, y: number, updatedBy?: string): Promise<void> {
  await db.whiteboardNote
    .update({ where: { id }, data: { x, y, ...(updatedBy ? { updatedBy } : {}) } })
    .catch((err) => console.error("[whiteboard] failed to persist note move", err));
}

export async function persistElementCreate(workspaceId: string, element: DrawElement): Promise<void> {
  const { id, kind, color, width, authorId, ...rest } = element;
  await db.whiteboardElement
    .create({
      data: { id, workspaceId, kind, color, width, authorId, data: rest as unknown as Prisma.InputJsonValue },
    })
    .catch((err) => console.error("[whiteboard] failed to persist drawn element", err));
}