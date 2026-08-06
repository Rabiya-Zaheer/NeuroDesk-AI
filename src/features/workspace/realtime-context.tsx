"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { colorForId } from "@/lib/realtime-colors";
import { persistElementCreate, persistNoteCreate, persistNotePosition } from "@/features/workspace/whiteboard-actions";
import type {
  Collaborator,
  CursorPosition,
  DrawElement,
  RealtimeConnectionStatus,
  StickyNoteState,
} from "@/types";

interface RealtimeContextValue {
  status: RealtimeConnectionStatus;
  collaborators: Collaborator[];
  self: Collaborator;
  notes: StickyNoteState[];
  elements: DrawElement[];
  updateCursor: (pos: CursorPosition | null) => void;
  moveNote: (id: string, pos: { x: number; y: number }) => void;
  commitNoteMove: (id: string) => void;
  addNote: (note: StickyNoteState) => void;
  addElement: (element: DrawElement) => void;
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null);

export function useWorkspaceRealtime(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) {
    throw new Error("useWorkspaceRealtime must be used within RealtimeWorkspaceProvider");
  }
  return ctx;
}

const DEMO_COLLABORATORS = [
  { id: "demo-sana", name: "Sana Malik" },
  { id: "demo-bilal", name: "Bilal Ahmed" },
] as const;

export function RealtimeWorkspaceProvider({
  workspaceId,
  currentUser,
  initialNotes,
  initialElements,
  children,
}: {
  workspaceId: string;
  currentUser: { id: string; name: string };
  initialNotes: StickyNoteState[];
  initialElements: DrawElement[];
  children: React.ReactNode;
}) {
  const self = useMemo<Collaborator>(
    () => ({
      id: currentUser.id,
      name: currentUser.name,
      color: colorForId(currentUser.id),
      cursor: null,
      isSelf: true,
    }),
    [currentUser.id, currentUser.name],
  );

  // A per-browser-tab identity, distinct from the account's user id. Two
  // tabs logged into the *same* account (common when testing real-time
  // locally without a second account) must still show up as two separate
  // presences — keying presence by the account id alone would collapse
  // them into one, since Supabase groups presence state by key.
  const [clientId] = useState(() => crypto.randomUUID());

  const [status, setStatus] = useState<RealtimeConnectionStatus>("connecting");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [notes, setNotes] = useState<StickyNoteState[]>(initialNotes);
  const [elements, setElements] = useState<DrawElement[]>(initialElements);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const knownElementIdsRef = useRef<Set<string>>(new Set());
  const notesRef = useRef<StickyNoteState[]>(initialNotes);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  // --- Live mode: real Supabase Realtime presence + broadcast ---
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("demo");
      return;
    }

    setStatus("connecting");

    const channel = supabase.channel(`workspace:${workspaceId}`, {
      config: { presence: { key: clientId }, broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<{ name: string; color: string; userId: string }>();
        const others: Collaborator[] = Object.entries(state)
          .filter(([key]) => key !== clientId)
          .map(([key, presences]) => {
            const p = presences[0];
            const sameAccount = p?.userId === self.id;
            return {
              id: key,
              name: sameAccount ? `${p?.name ?? "Someone"} (you, another tab)` : (p?.name ?? "Someone"),
              color: p?.color ?? colorForId(key),
              cursor: null,
            };
          });

        for (const c of others) {
          if (!knownIdsRef.current.has(c.id)) {
            knownIdsRef.current.add(c.id);
            toast(`${c.name} joined the workspace`);
          }
        }
        for (const known of Array.from(knownIdsRef.current)) {
          if (!others.some((c) => c.id === known)) {
            knownIdsRef.current.delete(known);
          }
        }

        setCollaborators((prev) =>
          others.map((c) => ({ ...c, cursor: prev.find((p) => p.id === c.id)?.cursor ?? null })),
        );
      })
      .on("broadcast", { event: "cursor" }, ({ payload }) => {
        const data = payload as { id: string; cursor: CursorPosition };
        setCollaborators((prev) =>
          prev.map((c) => (c.id === data.id ? { ...c, cursor: data.cursor } : c)),
        );
      })
      .on("broadcast", { event: "note-move" }, ({ payload }) => {
        const data = payload as { id: string; x: number; y: number; by: string };
        setNotes((prev) =>
          prev.map((n) => (n.id === data.id ? { ...n, x: data.x, y: data.y, updatedBy: data.by } : n)),
        );
      })
      .on("broadcast", { event: "note-add" }, ({ payload }) => {
        const note = payload as StickyNoteState;
        setNotes((prev) => (prev.some((n) => n.id === note.id) ? prev : [...prev, note]));
      })
      .on("broadcast", { event: "draw-add" }, ({ payload }) => {
        const element = payload as DrawElement;
        if (knownElementIdsRef.current.has(element.id)) return;
        knownElementIdsRef.current.add(element.id);
        setElements((prev) => [...prev, element]);
      })
      .subscribe(async (subStatus) => {
        if (subStatus === "SUBSCRIBED") {
          await channel.track({ name: self.name, color: self.color, userId: self.id });
          setStatus("live");
        }
      });

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [workspaceId, clientId, self.id, self.name, self.color]);

  // --- Demo mode: no Supabase project configured yet. Clearly labeled, never
  // pretends to be live — this exists so the workspace still feels alive
  // during local development or a demo, without a backend wired up. ---
  useEffect(() => {
    if (status !== "demo") return;

    const demo: Collaborator[] = DEMO_COLLABORATORS.map((d) => ({
      id: d.id,
      name: d.name,
      color: colorForId(d.id),
      cursor: { x: 30 + Math.random() * 40, y: 30 + Math.random() * 40 },
    }));
    setCollaborators(demo);

    const joinTimer = setTimeout(() => {
      toast(`${demo[0]?.name} joined the workspace`, {
        description: "Demo mode — connect a Supabase project to make this live.",
      });
    }, 900);

    const moveInterval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => ({
          ...c,
          cursor: {
            x: Math.min(92, Math.max(4, (c.cursor?.x ?? 50) + (Math.random() - 0.5) * 14)),
            y: Math.min(88, Math.max(8, (c.cursor?.y ?? 50) + (Math.random() - 0.5) * 14)),
          },
        })),
      );
    }, 1400);

    const noteTimer = setInterval(() => {
      setNotes((prev) => {
        if (prev.length === 0) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const target = prev[idx];
        if (!target) return prev;
        const mover = demo[Math.floor(Math.random() * demo.length)];
        return prev.map((n, i) =>
          i === idx
            ? {
                ...n,
                x: Math.min(80, Math.max(6, n.x + (Math.random() - 0.5) * 10)),
                y: Math.min(78, Math.max(10, n.y + (Math.random() - 0.5) * 10)),
                updatedBy: mover?.name,
              }
            : n,
        );
      });
    }, 5000);

    return () => {
      clearTimeout(joinTimer);
      clearInterval(moveInterval);
      clearInterval(noteTimer);
    };
  }, [status]);

  const updateCursor = useCallback(
    (pos: CursorPosition | null) => {
      const channel = channelRef.current;
      if (!channel || status !== "live" || !pos) return;
      channel.send({ type: "broadcast", event: "cursor", payload: { id: clientId, cursor: pos } });
    },
    [clientId, status],
  );

  const moveNote = useCallback(
    (id: string, pos: { x: number; y: number }) => {
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x: pos.x, y: pos.y, updatedBy: self.name } : n)));
      const channel = channelRef.current;
      if (channel && status === "live") {
        channel.send({
          type: "broadcast",
          event: "note-move",
          payload: { id, x: pos.x, y: pos.y, by: self.name },
        });
      }
    },
    [self.name, status],
  );

  // Deliberately separate from moveNote: moveNote fires on every pointermove
  // while dragging (needs to be cheap — local state + broadcast only).
  // Writing to the database that often would be wasteful and would hammer
  // the connection pool. This fires once, when the drag actually ends.
  const commitNoteMove = useCallback((id: string) => {
    const note = notesRef.current.find((n) => n.id === id);
    if (!note) return;
    void persistNotePosition(id, note.x, note.y, note.updatedBy);
  }, []);

  const addNote = useCallback(
    (note: StickyNoteState) => {
      setNotes((prev) => [...prev, note]);
      const channel = channelRef.current;
      if (channel && status === "live") {
        channel.send({ type: "broadcast", event: "note-add", payload: note });
      }
      void persistNoteCreate(workspaceId, note);
    },
    [status, workspaceId],
  );

  const addElement = useCallback(
    (element: DrawElement) => {
      knownElementIdsRef.current.add(element.id);
      setElements((prev) => [...prev, element]);
      const channel = channelRef.current;
      if (channel && status === "live") {
        channel.send({ type: "broadcast", event: "draw-add", payload: element });
      }
      void persistElementCreate(workspaceId, element);
    },
    [status, workspaceId],
  );

  const value = useMemo<RealtimeContextValue>(
    () => ({
      status,
      collaborators,
      self,
      notes,
      elements,
      updateCursor,
      moveNote,
      commitNoteMove,
      addNote,
      addElement,
    }),
    [status, collaborators, self, notes, elements, updateCursor, moveNote, commitNoteMove, addNote, addElement],
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}