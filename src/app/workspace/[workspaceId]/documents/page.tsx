import { notFound } from "next/navigation";
import { getWorkspaceById } from "@/lib/dummy-data";
import { listDocuments } from "@/features/workspace/document-actions";
import { DocumentsView } from "@/components/workspace/documents-view";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  const documents = await listDocuments(workspaceId);

  return <DocumentsView workspaceId={workspaceId} initialDocuments={documents} />;
}