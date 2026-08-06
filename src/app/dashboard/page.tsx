import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { PromptBox } from "@/components/dashboard/prompt-box";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { WorkspacePreviewCard } from "@/components/dashboard/workspace-preview-card";
import { RightSidebar } from "@/components/dashboard/right-sidebar";
import { Fab } from "@/components/dashboard/fab";
import { quickActions, workspaces } from "@/lib/dummy-data";

export const metadata: Metadata = { title: "Home" };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-8 px-6 py-8 xl:flex-row xl:items-start xl:gap-6 xl:px-8">
      <div className="min-w-0 flex-1">
        <div className="mb-8">
          <p className="font-(family-name:--font-display) text-2xl font-bold text-(--color-ink) sm:text-[28px]">
            {greeting()}, {firstName}
          </p>
          <p className="mt-1 text-sm text-(--color-ink-muted)">
            Here&apos;s what&apos;s waiting across your workspaces.
          </p>
        </div>

        <div className="mb-10">
          <PromptBox />
        </div>

        <section className="mb-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} action={action} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-(--color-ink-faint)">
              Continue working
            </h2>
            <a href="/dashboard" className="text-xs font-medium text-(--color-primary) hover:underline">
              View all
            </a>
          </div>
          <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
            {workspaces.map((ws) => (
              <WorkspacePreviewCard key={ws.id} workspace={ws} />
            ))}
          </div>
        </section>
      </div>

      <RightSidebar />
      <Fab />
    </div>
  );
}
