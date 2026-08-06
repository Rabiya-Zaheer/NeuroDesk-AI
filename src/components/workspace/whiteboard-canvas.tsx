"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { StickyNote, Type, MousePointer2, Square, Pencil, ZoomIn, ZoomOut } from "lucide-react";
import { useWorkspaceRealtime } from "@/features/workspace/realtime-context";
import { cn } from "@/lib/utils";
import { CursorsOverlay } from "@/components/workspace/cursors-overlay";
import { DrawingCanvas } from "@/components/workspace/drawing-canvas";
import type { DrawElement, DrawPoint, StickyNoteState } from "@/types";

const noteColorStyles: Record<StickyNoteState["color"], string> = {
  primary: "bg-(--color-primary-soft)",
  secondary: "bg-(--color-secondary-soft)",
  accent: "bg-(--color-accent-soft)",
  purple: "bg-(--color-purple-soft)",
};

const NOTE_PALETTE: StickyNoteState["color"][] = ["primary", "secondary", "accent", "purple"];

type Tool = "select" | "pen" | "rect" | "note" | "text";

const TOOLS: { id: Tool; icon: typeof MousePointer2; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select & drag" },
  { id: "pen", icon: Pencil, label: "Pen" },
  { id: "rect", icon: Square, label: "Rectangle" },
  { id: "note", icon: StickyNote, label: "Sticky note" },
  { id: "text", icon: Type, label: "Text (coming soon)" },
];

function throttle<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let last = 0;
  let pending: ReturnType<typeof setTimeout> | null = null;
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!pending) {
      pending = setTimeout(() => {
        last = Date.now();
        pending = null;
        fn(...args);
      }, remaining);
    }
  }) as T;
}

export function WhiteboardCanvas() {
  const { collaborators, notes, elements, self, updateCursor, moveNote, commitNoteMove, addNote, addElement } =
  useWorkspaceRealtime();
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingNoteId = useRef<string | null>(null);
  const isDrawing = useRef(false);
  const [tool, setTool] = useState<Tool>("select");
  const [liveElement, setLiveElement] = useState<DrawElement | null>(null);
  const [zoom, setZoom] = useState(100);

  const posFromEvent = useCallback((e: { clientX: number; clientY: number }): DrawPoint | null => {
    const el = containerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const throttledCursor = useRef(
    throttle((pos: { x: number; y: number }) => updateCursor(pos), 60),
  );

  const handleContainerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pos = posFromEvent(e);
      if (!pos) return;

      if (tool === "pen") {
        isDrawing.current = true;
        setLiveElement({
          id: crypto.randomUUID(),
          kind: "stroke",
          points: [pos],
          color: self.color,
          width: 3,
          authorId: self.id,
        });
      } else if (tool === "rect") {
        isDrawing.current = true;
        setLiveElement({
          id: crypto.randomUUID(),
          kind: "rect",
          start: pos,
          end: pos,
          color: self.color,
          width: 2,
          authorId: self.id,
        });
      } else if (tool === "note") {
        const color = NOTE_PALETTE[Math.floor(Math.random() * NOTE_PALETTE.length)]!;
        addNote({
          id: crypto.randomUUID(),
          text: "New note — double-click to edit later",
          x: Math.min(78, pos.x),
          y: Math.min(84, pos.y),
          rotation: Math.round((Math.random() - 0.5) * 6),
          color,
        });
      } else if (tool === "text") {
        toast("Text tool is coming in a later phase.");
      }
    },
    [tool, self.color, self.id, addNote, posFromEvent],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pos = posFromEvent(e);
      if (!pos) return;

      throttledCursor.current(pos);

      if (draggingNoteId.current) {
        moveNote(draggingNoteId.current, pos);
        return;
      }

      if (isDrawing.current) {
        setLiveElement((prev) => {
          if (!prev) return prev;
          if (prev.kind === "stroke") {
            return { ...prev, points: [...prev.points, pos] };
          }
          return { ...prev, end: pos };
        });
      }
    },
    [posFromEvent, moveNote],
  );

  const handlePointerUp = useCallback(() => {
  if (draggingNoteId.current) {
    commitNoteMove(draggingNoteId.current);
  }
  draggingNoteId.current = null;
  if (isDrawing.current && liveElement) {
    addElement(liveElement);
  }
  isDrawing.current = false;
  setLiveElement(null);
}, [liveElement, addElement, commitNoteMove]);

  const handlePointerLeave = useCallback(() => {
    updateCursor(null);
  }, [updateCursor]);

  const handleNotePointerDown = useCallback((e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    draggingNoteId.current = id;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col">
      <div
        ref={containerRef}
        onPointerDown={handleContainerPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "relative flex-1 touch-none overflow-hidden bg-grid-soft",
          tool === "pen" || tool === "rect"
            ? "cursor-crosshair"
            : tool === "note"
              ? "cursor-copy"
              : "cursor-default",
        )}
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
      >
        <DrawingCanvas elements={elements} liveElement={liveElement} />

        {notes.map((note) => (
          <button
            key={note.id}
            onPointerDown={(e) => handleNotePointerDown(e, note.id)}
            className={cn(
              "absolute w-48 cursor-grab select-none rounded-2xl p-4 text-left shadow-(--shadow-soft) transition-shadow active:cursor-grabbing active:shadow-(--shadow-soft-lg)",
              noteColorStyles[note.color],
            )}
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              transform: `rotate(${note.rotation}deg)`,
            }}
          >
            <p className="text-xs font-medium text-(--color-ink)">{note.text}</p>
            {note.updatedBy && (
              <p className="mt-1.5 text-[10px] text-(--color-ink-faint)">moved by {note.updatedBy}</p>
            )}
          </button>
        ))}

        <div className="pointer-events-none absolute left-[58%] top-[58%] w-48 -rotate-1 rounded-2xl border-2 border-dashed border-(--color-border) bg-(--color-surface) p-4">
          <p className="text-xs text-(--color-ink-faint)">+ Drop a document here to analyze</p>
        </div>

        <CursorsOverlay collaborators={collaborators} />
      </div>

      {/* Floating toolbar */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-(--color-border) bg-(--color-surface) p-1.5 shadow-(--shadow-soft-lg)">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            title={t.label}
            aria-label={t.label}
            onClick={() => setTool(t.id)}
            className={cn(
              "pointer-events-auto flex size-9 items-center justify-center rounded-full text-(--color-ink-muted) transition-colors hover:bg-(--color-surface-muted)",
              tool === t.id && "bg-(--color-primary-soft) text-(--color-primary)",
            )}
          >
            <t.icon className="size-4" />
          </button>
        ))}
        <div className="mx-1 h-5 w-px bg-(--color-border)" />
        <button
          title="Zoom out"
          onClick={() => setZoom((z) => Math.max(50, z - 10))}
          className="pointer-events-auto flex size-9 items-center justify-center rounded-full text-(--color-ink-muted) hover:bg-(--color-surface-muted)"
        >
          <ZoomOut className="size-4" />
        </button>
        <span className="pointer-events-auto w-10 text-center text-xs font-medium text-(--color-ink-muted)">
          {zoom}%
        </span>
        <button
          title="Zoom in"
          onClick={() => setZoom((z) => Math.min(150, z + 10))}
          className="pointer-events-auto flex size-9 items-center justify-center rounded-full text-(--color-ink-muted) hover:bg-(--color-surface-muted)"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>
    </div>
  );
}
