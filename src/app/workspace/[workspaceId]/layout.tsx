import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getWorkspaceById, initialWhiteboardNotes } from "@/lib/dummy-data";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { RealtimeWorkspaceProvider } from "@/features/workspace/realtime-context";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { workspaceId } = await params;
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) notFound();

  return (
    <RealtimeWorkspaceProvider
      workspaceId={workspaceId}
      currentUser={{ id: session.userId, name: session.name }}
      initialNotes={initialWhiteboardNotes}
    >
      <div className="flex h-screen overflow-hidden bg-(--color-background)">
        <WorkspaceSidebar workspace={workspace} />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkspaceHeader workspace={workspace} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RealtimeWorkspaceProvider>
  );
}
