"use client";

import { Search, Bell, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { notifications } from "@/lib/dummy-data";

export function Navbar({ user }: { user: { name: string; image?: string | null } }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-(--color-border) bg-(--color-surface)/80 px-6 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-(--color-ink-faint)" />
        <Input
          placeholder="Search workspaces, documents, notes..."
          className="h-10 pl-11"
          aria-label="Search NeuroDesk"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <Sun className="size-[18px]" />
        </Button>

        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-(--color-accent) ring-2 ring-(--color-surface)" />
          )}
        </Button>

        <div className="mx-1 h-6 w-px bg-(--color-border)" />

        <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-(--color-surface-muted)">
          <Avatar className="size-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium text-(--color-ink) sm:block">
            {user.name.split(" ")[0]}
          </span>
        </button>
      </div>
    </header>
  );
}