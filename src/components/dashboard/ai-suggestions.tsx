import { Sparkles, ArrowRight } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { aiSuggestions } from "@/lib/dummy-data";

export function AiSuggestions() {
  return (
    <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-soft)">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
          <Sparkles className="size-3.5 text-white" />
        </span>
        <h3 className="font-(family-name:--font-display) text-sm font-semibold text-(--color-ink)">
          AI suggestions
        </h3>
      </div>

      <ul className="flex flex-col gap-1">
        {aiSuggestions.map((s) => {
          const Icon = resolveIcon(s.icon);
          return (
            <li key={s.id}>
              <button className="group flex w-full items-start gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-(--color-surface-muted)">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-(--color-primary-soft) text-(--color-primary)">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-(--color-ink)">{s.title}</span>
                  <span className="mt-0.5 block text-xs text-(--color-ink-muted) line-clamp-2">
                    {s.description}
                  </span>
                  <span className="mt-1 inline-block text-[11px] font-medium text-(--color-ink-faint)">
                    {s.workspaceName}
                  </span>
                </span>
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-(--color-ink-faint) opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
