import { notFound } from "next/navigation";
import { GraduationCap, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { getWorkspaceById } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

const flashcards = [
  { q: "What is extraneous cognitive load?", a: "Load caused by how information is presented, not by the task itself." },
  { q: "Sweller's three load types?", a: "Intrinsic, extraneous, and germane cognitive load." },
  { q: "Why do rounded, grouped UI elements reduce load?", a: "They exploit chunking, letting users treat a group as one unit." },
];

const readings = [
  { title: "Cognitive Load Theory (Sweller, 1988)", progress: 100 },
  { title: "Interface Complexity & Chunking", progress: 70 },
  { title: "Working Memory in HCI", progress: 20 },
];

export default async function StudyPage({
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
        <span className="flex size-9 items-center justify-center rounded-2xl bg-(--color-accent-soft) text-(--color-accent)">
          <GraduationCap className="size-4.5" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">
            Study Assistant
          </p>
          <p className="text-sm text-(--color-ink-muted)">Flashcards and reading progress for {workspace.name}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Flashcards
        </h2>
        <div className="flex flex-col items-center gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-8 shadow-(--shadow-soft)">
          <div className="flex min-h-32 w-full max-w-md flex-col items-center justify-center rounded-2xl bg-(--color-accent-soft) p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-(--color-accent)">Question</p>
            <p className="mt-2 text-base font-medium text-(--color-ink)">{flashcards[0]?.q}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Previous card">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="size-3.5" />
              Flip
            </Button>
            <Button variant="ghost" size="icon" aria-label="Next card">
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <p className="text-xs text-(--color-ink-faint)">Card 1 of {flashcards.length}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Reading progress
        </h2>
        <div className="flex flex-col gap-3">
          {readings.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 shadow-(--shadow-soft)"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-(--color-ink)">{r.title}</p>
                <span className="text-xs font-medium text-(--color-ink-faint)">{r.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-(--color-surface-muted)">
                <div
                  className="h-full rounded-full bg-(--color-accent) transition-all"
                  style={{ width: `${r.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
