"use client";

import { useState } from "react";
import { Plus, LayoutGrid, FileUp, MessageSquarePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { id: "whiteboard", label: "New whiteboard", icon: LayoutGrid },
  { id: "document", label: "Upload document", icon: FileUp },
  { id: "chat", label: "Ask AI", icon: MessageSquarePlus },
];

export function Fab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              className="flex items-center gap-2.5 rounded-full border border-(--color-border) bg-(--color-surface) py-2 pl-4 pr-2 text-[13px] font-medium text-(--color-ink) shadow-(--shadow-soft-lg) transition-transform hover:-translate-y-0.5"
            >
              {opt.label}
              <span className="flex size-7 items-center justify-center rounded-full bg-(--color-surface-muted)">
                <opt.icon className="size-3.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close quick create menu" : "Open quick create menu"}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-(--color-primary) text-white shadow-(--shadow-glow-primary) transition-transform hover:bg-(--color-primary-hover)",
          open && "rotate-45",
        )}
      >
        {open ? <X className="size-5" /> : <Plus className="size-6" />}
      </button>
    </div>
  );
}
