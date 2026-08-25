import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";

export function EmptyWorkspaceState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-8 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
        <Sparkles className="size-5 text-white" />
      </span>
      <div>
        <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-ink)">
          Create your first workspace
        </p>
        <p className="mt-1 max-w-sm text-sm text-(--color-ink-muted)">
          A workspace holds a whiteboard, documents, and AI chat for one thing you&apos;re working
          on — a thesis, a job search, a project.
        </p>
      </div>
      <CreateWorkspaceDialog trigger={<Button size="sm">New workspace</Button>} />
    </div>
  );
}