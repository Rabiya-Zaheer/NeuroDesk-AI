"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, History, Settings, Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { workspaces } from "@/lib/dummy-data";
import { resolveIcon } from "@/lib/icon-map";

const primaryLinks = [{ label: "Home", href: "/dashboard", icon: Home }];

const utilityLinks = [
  { label: "Favorites", href: "/dashboard/favorites", icon: Star },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-(--color-border) bg-(--color-surface) px-4 py-5">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
          <Sparkles className="size-4 text-white" />
        </div>
        <span className="font-(family-name:--font-display) text-[15px] font-bold text-(--color-ink)">
          NeuroDesk
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {primaryLinks.map((link) => (
          <SidebarLink key={link.href} {...link} active={pathname === link.href} />
        ))}
      </nav>

      <div className="mt-6 flex items-center justify-between px-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Workspaces
        </span>
        <button
          className="flex size-6 items-center justify-center rounded-md text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-(--color-ink)"
          aria-label="Create workspace"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-1 overflow-y-auto">
        {workspaces.map((ws) => {
          const Icon = resolveIcon(ws.icon);
          const href = `/workspace/${ws.id}`;
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={ws.id}
              href={href}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-(--color-primary-soft) text-(--color-primary) font-medium"
                  : "text-(--color-ink-muted) hover:bg-(--color-surface-muted) hover:text-(--color-ink)",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-lg",
                  active ? "bg-white" : "bg-(--color-surface-muted) group-hover:bg-white",
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="truncate">{ws.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 flex flex-col gap-1 border-t border-(--color-border) pt-3">
        {utilityLinks.map((link) => (
          <SidebarLink key={link.href} {...link} active={pathname === link.href} />
        ))}
      </div>
    </aside>
  );
}

function SidebarLink({
  label,
  href,
  icon: Icon,
  active,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-(--color-primary-soft) text-(--color-primary) font-medium"
          : "text-(--color-ink-muted) hover:bg-(--color-surface-muted) hover:text-(--color-ink)",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
