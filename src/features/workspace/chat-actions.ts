"use server";

import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getWorkspaceById } from "@/lib/dummy-data";
import { getOpenAiClient } from "@/lib/openai";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  authorName?: string;
  createdAt: string;
}

const HISTORY_LIMIT = 20; // keeps the OpenAI context window (and cost) bounded

export async function getChatHistory(workspaceId: string): Promise<ChatMessageItem[]> {
  const rows = await db.chatMessage.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  return rows.map((m) => ({
    id: m.id,
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content,
    authorName: m.authorName ?? undefined,
    createdAt: m.createdAt.toISOString(),
  }));
}

export async function sendChatMessage(
  workspaceId: string,
  message: string,
): Promise<{ ok: true; reply: ChatMessageItem } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmed = message.trim();
  if (!trimmed) return { ok: false, error: "Message can't be empty." };

  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return { ok: false, error: "Workspace not found." };

  await db.chatMessage.create({
    data: { workspaceId, role: "user", content: trimmed, authorName: session.name },
  });

  const client = getOpenAiClient();
  if (!client) {
    const fallback =
      "AI Chat isn't fully configured yet — add an OPENAI_API_KEY to enable real responses. This message is saved so the conversation still makes sense once it is.";
    const saved = await db.chatMessage.create({ data: { workspaceId, role: "assistant", content: fallback } });
    return {
      ok: true,
      reply: { id: saved.id, role: "assistant", content: fallback, createdAt: saved.createdAt.toISOString() },
    };
  }

  const documents = await db.document.findMany({ where: { workspaceId }, select: { name: true } });
  const history = await db.chatMessage.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
    take: HISTORY_LIMIT,
  });

  const systemPrompt = [
    `You are the AI Chat assistant inside a NeuroDesk workspace called "${workspace.name}".`,
    documents.length > 0
      ? `Files uploaded to this workspace: ${documents.map((d) => d.name).join(", ")}. You don't have their contents, only these names — say so if asked something that needs the actual file content.`
      : "No files have been uploaded to this workspace yet.",
    "Be concise and helpful.",
  ].join(" ");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map((m) => ({
          role: (m.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
          content: m.content,
        })),
      ],
    });

    const replyText = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    const saved = await db.chatMessage.create({ data: { workspaceId, role: "assistant", content: replyText } });

    return {
      ok: true,
      reply: { id: saved.id, role: "assistant", content: replyText, createdAt: saved.createdAt.toISOString() },
    };
 } catch (err) {
    console.error("[ai-chat] OpenAI request failed", err);
    Sentry.captureException(err, { tags: { feature: "ai-chat" }, extra: { workspaceId } });
    return { ok: false, error: "The AI request failed — try again in a moment." };
  }
}