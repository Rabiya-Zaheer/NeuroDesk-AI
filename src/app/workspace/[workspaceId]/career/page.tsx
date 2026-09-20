import { notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { listApplications } from "@/features/workspace/career-actions";
import { CareerCoachView } from "@/components/workspace/career-coach-view";

export default async function CareerPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) notFound();

  const applications = await listApplications(workspaceId);

  return (
    <CareerCoachView workspaceId={workspaceId} workspaceName={workspace.name} initialApplications={applications} />
  );
}