"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { FileText, Upload, MoreVertical, Trash2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { uploadDocument, deleteDocument, listDocuments, type DocumentListItem } from "@/features/workspace/document-actions";

export function DocumentsView({
  workspaceId,
  initialDocuments,
}: {
  workspaceId: string;
  initialDocuments: DocumentListItem[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, startUpload] = useTransition();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);

        startUpload(async () => {
          const result = await uploadDocument(workspaceId, formData);
          if (!result.ok) {
            toast.error(`Couldn't upload ${file.name}`, { description: result.error });
            return;
          }
          toast.success(`${file.name} uploaded`);
          setDocuments(await listDocuments(workspaceId));
        });
      }
    },
    [workspaceId],
  );

  const handleDelete = useCallback((id: string, name: string) => {
    setOpenMenuId(null);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    startUpload(async () => {
      const result = await deleteDocument(id);
      if (!result.ok) {
        toast.error(`Couldn't delete ${name}`, { description: result.error });
        return;
      }
      toast.success(`${name} deleted`);
    });
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">Documents</p>
          <p className="mt-1 text-sm text-(--color-ink-muted)">
            Upload readings, contracts, or resumes for this workspace.
          </p>
        </div>
        <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
        </Button>
      </div>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-(--radius-card) border-2 border-dashed px-6 py-12 text-center transition-colors ${
          isDragging
            ? "border-(--color-primary) bg-(--color-primary-soft)/50"
            : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)/40 hover:bg-(--color-primary-soft)/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className="flex size-10 items-center justify-center rounded-2xl bg-(--color-primary-soft) text-(--color-primary)">
          <Upload className="size-5" />
        </span>
        <p className="text-sm font-medium text-(--color-ink)">Drag files here, or click to browse</p>
        <p className="text-xs text-(--color-ink-faint)">Up to 25MB per file</p>
      </label>

      {documents.length === 0 ? (
        <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-12 text-center">
          <p className="text-sm text-(--color-ink-muted)">No documents yet — upload the first one above.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-(--color-border) rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-muted)">
                <FileText className="size-4 text-(--color-ink-muted)" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-(--color-ink)">{doc.name}</p>
                <p className="text-xs text-(--color-ink-faint)">
                  {formatFileSize(doc.sizeBytes)} · Uploaded by {doc.uploadedBy}
                </p>
              </div>

              {doc.downloadUrl && (
                <a                
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-(--color-ink)"
                  aria-label={`Download ${doc.name}`}
                >
                  <Download className="size-4" />
                </a>
              )}

              <div className="relative">
                <button
                  onClick={() => setOpenMenuId((prev) => (prev === doc.id ? null : doc.id))}
                  className="flex size-8 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-(--color-ink)"
                  aria-label={`More options for ${doc.name}`}
                >
                  <MoreVertical className="size-4" />
                </button>
                {openMenuId === doc.id && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-xl border border-(--color-border) bg-(--color-surface) py-1 shadow-(--shadow-soft-lg)">
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}