"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LayoutGrid, FileText, MessageSquare, GraduationCap, Target, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveIcon } from "@/lib/icon-map";
import type { WorkspaceSummary } from "@/types";

const tools = [
  { id: "whiteboard", label: "Whiteboard", icon: LayoutGrid },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "ai-chat", label: "AI Chat", icon: MessageSquare },
  { id: "study", label: "Study Assistant", icon: GraduationCap },
  { id: "career", label: "Career Coach", icon: Target },
  { id: "activity", label: "Activity", icon: Activity },
] as const;

export function WorkspaceSidebar({ workspace }: { workspace: WorkspaceSummary }) {
  const pathname = usePathname();
  const WsIcon = resolveIcon(workspace.icon);
  const base = `/workspace/${workspace.id}`;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-(--color-border) bg-(--color-surface) px-4 py-5">
      <Link
        href="/dashboard"
        className="mb-5 flex items-center gap-2 px-2 text-xs font-medium text-(--color-ink-faint) transition-colors hover:text-(--color-ink)"
      >
        <ArrowLeft className="size-3.5" />
        All workspaces
      </Link>

      <div className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-(--color-primary-soft) text-(--color-primary)">
          <WsIcon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-(family-name:--font-display) text-sm font-semibold text-(--color-ink)">
            {workspace.name}
          </p>
          <p className="truncate text-[11px] text-(--color-ink-faint)">
            {workspace.memberCount} member{workspace.memberCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <span className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
        Tools
      </span>
      <nav className="flex flex-1 flex-col gap-1">
        {tools.map((tool) => {
          const href = `${base}/${tool.id}`;
          const active = pathname === href;
          return (
            <Link
              key={tool.id}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-(--color-primary-soft) font-medium text-(--color-primary)"
                  : "text-(--color-ink-muted) hover:bg-(--color-surface-muted) hover:text-(--color-ink)",
              )}
            >
              <tool.icon className="size-4" />
              {tool.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
