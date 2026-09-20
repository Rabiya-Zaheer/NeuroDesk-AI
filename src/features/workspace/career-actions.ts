"use server";

import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { getOpenAiClient } from "@/lib/openai";

export interface JobApplicationItem {
  id: string;
  company: string;
  role: string;
  stage: string;
  notes?: string;
  createdAt: string;
}

const STAGES = ["applied", "interview", "offer", "rejected"] as const;

export async function listApplications(workspaceId: string): Promise<JobApplicationItem[]> {
  const rows = await db.jobApplication.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });
  return rows.map((a) => ({
    id: a.id,
    company: a.company,
    role: a.role,
    stage: a.stage,
    notes: a.notes ?? undefined,
    createdAt: a.createdAt.toISOString(),
  }));
}

export async function createApplication(
  workspaceId: string,
  company: string,
  role: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const trimmedCompany = company.trim();
  const trimmedRole = role.trim();
  if (!trimmedCompany || !trimmedRole) return { ok: false, error: "Company and role are required." };

  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) return { ok: false, error: "Workspace not found." };

  await db.jobApplication.create({
    data: { workspaceId, company: trimmedCompany, role: trimmedRole, stage: "applied" },
  });

  return { ok: true };
}

export async function updateApplicationStage(
  id: string,
  stage: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };
  if (!STAGES.includes(stage as (typeof STAGES)[number])) return { ok: false, error: "Invalid stage." };

  await db.jobApplication.update({ where: { id }, data: { stage } }).catch(() => {});
  return { ok: true };
}

export async function deleteApplication(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  await db.jobApplication.delete({ where: { id } }).catch(() => {});
  return { ok: true };
}

/**
 * Deliberately stateless — resume/job text is pasted in, scored, and
 * discarded, not saved. A real "upload your resume once and match it
 * against many jobs" flow needs full-text extraction from uploaded
 * documents, which is a separate, larger feature (the "document
 * analyzer"). This is the honest version achievable without it.
 */
export async function analyzeResumeMatch(
  resumeText: string,
  jobDescription: string,
): Promise<{ ok: true; score: number; feedback: string } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  if (!resumeText.trim() || !jobDescription.trim()) {
    return { ok: false, error: "Paste both your resume text and the job description." };
  }

  const client = getOpenAiClient();
  if (!client) {
    return { ok: false, error: "AI isn't configured yet — add an OPENAI_API_KEY to enable resume matching." };
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You score how well a resume matches a job description. Respond with strict JSON: {"score": <0-100 integer>, "feedback": "<2-3 sentence explanation, mention 1-2 concrete gaps or strengths>"}. Nothing else.',
        },
        {
          role: "user",
          content: `RESUME:\n${resumeText.slice(0, 6000)}\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 6000)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { score?: number; feedback?: string };
    const score = typeof parsed.score === "number" ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 0;
    const feedback = parsed.feedback ?? "Couldn't generate feedback.";

    return { ok: true, score, feedback };
  } catch (err) {
    console.error("[career] resume match failed", err);
    Sentry.captureException(err, { tags: { feature: "career-resume-match" } });
    return { ok: false, error: "The AI request failed — try again in a moment." };
  }
}