export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  memberCount: number;
  lastActivity: string; // ISO date
  progress: number; // 0-100, used for "continue working" cards
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  color: "primary" | "secondary" | "accent" | "purple";
}

export interface AiSuggestion {
  id: string;
  title: string;
  description: string;
  workspaceName: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string; // ISO date
  icon: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "ai_suggestion";
  read: boolean;
  timestamp: string;
}

export type WorkspaceTool =
  | "whiteboard"
  | "documents"
  | "ai-chat"
  | "study"
  | "career"
  | "activity";

// ---- Real-time collaboration types ----

export interface CursorPosition {
  x: number; // 0-100, percentage of canvas width
  y: number; // 0-100, percentage of canvas height
}

export interface Collaborator {
  id: string;
  name: string;
  color: string; // hex
  cursor: CursorPosition | null;
  isSelf?: boolean;
}

export interface StickyNoteState {
  id: string;
  text: string;
  x: number; // 0-100
  y: number; // 0-100
  rotation: number;
  color: "primary" | "secondary" | "accent" | "purple";
  updatedBy?: string;
}

export type RealtimeConnectionStatus = "connecting" | "live" | "demo";

// ---- Canvas drawing types (Task 4) ----

export interface DrawPoint {
  x: number; // 0-100, percentage of canvas width — resolution-independent
  y: number; // 0-100, percentage of canvas height
}

export interface DrawStroke {
  id: string;
  kind: "stroke";
  points: DrawPoint[];
  color: string; // hex, defaults to the author's collaborator color
  width: number; // px, at 100% zoom
  authorId: string;
}

export interface DrawRect {
  id: string;
  kind: "rect";
  start: DrawPoint;
  end: DrawPoint;
  color: string;
  width: number;
  authorId: string;
}

export type DrawElement = DrawStroke | DrawRect;



