import { LayoutGrid, FileText, MessageSquare, GraduationCap, Target, Users } from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Whiteboard",
    description: "A shared canvas for mind-maps, sticky notes, and rough sketches — the spine every tool writes to.",
    chip: "bg-(--color-primary-soft) text-(--color-primary)",
  },
  {
    icon: FileText,
    title: "Documents",
    description: "Drop in PDFs, resumes, or contracts. They stay attached to the workspace they belong to.",
    chip: "bg-(--color-secondary-soft) text-(--color-secondary)",
  },
  {
    icon: MessageSquare,
    title: "AI Chat",
    description: "Ask questions grounded in what's actually on your whiteboard and in your documents.",
    chip: "bg-(--color-purple-soft) text-(--color-purple)",
  },
  {
    icon: GraduationCap,
    title: "Study Assistant",
    description: "Turn readings into flashcards and track comprehension across a whole course.",
    chip: "bg-(--color-accent-soft) text-(--color-accent)",
  },
  {
    icon: Target,
    title: "Career Coach",
    description: "Score your resume against a job post and keep every application in one tracker.",
    chip: "bg-(--color-purple-soft) text-(--color-purple)",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Invite people into a workspace and see changes land on the whiteboard as they happen.",
    chip: "bg-(--color-primary-soft) text-(--color-primary)",
  },
];

export function FeatureGrid() {
  return (
    <section id="tools" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-primary)">Tools</p>
        <h2 className="font-(family-name:--font-display) text-3xl font-bold text-(--color-ink) text-balance">
          Six tools. One workspace.
        </h2>
        <p className="mt-3 text-(--color-ink-muted)">
          Nothing lives in isolation — every tool reads from and writes to the same workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-soft) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-soft-lg)"
          >
            <span className={`mb-4 flex size-11 items-center justify-center rounded-2xl ${f.chip}`}>
              <f.icon className="size-5" />
            </span>
            <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-ink)">
              {f.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-(--color-ink-muted)">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
