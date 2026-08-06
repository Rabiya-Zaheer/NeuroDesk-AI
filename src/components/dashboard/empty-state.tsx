import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-8 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-(--color-surface-muted)">
        <Icon className="size-5 text-(--color-ink-muted)" />
      </span>
      <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-ink)">{title}</p>
      <p className="max-w-sm text-sm text-(--color-ink-muted)">{description}</p>
    </div>
  );
}
