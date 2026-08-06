import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveIcon } from "@/lib/icon-map";
import type { QuickAction } from "@/types";

const colorStyles: Record<QuickAction["color"], string> = {
  primary: "bg-(--color-primary-soft) text-(--color-primary)",
  secondary: "bg-(--color-secondary-soft) text-(--color-secondary)",
  accent: "bg-(--color-accent-soft) text-(--color-accent)",
  purple: "bg-(--color-purple-soft) text-(--color-purple)",
};

export function QuickActionCard({ action }: { action: QuickAction }) {
  const Icon = resolveIcon(action.icon);

  return (
    <Link
      href={action.href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-soft) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-soft-lg)"
    >
      <div className="flex items-start justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-2xl", colorStyles[action.color])}>
          <Icon className="size-5" />
        </span>
        <ArrowUpRight className="size-4 text-(--color-ink-faint) opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <p className="font-(family-name:--font-display) text-sm font-semibold text-(--color-ink)">
          {action.label}
        </p>
        <p className="mt-0.5 text-xs text-(--color-ink-muted)">{action.description}</p>
      </div>
    </Link>
  );
}
