"use client";

import { useState } from "react";
import { ArrowUp, Upload, Mic, ImageIcon, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const attachments = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "url", label: "URL", icon: Link2 },
] as const;

export function PromptBox() {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-2 shadow-(--shadow-soft-lg)">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        placeholder="Ask NeuroDesk anything... summarize a reading, plan a study session, review a resume"
        className="w-full resize-none bg-transparent px-4 py-3 text-[15px] text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none"
      />
      <div className="flex items-center justify-between px-2 pb-1 pt-1">
        <div className="flex items-center gap-1">
          {attachments.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-(--color-ink-muted)",
                "hover:bg-(--color-surface-muted) hover:text-(--color-ink) transition-colors",
              )}
            >
              <a.icon className="size-3.5" />
              <span className="hidden sm:inline">{a.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!value.trim()}
          aria-label="Send"
          className="flex size-9 items-center justify-center rounded-full bg-(--color-primary) text-white transition-all hover:bg-(--color-primary-hover) disabled:pointer-events-none disabled:opacity-30"
        >
          <ArrowUp className="size-4" />
        </button>
      </div>
    </div>
  );
}
