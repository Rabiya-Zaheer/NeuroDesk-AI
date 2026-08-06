import Link from "next/link";
import { Sparkles, LayoutGrid, GraduationCap, Target } from "lucide-react";

const panelPoints = [
  { icon: LayoutGrid, text: "One shared whiteboard per workspace" },
  { icon: GraduationCap, text: "Study Assistant turns readings into flashcards" },
  { icon: Target, text: "Career Coach reviews resumes and job posts" },
];

export function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-(--color-ink) lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366F1, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-0 size-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #A855F7, transparent 70%)" }}
        />

        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Sparkles className="size-4.5 text-white" />
          </div>
          <span className="font-(family-name:--font-display) text-base font-bold text-white">
            NeuroDesk
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="mb-4 font-(family-name:--font-display) text-3xl font-bold leading-[1.15] text-white text-balance">
            One workspace for everything you&apos;re working on.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {panelPoints.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-slate-300">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <p.icon className="size-4 text-white" />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-500">© 2026 NeuroDesk. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="font-(family-name:--font-display) text-[15px] font-bold text-(--color-ink)">
            NeuroDesk
          </span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-(--color-primary)">
            {eyebrow}
          </p>
          <h1 className="mb-2 font-(family-name:--font-display) text-2xl font-bold text-(--color-ink)">
            {title}
          </h1>
          <p className="mb-8 text-sm text-(--color-ink-muted)">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
