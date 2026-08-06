import type { Metadata } from "next";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <div className="px-6 py-8 xl:px-8">
      <p className="mb-6 font-(family-name:--font-display) text-2xl font-bold text-(--color-ink)">History</p>
      <div className="max-w-xl">
        <ActivityFeed />
      </div>
    </div>
  );
}
