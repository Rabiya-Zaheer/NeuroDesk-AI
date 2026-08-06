import { notFound } from "next/navigation";
import { Target, Building2 } from "lucide-react";
import { getWorkspaceById } from "@/lib/dummy-data";

const applications = [
  { company: "Figma", role: "Product Designer", stage: "Interview", color: "primary" as const },
  { company: "Linear", role: "Design Engineer", stage: "Applied", color: "secondary" as const },
  { company: "Notion", role: "Product Designer II", stage: "Applied", color: "secondary" as const },
  { company: "Arc", role: "Senior Product Designer", stage: "Offer", color: "accent" as const },
];

const stageStyles: Record<string, string> = {
  primary: "bg-(--color-primary-soft) text-(--color-primary)",
  secondary: "bg-(--color-surface-muted) text-(--color-ink-muted)",
  accent: "bg-(--color-accent-soft) text-(--color-accent)",
};

export default async function CareerPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-(--color-purple-soft) text-(--color-purple)">
          <Target className="size-4.5" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">Career Coach</p>
          <p className="text-sm text-(--color-ink-muted)">Applications and resume fit for {workspace.name}</p>
        </div>
      </div>

      <section className="mb-8 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-soft)">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-(--color-ink)">Resume match score</p>
          <span className="text-xs font-medium text-(--color-secondary)">Strong fit</span>
        </div>
        <div className="flex items-end gap-4">
          <p className="font-(family-name:--font-display) text-4xl font-bold text-(--color-ink)">82</p>
          <div className="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-(--color-surface-muted)">
            <div className="h-full w-[82%] rounded-full bg-(--color-secondary)" />
          </div>
        </div>
        <p className="mt-3 text-xs text-(--color-ink-muted)">
          Based on your most recent resume upload against the last job post you added.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Applications
        </h2>
        <ul className="flex flex-col divide-y divide-(--color-border) rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
          {applications.map((app) => (
            <li key={app.company} className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-muted)">
                <Building2 className="size-4 text-(--color-ink-muted)" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-(--color-ink)">{app.company}</p>
                <p className="text-xs text-(--color-ink-faint)">{app.role}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${stageStyles[app.color]}`}>
                {app.stage}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
