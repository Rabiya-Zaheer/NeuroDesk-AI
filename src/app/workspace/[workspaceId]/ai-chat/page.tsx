import { notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { getChatHistory } from "@/features/workspace/chat-actions";
import { AiChatView } from "@/components/workspace/ai-chat-view";

export default async function AiChatPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) notFound();

  const messages = await getChatHistory(workspaceId);

  return <AiChatView workspaceId={workspaceId} workspaceName={workspace.name} initialMessages={messages} />;
}