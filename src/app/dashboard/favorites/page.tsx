import type { Metadata } from "next";
import { Star } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="px-6 py-8 xl:px-8">
      <p className="mb-6 font-(family-name:--font-display) text-2xl font-bold text-(--color-ink)">Favorites</p>
      <EmptyState
        icon={Star}
        title="Nothing pinned yet"
        description="Star a whiteboard, document, or workspace and it'll show up here for quick access."
      />
    </div>
  );
}
