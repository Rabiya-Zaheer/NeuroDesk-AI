"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SentryDebugPage() {
  const [clientTriggered, setClientTriggered] = useState(false);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
      <div>
        <p className="font-(family-name:--font-display) text-xl font-bold text-(--color-ink)">
          Sentry integration check
        </p>
        <p className="mt-1 text-sm text-(--color-ink-muted)">
          Not a real feature — a manual test page for confirming errors reach the Sentry
          dashboard after NEXT_PUBLIC_SENTRY_DSN is set.
        </p>
      </div>

      <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5">
        <p className="mb-1 text-sm font-semibold text-(--color-ink)">1. Client-side error</p>
        <p className="mb-3 text-xs text-(--color-ink-muted)">
          Captured directly via Sentry.captureException from the browser.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            try {
              throw new Error("NeuroDesk Sentry test error — intentional, from /debug/sentry (client)");
            } catch (err) {
              Sentry.captureException(err);
              setClientTriggered(true);
            }
          }}
        >
          Trigger client error
        </Button>
        {clientTriggered && (
          <p className="mt-2 text-xs text-(--color-secondary)">Sent — check the Sentry dashboard.</p>
        )}
      </div>

      <div className="rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-5">
        <p className="mb-1 text-sm font-semibold text-(--color-ink)">2. Server-side error</p>
        <p className="mb-3 text-xs text-(--color-ink-muted)">
          Captured via instrumentation.ts&apos;s onRequestError hook when a route handler throws.
        </p>
        <a href="/api/debug/sentry-test" target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline">
            Open server test endpoint
          </Button>
        </a>
      </div>
    </div>
  );
}