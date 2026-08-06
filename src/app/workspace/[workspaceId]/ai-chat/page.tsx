import { notFound } from "next/navigation";
import { Sparkles, ArrowUp } from "lucide-react";
import { getWorkspaceById } from "@/lib/dummy-data";

const thread = [
  {
    id: "m1",
    role: "user" as const,
    text: "Summarize what I've read for the thesis this week.",
  },
  {
    id: "m2",
    role: "assistant" as const,
    text: "You added 3 sources on cognitive load in interface design. The throughline across all three is that reducing extraneous load (not intrinsic load) is where most interface gains come from. Want a synthesis note added to your whiteboard?",
  },
  {
    id: "m3",
    role: "user" as const,
    text: "Yes, and flag anything that contradicts the Sweller framework.",
  },
];

export default async function AiChatPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

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
          <p className="text-xs text-(--color-ink-faint)">Grounded in {workspace.name}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {thread.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-tr-md bg-(--color-primary) px-4 py-2.5 text-sm text-white"
                  : "max-w-[80%] rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-sm text-(--color-ink)"
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-full border border-(--color-border) bg-(--color-surface) p-1.5 shadow-(--shadow-soft)">
        <div className="flex items-center gap-2">
          <input
            placeholder="Ask about this workspace..."
            className="h-9 flex-1 bg-transparent px-4 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none"
          />
          <button
            aria-label="Send"
            className="flex size-9 items-center justify-center rounded-full bg-(--color-primary) text-white transition-colors hover:bg-(--color-primary-hover)"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-[11px] text-(--color-ink-faint)">
        Preview only — connected to live workspace context in a later phase.
      </p>
    </div>
  );
}
