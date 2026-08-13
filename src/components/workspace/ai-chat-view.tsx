"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { Sparkles, ArrowUp, Loader2 } from "lucide-react";
import { sendChatMessage, type ChatMessageItem } from "@/features/workspace/chat-actions";

export function AiChatView({
  workspaceId,
  workspaceName,
  initialMessages,
}: {
  workspaceId: string;
  workspaceName: string;
  initialMessages: ChatMessageItem[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, startSending] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput("");

    const optimisticUser: ChatMessageItem = {
      id: `optimistic-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    startSending(async () => {
      const result = await sendChatMessage(workspaceId, text);
      if (result.ok) {
        setMessages((prev) => [...prev, result.reply]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `⚠️ ${result.error}`,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
          <Sparkles className="size-4.5 text-white" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-ink)">
            AI Chat
          </p>
          <p className="text-xs text-(--color-ink-faint)">Grounded in {workspaceName}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="mt-8 text-center text-sm text-(--color-ink-faint)">
            Ask anything about this workspace to get started.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-tr-md bg-(--color-primary) px-4 py-2.5 text-sm text-white"
                  : "max-w-[80%] rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-sm text-(--color-ink)"
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-sm text-(--color-ink-muted)">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-6 rounded-full border border-(--color-border) bg-(--color-surface) p-1.5 shadow-(--shadow-soft)">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about this workspace..."
            className="h-9 flex-1 bg-transparent px-4 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none"
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            aria-label="Send"
            className="flex size-9 items-center justify-center rounded-full bg-(--color-primary) text-white transition-colors hover:bg-(--color-primary-hover) disabled:opacity-40"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}