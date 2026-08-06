import {
  BookOpen,
  Briefcase,
  Users,
  Layers,
  FileSearch,
  LayoutGrid,
  GraduationCap,
  Target,
  Sparkles,
  BellRing,
  MessageSquareText,
  Upload,
  Trello,
  StickyNote,
  Edit3,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  users: Users,
  layers: Layers,
  "file-search": FileSearch,
  "layout-grid": LayoutGrid,
  "graduation-cap": GraduationCap,
  target: Target,
  sparkles: Sparkles,
  "bell-ring": BellRing,
  "message-square-text": MessageSquareText,
  upload: Upload,
  trello: Trello,
  "sticky-note": StickyNote,
  "edit-3": Edit3,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sparkles;
}
