import { LayoutGrid, FileText, MessageSquare, GraduationCap, Target, Sparkles } from "lucide-react";

const nodes = [
  { id: "whiteboard", label: "Whiteboard", icon: LayoutGrid, style: "left-[6%] top-[8%]", chip: "bg-(--color-primary-soft) text-(--color-primary)" },
  { id: "documents", label: "Documents", icon: FileText, style: "right-[4%] top-[4%]", chip: "bg-(--color-secondary-soft) text-(--color-secondary)" },
  { id: "chat", label: "AI Chat", icon: MessageSquare, style: "right-[0%] top-[52%]", chip: "bg-(--color-purple-soft) text-(--color-purple)" },
  { id: "study", label: "Study Assistant", icon: GraduationCap, style: "right-[10%] bottom-[2%]", chip: "bg-(--color-accent-soft) text-(--color-accent)" },
  { id: "career", label: "Career Coach", icon: Target, style: "left-[2%] bottom-[6%]", chip: "bg-(--color-purple-soft) text-(--color-purple)" },
  { id: "collab", label: "Real-time", icon: Sparkles, style: "left-[0%] top-[48%]", chip: "bg-(--color-primary-soft) text-(--color-primary)" },
];

export function WorkspaceHubGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" aria-hidden="true">
        <line x1="200" y1="200" x2="80" y2="70" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="330" y2="55" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="370" y2="220" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="300" y2="350" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="60" y2="340" stroke="var(--color-border)" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="35" y2="200" stroke="var(--color-border)" strokeWidth="1.5" />
      </svg>

      {/* Central hub */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-3xl border border-(--color-border) bg-(--color-surface) px-6 py-5 text-center shadow-(--shadow-soft-lg)">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
          <Sparkles className="size-5 text-white" />
        </span>
        <p className="font-(family-name:--font-display) text-sm font-bold text-(--color-ink)">Your Workspace</p>
        <p className="text-[11px] text-(--color-ink-faint)">Everything connects here</p>
      </div>

      {nodes.map((n) => (
        <div
          key={n.id}
          className={`absolute flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-surface) px-3 py-2 shadow-(--shadow-soft) ${n.style}`}
        >
          <span className={`flex size-7 items-center justify-center rounded-xl ${n.chip}`}>
            <n.icon className="size-3.5" />
          </span>
          <span className="text-xs font-medium text-(--color-ink)">{n.label}</span>
        </div>
      ))}
    </div>
  );
}
