import { notFound } from "next/navigation";
import { FileText, Upload, MoreVertical } from "lucide-react";
import { getWorkspaceById } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

const dummyDocuments = [
  { id: "d1", name: "Cognitive-Load-Lit-Review.pdf", size: "2.4 MB", updated: "2 days ago" },
  { id: "d2", name: "Interview-Notes-Week3.docx", size: "180 KB", updated: "5 days ago" },
  { id: "d3", name: "Framework-Comparison-Table.xlsx", size: "88 KB", updated: "1 week ago" },
];

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">Documents</p>
          <p className="mt-1 text-sm text-(--color-ink-muted)">
            Upload readings, contracts, or resumes for this workspace.
          </p>
        </div>
        <Button size="sm">
          <Upload className="size-4" />
          Upload
        </Button>
      </div>

      <label className="mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-(--radius-card) border-2 border-dashed border-(--color-border) bg-(--color-surface) px-6 py-12 text-center transition-colors hover:border-(--color-primary)/40 hover:bg-(--color-primary-soft)/30">
        <input type="file" className="hidden" multiple />
        <span className="flex size-10 items-center justify-center rounded-2xl bg-(--color-primary-soft) text-(--color-primary)">
          <Upload className="size-5" />
        </span>
        <p className="text-sm font-medium text-(--color-ink)">Drag files here, or click to browse</p>
        <p className="text-xs text-(--color-ink-faint)">PDF, DOCX, XLSX, PNG up to 25MB</p>
      </label>

      <ul className="flex flex-col divide-y divide-(--color-border) rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
        {dummyDocuments.map((doc) => (
          <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-muted)">
              <FileText className="size-4 text-(--color-ink-muted)" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-(--color-ink)">{doc.name}</p>
              <p className="text-xs text-(--color-ink-faint)">
                {doc.size} · Updated {doc.updated}
              </p>
            </div>
            <button
              className="flex size-8 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-(--color-ink)"
              aria-label={`More options for ${doc.name}`}
            >
              <MoreVertical className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
