import { notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { WhiteboardCanvas } from "@/components/workspace/whiteboard-canvas";

export default async function WhiteboardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) notFound();

  return <WhiteboardCanvas />;
}
