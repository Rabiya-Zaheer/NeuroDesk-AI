"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Target, Building2, Trash2, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createApplication,
  deleteApplication,
  updateApplicationStage,
  analyzeResumeMatch,
  type JobApplicationItem,
} from "@/features/workspace/career-actions";

const STAGE_LABELS: Record<string, string> = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const STAGE_STYLES: Record<string, string> = {
  applied: "bg-(--color-surface-muted) text-(--color-ink-muted)",
  interview: "bg-(--color-primary-soft) text-(--color-primary)",
  offer: "bg-(--color-accent-soft) text-(--color-accent)",
  rejected: "bg-red-50 text-red-600",
};

export function CareerCoachView({
  workspaceId,
  workspaceName,
  initialApplications,
}: {
  workspaceId: string;
  workspaceName: string;
  initialApplications: JobApplicationItem[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [, startTransition] = useTransition();

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<{ score: number; feedback: string } | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [isMatching, startMatching] = useTransition();

  const handleAdd = () => {
    if (!company.trim() || !role.trim()) return;
    const tempId = `temp-${Date.now()}`;
    setApplications((prev) => [
      { id: tempId, company, role, stage: "applied", createdAt: new Date().toISOString() },
      ...prev,
    ]);
    const c = company;
    const r = role;
    setCompany("");
    setRole("");

    startTransition(async () => {
      const result = await createApplication(workspaceId, c, r);
      if (!result.ok) {
        toast.error("Couldn't add application", { description: result.error });
        setApplications((prev) => prev.filter((a) => a.id !== tempId));
      }
    });
  };

  const handleStageChange = (id: string, stage: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)));
    startTransition(async () => {
      const result = await updateApplicationStage(id, stage);
      if (!result.ok) toast.error("Couldn't update stage", { description: result.error });
    });
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    startTransition(() => {
      void deleteApplication(id);
    });
  };

  const handleAnalyze = () => {
    setMatchError(null);
    setMatchResult(null);
    startMatching(async () => {
      const result = await analyzeResumeMatch(resumeText, jobDescription);
      if (!result.ok) {
        setMatchError(result.error);
        return;
      }
      setMatchResult({ score: result.score, feedback: result.feedback });
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-(--color-purple-soft) text-(--color-purple)">
          <Target className="size-4.5" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">Career Coach</p>
          <p className="text-sm text-(--color-ink-muted)">Applications and resume fit for {workspaceName}</p>
        </div>
      </div>

      <section className="mb-8 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-6 shadow-(--shadow-soft)">
        <p className="mb-3 text-sm font-semibold text-(--color-ink)">Resume match score</p>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={5}
            className="flex-1 rounded-2xl border border-(--color-border) bg-(--color-background) p-3 text-xs text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40"
          />
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={5}
            className="flex-1 rounded-2xl border border-(--color-border) bg-(--color-background) p-3 text-xs text-(--color-ink) placeholder:text-(--color-ink-faint) focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40"
          />
        </div>
        <Button
          size="sm"
          onClick={handleAnalyze}
          disabled={isMatching || !resumeText.trim() || !jobDescription.trim()}
        >
          {isMatching && <Loader2 className="size-3.5 animate-spin" />}
          Analyze match
        </Button>

        {matchError && <p className="mt-3 text-xs text-red-600">{matchError}</p>}

        {matchResult && (
          <div className="mt-4">
            <div className="flex items-end gap-4">
              <p className="font-(family-name:--font-display) text-4xl font-bold text-(--color-ink)">
                {matchResult.score}
              </p>
              <div className="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-(--color-surface-muted)">
                <div
                  className="h-full rounded-full bg-(--color-secondary) transition-all"
                  style={{ width: `${matchResult.score}%` }}
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-(--color-ink-muted)">{matchResult.feedback}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
          Applications
        </h2>

        <div className="mb-3 flex gap-2">
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" onClick={handleAdd} disabled={!company.trim() || !role.trim()}>
            <Plus className="size-4" />
          </Button>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-(--radius-card) border border-dashed border-(--color-border) bg-(--color-surface) px-6 py-10 text-center">
            <p className="text-sm text-(--color-ink-muted)">No applications yet — add your first one above.</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-(--color-border) rounded-(--radius-card) border border-(--color-border) bg-(--color-surface)">
            {applications.map((app) => (
              <li key={app.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-(--color-surface-muted)">
                  <Building2 className="size-4 text-(--color-ink-muted)" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--color-ink)">{app.company}</p>
                  <p className="text-xs text-(--color-ink-faint)">{app.role}</p>
                </div>
                <select
                  value={app.stage}
                  onChange={(e) => handleStageChange(app.id, e.target.value)}
                  className={`rounded-full border-0 px-3 py-1 text-xs font-medium ${STAGE_STYLES[app.stage] ?? STAGE_STYLES.applied}`}
                >
                  {Object.entries(STAGE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="flex size-8 items-center justify-center rounded-lg text-(--color-ink-faint) hover:bg-(--color-surface-muted) hover:text-red-600"
                  aria-label={`Delete ${app.company} application`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}