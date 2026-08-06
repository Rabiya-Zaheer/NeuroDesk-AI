import { AiSuggestions } from "@/components/dashboard/ai-suggestions";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export function RightSidebar() {
  return (
    <aside className="flex w-full flex-col gap-5 xl:w-80 xl:shrink-0">
      <AiSuggestions />
      <ActivityFeed />
    </aside>
  );
}
