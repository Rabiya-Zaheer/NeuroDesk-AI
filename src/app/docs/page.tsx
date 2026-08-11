import type { Metadata } from "next";
import { SwaggerUiLoader } from "@/components/swagger-ui-loader";

export const metadata: Metadata = { title: "API Docs" };

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-(--color-border) bg-(--color-surface) px-6 py-4">
        <p className="font-(family-name:--font-display) text-lg font-bold text-(--color-ink)">
          NeuroDesk API Reference
        </p>
        <p className="mt-1 text-sm text-(--color-ink-muted)">
          REST endpoints — currently the Chrome extension&apos;s session, workspace-listing, and
          capture endpoints. Most of the app&apos;s writes (whiteboard, documents) go through Next.js
          Server Actions instead of REST, which don&apos;t show up here since they aren&apos;t
          plain HTTP endpoints with a request/response contract in the same sense.
        </p>
      </div>
      <SwaggerUiLoader />
    </div>
  );
}