import { notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { listFlashcards, listReadings } from "@/features/workspace/study-actions";
import { StudyAssistantView } from "@/components/workspace/study-assistant-view";

export default async function StudyPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) notFound();

  const [flashcards, readings] = await Promise.all([
    listFlashcards(workspaceId),
    listReadings(workspaceId),
  ]);

  return (
    <StudyAssistantView
      workspaceId={workspaceId}
      workspaceName={workspace.name}
      initialFlashcards={flashcards}
      initialReadings={readings}
    />
  );
}