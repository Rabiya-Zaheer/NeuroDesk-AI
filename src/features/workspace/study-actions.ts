"use server";

import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { getOpenAiClient } from "@/lib/openai";

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  known: boolean;
}

export interface ReadingItem {
  id: string;
  title: string;
  url?: string;
  progress: number;
}

export async function listFlashcards(workspaceId: string): Promise<FlashcardItem[]> {
  const rows = await db.flashcard.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  return rows.map((c) => ({ id: c.id, question: c.question, answer: c.answer, known: c.known }));
}

export async function generateFlashcards(
  workspaceId: string,
  topic: string,
): Promise<{ ok: true; cards: FlashcardItem[] } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmed = topic.trim();
  if (!trimmed) return { ok: false, error: "Enter a topic or paste some text first." };

  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) return { ok: false, error: "Workspace not found." };

  const client = getOpenAiClient();
  if (!client) {
    return { ok: false, error: "AI isn't configured yet — add an OPENAI_API_KEY to generate flashcards." };
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Generate 5 concise study flashcards from the given topic or text. Respond with strict JSON: {"cards": [{"question": "...", "answer": "..."}]}. Nothing else.',
        },
        { role: "user", content: trimmed.slice(0, 6000) },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { cards?: { question: string; answer: string }[] };
    const cardsInput = (parsed.cards ?? []).slice(0, 10);

    if (cardsInput.length === 0) {
      return { ok: false, error: "Couldn't generate flashcards from that — try rephrasing." };
    }

    const created = await db.$transaction(
      cardsInput.map((c) => db.flashcard.create({ data: { workspaceId, question: c.question, answer: c.answer } })),
    );

    return {
      ok: true,
      cards: created.map((c) => ({ id: c.id, question: c.question, answer: c.answer, known: c.known })),
    };
  } catch (err) {
    console.error("[study] flashcard generation failed", err);
    Sentry.captureException(err, { tags: { feature: "study-flashcards" } });
    return { ok: false, error: "The AI request failed — try again in a moment." };
  }
}

export async function toggleFlashcardKnown(
  id: string,
  known: boolean,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  await db.flashcard.update({ where: { id }, data: { known } }).catch(() => {});
  return { ok: true };
}

export async function deleteFlashcard(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  await db.flashcard.delete({ where: { id } }).catch(() => {});
  return { ok: true };
}

export async function listReadings(workspaceId: string): Promise<ReadingItem[]> {
  const rows = await db.reading.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({ id: r.id, title: r.title, url: r.url ?? undefined, progress: r.progress }));
}

export async function addReading(
  workspaceId: string,
  title: string,
  url: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmed = title.trim();
  if (!trimmed) return { ok: false, error: "Title is required." };

  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) return { ok: false, error: "Workspace not found." };

  await db.reading.create({ data: { workspaceId, title: trimmed, url: url.trim() || null } });
  return { ok: true };
}

export async function updateReadingProgress(
  id: string,
  progress: number,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));
  await db.reading.update({ where: { id }, data: { progress: clamped } }).catch(() => {});
  return { ok: true };
}

export async function deleteReading(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  await db.reading.delete({ where: { id } }).catch(() => {});
  return { ok: true };
}