import { notFound } from "next/navigation";
import { getWorkspaceById } from "@/lib/dummy-data";
import { WhiteboardCanvas } from "@/components/workspace/whiteboard-canvas";

export default async function WhiteboardPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  return <WhiteboardCanvas />;
}
