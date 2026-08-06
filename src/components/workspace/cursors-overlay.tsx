"use client";

import { cn } from "@/lib/utils";
import type { Collaborator } from "@/types";

export function CursorsOverlay({ collaborators }: { collaborators: Collaborator[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {collaborators
        .filter((c) => c.cursor)
        .map((c) => (
          <div
            key={c.id}
            className="absolute transition-[left,top] duration-150 ease-out"
            style={{ left: `${c.cursor!.x}%`, top: `${c.cursor!.y}%` }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="drop-shadow-sm">
              <path
                d="M1 1L7 16L9.5 9.5L16 7L1 1Z"
                fill={c.color}
                stroke="white"
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={cn(
                "ml-3 -mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-(--shadow-soft)",
              )}
              style={{ backgroundColor: c.color }}
            >
              {c.name}
            </span>
          </div>
        ))}
    </div>
  );
}
