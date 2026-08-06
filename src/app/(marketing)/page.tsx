import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/marketing/landing-nav";
import { WorkspaceHubGraphic } from "@/components/marketing/workspace-hub-graphic";
import { FeatureGrid } from "@/components/marketing/feature-grid";

const steps = [
  {
    n: "01",
    title: "Create a workspace",
    description: "One for your thesis, one for your job search, one for a client — however your work is split.",
  },
  {
    n: "02",
    title: "Bring in what you're working on",
    description: "A reading, a resume, a rough sketch. It lands on the whiteboard the moment you drop it in.",
  },
  {
    n: "03",
    title: "Everything stays connected",
    description: "Study Assistant, Career Coach, and AI Chat all read from the same board — nothing is siloed.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-(--color-background)">
      <LandingNav />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-xs font-medium text-(--color-ink-muted) shadow-(--shadow-soft)">
            <Sparkles className="size-3.5 text-(--color-primary)" />
            One workspace, not six disconnected apps
          </div>
          <h1 className="font-(family-name:--font-display) text-4xl font-bold leading-[1.1] text-(--color-ink) text-balance sm:text-5xl">
            One workspace for everything you&apos;re working on.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-(--color-ink-muted)">
            NeuroDesk gives your whiteboard, documents, study notes, and job search a shared home —
            so nothing gets lost between six different tabs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/signup">
                Get started free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-(--color-ink-faint)">No credit card required.</p>
        </div>

        <WorkspaceHubGraphic />
      </section>

      <FeatureGrid />

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-secondary)">
            How it works
          </p>
          <h2 className="font-(family-name:--font-display) text-3xl font-bold text-(--color-ink) text-balance">
            Three steps to a workspace that remembers everything
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="font-(family-name:--font-mono) text-sm font-semibold text-(--color-primary)">{s.n}</p>
              <p className="mt-3 font-(family-name:--font-display) text-lg font-semibold text-(--color-ink)">
                {s.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-(--color-ink-muted)">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-(--radius-card) bg-(--color-ink) px-8 py-14 text-center shadow-(--shadow-soft-lg)">
          <div
            className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)" }}
          />
          <h2 className="relative font-(family-name:--font-display) text-3xl font-bold text-white text-balance">
            Start your workspace today
          </h2>
          <p className="relative mx-auto mt-3 max-w-sm text-sm text-slate-300">
            Free to start. Your whiteboard, documents, and tools — one place, from day one.
          </p>
          <Button size="lg" className="relative mt-7" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--color-border) px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
              <Sparkles className="size-3.5 text-white" />
            </span>
            <span className="font-(family-name:--font-display) text-sm font-bold text-(--color-ink)">
              NeuroDesk
            </span>
          </div>
          <p className="text-xs text-(--color-ink-faint)">© 2026 NeuroDesk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
