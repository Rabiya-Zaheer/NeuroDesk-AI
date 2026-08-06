import { notFound } from "next/navigation";
import { getWorkspaceById, recentActivity } from "@/lib/dummy-data";
import { resolveIcon } from "@/lib/icon-map";
import { formatRelativeTime } from "@/lib/utils";

export default async function WorkspaceActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <p className="mb-1 font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">Activity</p>
      <p className="mb-6 text-sm text-(--color-ink-muted)">Everything that has happened in {workspace.name}.</p>

      <ol className="relative flex flex-col gap-5 pl-1">
        {recentActivity.map((item, idx) => {
          const Icon = resolveIcon(item.icon);
          const isLast = idx === recentActivity.length - 1;
          return (
            <li key={item.id} className="relative flex gap-4 pl-8">
              {!isLast && <span className="absolute left-[13px] top-7 h-[calc(100%-4px)] w-px bg-(--color-border)" />}
              <span className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full border border-(--color-border) bg-(--color-surface)">
                <Icon className="size-3.5 text-(--color-ink-muted)" />
              </span>
              <div>
                <p className="text-sm text-(--color-ink)">
                  <span className="font-semibold">{item.actor}</span> {item.action}{" "}
                  <span className="font-semibold">{item.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-(--color-ink-faint)">
                  {formatRelativeTime(new Date(item.timestamp))}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
