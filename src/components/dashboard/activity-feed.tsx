import { Clock } from "lucide-react";
import { resolveIcon } from "@/lib/icon-map";
import { recentActivity } from "@/lib/dummy-data";
import { formatRelativeTime } from "@/lib/utils";

export function ActivityFeed() {
  return (
    <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-soft)">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-(--color-surface-muted)">
          <Clock className="size-3.5 text-(--color-ink-muted)" />
        </span>
        <h3 className="font-(family-name:--font-display) text-sm font-semibold text-(--color-ink)">
          Today&apos;s activity
        </h3>
      </div>

      <ol className="relative flex flex-col gap-4 pl-1">
        {recentActivity.map((item, idx) => {
          const Icon = resolveIcon(item.icon);
          const isLast = idx === recentActivity.length - 1;
          return (
            <li key={item.id} className="relative flex gap-3 pl-6">
              {!isLast && (
                <span className="absolute left-[11px] top-6 h-[calc(100%-4px)] w-px bg-(--color-border)" />
              )}
              <span className="absolute left-0 top-0 flex size-6 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface)">
                <Icon className="size-3 text-(--color-ink-muted)" />
              </span>
              <p className="text-[13px] leading-snug text-(--color-ink-muted)">
                <span className="font-medium text-(--color-ink)">{item.actor}</span> {item.action}{" "}
                <span className="font-medium text-(--color-ink)">{item.target}</span>
                <span className="mt-0.5 block text-[11px] text-(--color-ink-faint)">
                  {formatRelativeTime(new Date(item.timestamp))}
                </span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
