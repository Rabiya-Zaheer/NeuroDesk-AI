import { notFound } from "next/navigation";
import { getWorkspaceForUser } from "@/features/workspace/workspace-actions";
import { listDocuments } from "@/features/workspace/document-actions";
import { DocumentsView } from "@/components/workspace/documents-view";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = await getWorkspaceForUser(workspaceId);
  if (!workspace) notFound();

  const documents = await listDocuments(workspaceId);

  return <DocumentsView workspaceId={workspaceId} initialDocuments={documents} />;
}