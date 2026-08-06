"use client";

import { usePathname } from "next/navigation";
import { Users, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWorkspaceRealtime } from "@/features/workspace/realtime-context";
import { initials, cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/types";

const TOOL_TITLES: Record<string, string> = {
  whiteboard: "Whiteboard",
  documents: "Documents",
  "ai-chat": "AI Chat",
  study: "Study Assistant",
  career: "Career Coach",
  activity: "Activity",
};

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  connecting: "Connecting…",
  demo: "Demo mode",
};

export function WorkspaceHeader({ workspace }: { workspace: WorkspaceSummary }) {
  const pathname = usePathname();
  const tool = pathname?.split("/").filter(Boolean)[2] ?? "whiteboard";
  const { status, collaborators, self } = useWorkspaceRealtime();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-(--color-border) bg-(--color-surface)/80 px-6 backdrop-blur-md">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-(--color-ink)">
          {TOOL_TITLES[tool] ?? tool} <span className="font-normal text-(--color-ink-faint)">· {workspace.name}</span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
            status === "live"
              ? "bg-(--color-secondary-soft) text-(--color-secondary)"
              : status === "connecting"
                ? "bg-(--color-surface-muted) text-(--color-ink-faint)"
                : "bg-(--color-accent-soft) text-(--color-accent)",
          )}
          title={
            status === "demo"
              ? "No Supabase project connected — showing simulated collaborators"
              : undefined
          }
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              status === "live" && "bg-(--color-secondary)",
              status === "connecting" && "animate-pulse bg-(--color-ink-faint)",
              status === "demo" && "bg-(--color-accent)",
            )}
          />
          {STATUS_LABEL[status]}
        </span>

        <div className="flex -space-x-2">
          {collaborators.slice(0, 4).map((c) => (
            <Avatar key={c.id} className="size-7 ring-2 ring-(--color-surface)" title={c.name}>
              <AvatarFallback
                className="text-[10px] font-semibold text-white"
                style={{ backgroundColor: c.color }}
              >
                {initials(c.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          <Avatar className="size-7 ring-2 ring-(--color-surface)" title={`${self.name} (you)`}>
            <AvatarFallback className="text-[10px] font-semibold text-white" style={{ backgroundColor: self.color }}>
              {initials(self.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        <Button variant="outline" size="sm">
          <Users className="size-3.5" />
          Invite
        </Button>
        <Button variant="ghost" size="icon" aria-label="Share">
          <Share2 className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </header>
  );
}
