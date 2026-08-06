import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border)/70 bg-(--color-background)/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-(--color-primary) to-(--color-purple)">
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="font-(family-name:--font-display) text-[15px] font-bold text-(--color-ink)">
            NeuroDesk
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-(--color-ink-muted) sm:flex">
          <a href="#tools" className="transition-colors hover:text-(--color-ink)">
            Tools
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-(--color-ink)">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
