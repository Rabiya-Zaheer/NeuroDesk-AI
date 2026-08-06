import Link from "next/link";
import { resolveIcon } from "@/lib/icon-map";
import { formatRelativeTime, cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/types";

const colorStyles: Record<string, { chip: string; bar: string }> = {
  primary: { chip: "bg-(--color-primary-soft) text-(--color-primary)", bar: "bg-(--color-primary)" },
  secondary: { chip: "bg-(--color-secondary-soft) text-(--color-secondary)", bar: "bg-(--color-secondary)" },
  accent: { chip: "bg-(--color-accent-soft) text-(--color-accent)", bar: "bg-(--color-accent)" },
  purple: { chip: "bg-(--color-purple-soft) text-(--color-purple)", bar: "bg-(--color-purple)" },
};

const defaultStyles = colorStyles.primary!;

export function WorkspacePreviewCard({ workspace }: { workspace: WorkspaceSummary }) {
  const Icon = resolveIcon(workspace.icon);
  const styles = colorStyles[workspace.color] ?? defaultStyles;

  return (
    <Link
      href={`/workspace/${workspace.id}`}
      className="group flex min-w-[260px] shrink-0 flex-col gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-soft) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-soft-lg) snap-start"
    >
      <div className="flex items-center justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-2xl", styles.chip)}>
          <Icon className="size-5" />
        </span>
        <span className="text-[11px] font-medium text-(--color-ink-faint)">
          {formatRelativeTime(new Date(workspace.lastActivity))}
        </span>
      </div>

      <div>
        <p className="font-(family-name:--font-display) text-sm font-semibold text-(--color-ink)">
          {workspace.name}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-(--color-ink-muted)">{workspace.description}</p>
      </div>

      <div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--color-surface-muted)">
          <div
            className={cn("h-full rounded-full transition-all", styles.bar)}
            style={{ width: `${workspace.progress}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-(--color-ink-faint)">
          <span>{workspace.progress}% picked up</span>
          <span>
            {workspace.memberCount} member{workspace.memberCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
