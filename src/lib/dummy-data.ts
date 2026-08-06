import type {
  ActivityItem,
  AiSuggestion,
  NotificationItem,
  QuickAction,
  WorkspaceSummary,
} from "@/types";

export const currentUser = {
  name: "Amara Khan",
  email: "amara@neurodesk.app",
  jobTitle: "Product Design Student",
  image: null as string | null,
};

export const workspaces: WorkspaceSummary[] = [
  {
    id: "4fa2b9c1",
    name: "Thesis Research",
    slug: "thesis-research",
    icon: "book-open",
    color: "primary",
    description: "Cognitive load in interface design — lit review & drafts",
    memberCount: 1,
    lastActivity: "2026-07-23T08:15:00Z",
    progress: 62,
  },
  {
    id: "7cd881ff",
    name: "Job Search — Product Design",
    slug: "job-search-product-design",
    icon: "briefcase",
    color: "secondary",
    description: "Applications, resume versions, and interview prep",
    memberCount: 1,
    lastActivity: "2026-07-22T19:40:00Z",
    progress: 34,
  },
  {
    id: "9e12a04d",
    name: "Systems Design Study Group",
    slug: "systems-design-study-group",
    icon: "users",
    color: "purple",
    description: "Shared whiteboard with Sana and Bilal",
    memberCount: 3,
    lastActivity: "2026-07-21T14:05:00Z",
    progress: 18,
  },
  {
    id: "2b6f77aa",
    name: "Freelance — Orbit App",
    slug: "freelance-orbit-app",
    icon: "layers",
    color: "accent",
    description: "Client documents, contracts, and onboarding notes",
    memberCount: 1,
    lastActivity: "2026-07-19T11:22:00Z",
    progress: 80,
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "qa-analyze",
    label: "Analyze Document",
    description: "Upload a PDF, resume, or reading",
    href: "/workspace/4fa2b9c1/documents",
    icon: "file-search",
    color: "primary",
  },
  {
    id: "qa-whiteboard",
    label: "Start Whiteboard",
    description: "Open a blank canvas",
    href: "/workspace/4fa2b9c1/whiteboard",
    icon: "layout-grid",
    color: "secondary",
  },
  {
    id: "qa-study",
    label: "Study Assistant",
    description: "Turn readings into flashcards",
    href: "/workspace/4fa2b9c1/study",
    icon: "graduation-cap",
    color: "accent",
  },
  {
    id: "qa-career",
    label: "Career Coach",
    description: "Review a job post or resume",
    href: "/workspace/7cd881ff/career",
    icon: "target",
    color: "purple",
  },
];

export const aiSuggestions: AiSuggestion[] = [
  {
    id: "sug-1",
    title: "Summarize your last 3 thesis sources",
    description: "You added 3 new PDFs this week — want a synthesis note?",
    workspaceName: "Thesis Research",
    icon: "sparkles",
  },
  {
    id: "sug-2",
    title: "3 applications going stale",
    description: "No follow-up sent in 9+ days for Figma, Linear, Notion roles.",
    workspaceName: "Job Search — Product Design",
    icon: "bell-ring",
  },
  {
    id: "sug-3",
    title: "Study group whiteboard needs a recap",
    description: "12 new nodes added since your last visit.",
    workspaceName: "Systems Design Study Group",
    icon: "message-square-text",
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    actor: "You",
    action: "uploaded",
    target: "Cognitive-Load-Lit-Review.pdf",
    timestamp: "2026-07-23T08:15:00Z",
    icon: "upload",
  },
  {
    id: "act-2",
    actor: "You",
    action: "moved 4 cards on",
    target: "Job Search Kanban",
    timestamp: "2026-07-22T19:40:00Z",
    icon: "trello",
  },
  {
    id: "act-3",
    actor: "Sana Malik",
    action: "added 6 sticky notes to",
    target: "Systems Design Whiteboard",
    timestamp: "2026-07-21T14:05:00Z",
    icon: "sticky-note",
  },
  {
    id: "act-4",
    actor: "You",
    action: "renamed a section in",
    target: "Freelance — Orbit App",
    timestamp: "2026-07-19T11:22:00Z",
    icon: "edit-3",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Welcome to NeuroDesk",
    message: "Your workspace is ready. Start with a whiteboard or upload a document.",
    type: "info",
    read: false,
    timestamp: "2026-07-18T09:00:00Z",
  },
  {
    id: "notif-2",
    title: "Suggestion ready",
    message: "A synthesis note is ready for Thesis Research.",
    type: "ai_suggestion",
    read: false,
    timestamp: "2026-07-23T08:20:00Z",
  },
  {
    id: "notif-3",
    title: "Export complete",
    message: "Your Job Search board was exported to PDF.",
    type: "success",
    read: true,
    timestamp: "2026-07-20T16:00:00Z",
  },
];

export function getWorkspaceById(id: string): WorkspaceSummary | undefined {
  return workspaces.find((w) => w.id === id);
}