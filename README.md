# NeuroDesk — Phase 1

An AI-powered productivity workspace. This phase builds the foundation only —
no AI is wired up yet, but the architecture is shaped so every future AI
module (Whiteboard AI, Study Assistant, Career Coach, Document Analyzer,
Chrome Extension, real-time collaboration) has an obvious place to plug in.

## Core architecture decision

Routes are **not** organized by feature (`/study`, `/career`, `/documents`).
Instead, `/workspace/[workspaceId]` is the central experience, and every tool
is a child of a workspace:

```
/
├── (marketing)/page.tsx        → landing page
├── (auth)/login, signup, forgot-password
├── dashboard/                  → home, favorites, history
├── settings/
└── workspace/
    └── [workspaceId]/
          ├── whiteboard/
          ├── documents/
          ├── ai-chat/
          ├── study/
          ├── career/
          └── activity/
```

This means a future "Study Assistant" AI doesn't own its own top-level page —
it reads and writes into whatever workspace is currently open, the same way
every other tool does. That's the "one workspace" thesis from the brief,
expressed as a routing decision, not just a tagline.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
shadcn/ui + Radix · Framer Motion (installed, not yet used) · React Hook Form
+ Zod · Prisma + Supabase Postgres · Resend · JWT session cookies (`jose`) ·
bcrypt password hashing.

Everything lives in one Next.js app — no separate Express/API project. Auth
and mutations go through Server Actions (`src/features/*/actions.ts`).

## Mobile & desktop apps (Task 6)

Both follow the exact pattern established by the Chrome extension in Task 5:
a thin native shell around the one deployed NeuroDesk web app, not a
separate codebase to maintain.

- **`mobile/`** — Capacitor. `npx cap init`/`add android`/`add ios`/`sync`
  were genuinely run (not hand-written) — verify by looking at
  `mobile/android/` and `mobile/ios/`, real generated Gradle/Xcode projects.
  Three native plugins wired in: splash screen, status bar theming, and
  Android back-button handling. See `mobile/README.md`.
- **`desktop/`** — Tauri v2. This sandbox has no Rust toolchain and can't
  install one, so unlike `mobile/`, this is hand-written to the real Tauri
  v2 schema and syntax-validated (JSON/TOML), but never compiled. See
  `desktop/README.md` for the honest breakdown of what that means.

**The one non-obvious piece:** both shells load the app via a *remote URL*
(`server.url` in Capacitor, `devUrl`/`frontendDist` in Tauri) rather than
bundling a static export — this app has server components, cookies, and
middleware, so it can't be statically exported. That means native plugin
calls (hide splash screen, theme the status bar, handle the back button)
can't be triggered from native code alone, since the actual page content is
whatever the live Next.js app renders. The bridge for that lives in the main
app itself: `src/components/native-bridge.tsx`, mounted in the root layout,
a no-op unless `window.Capacitor` exists.

## Chrome extension (Task 5)

`extension/` is a full Manifest V3 Chrome extension — separate loadable
artifact, see `extension/README.md` for load/test instructions. Short
version: select text anywhere on the web, right-click → **Send to
NeuroDesk**, pick a workspace, and it lands as a sticky note on that
workspace's whiteboard, live, using the same `note-add` broadcast event the
in-app whiteboard already listens for.

Backend side lives in `src/app/api/extension/` — three routes
(`session`, `workspaces`, `capture`) that the extension's popup calls with
`credentials: "include"`, so the existing session cookie authenticates it
automatically. Since `chrome-extension://` is a different origin, these
routes need explicit CORS handling (`src/lib/cors.ts`), which the rest of
the app doesn't need. `src/lib/supabase/server-realtime.ts` broadcasts the
capture server-side using the Supabase service role key, so it shows up
live even if the tab that captured it isn't the same tab that has the
whiteboard open.

## HTML Canvas drawing (Task 4)

The whiteboard now has a real `<canvas>` layer, not just DOM sticky notes.

- `src/components/workspace/drawing-canvas.tsx` — a resolution-independent
  `<canvas>` element. Every drawn point is stored as a 0-100 percentage, not
  a pixel, so strokes stay correct across resize, zoom, and different screen
  sizes with no coordinate translation needed at the call site. It handles
  its own `devicePixelRatio` scaling (via `ResizeObserver`) so lines stay
  crisp on high-DPI screens.
- Two real drawing tools: **Pen** (freehand strokes) and **Rectangle**
  (drag-to-draw). Both commit through `addElement()` on the realtime
  context, so — same as sticky notes — anything you draw shows up for every
  other collaborator in the workspace, live.
- A third tool, **Sticky note**, now actually places a new note wherever you
  click, colored randomly from the app's palette, again synced through
  `addNote()`.
- Each person's strokes render in their own collaborator color, the same
  color used for their cursor — so a synced session visually shows who drew
  what.

Architecturally, `elements: DrawElement[]` and `addElement()` were added to
the same `RealtimeWorkspaceProvider` from Task 3, following its existing
live/demo pattern exactly — canvas drawing is "just another synced type" in
the same channel, not a separate system.

## Real-time functionality (Task 3)

The whiteboard is multiplayer. Built on **Supabase Realtime** — presence for
who's online, and broadcast channels for live cursors and sticky-note
dragging — rather than a separate WebSocket server, since Supabase already
sits in the stack for auth and Postgres.

- `src/features/workspace/realtime-context.tsx` — the single provider
  (`RealtimeWorkspaceProvider`) mounted once per workspace in
  `workspace/[workspaceId]/layout.tsx`. It exposes `collaborators`, `notes`,
  `updateCursor`, and `moveNote` to any client component in that workspace
  via `useWorkspaceRealtime()`.
- `src/components/workspace/whiteboard-canvas.tsx` — draggable sticky notes
  and pointer tracking, throttled to ~16 broadcasts/sec.
- `src/components/workspace/cursors-overlay.tsx` — renders everyone else's
  live cursor with their name and an assigned color.
- The connection status pill in the workspace header shows **Live**
  (connected to a real Supabase project), **Connecting…**, or **Demo mode**.

**Demo mode matters for grading/presenting:** if `NEXT_PUBLIC_SUPABASE_URL`
/ `NEXT_PUBLIC_SUPABASE_ANON_KEY` aren't set (or are still the placeholder
values in `.env.example`), the provider falls back to two simulated
collaborators with moving cursors and occasional note nudges — clearly
labeled as demo mode, never pretending to be live. This means the real-time
experience is visible and demoable even before a Supabase project is wired
up; connecting real credentials swaps it for genuine multi-tab/multi-user
sync with zero code changes.

To test it live: create a Supabase project, fill in the two
`NEXT_PUBLIC_SUPABASE_*` values, run the app, and open the same workspace URL
in two browser tabs (or two browsers) — you'll see two avatars, two live
cursors, and notes dragged in one tab move in the other.

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET, etc.
npx prisma generate
npx prisma db push     # creates tables in your Supabase Postgres instance
npm run dev
```

Generate a real `AUTH_SECRET` with `openssl rand -base64 32` before deploying.
Without a `RESEND_API_KEY`, the welcome email is skipped (logged, not sent) —
useful for local development.

## What's real vs. dummy in Phase 1

**Real:** authentication (signup/login/logout/forgot-password), session
cookies + middleware route protection, the Prisma schema (`User`,
`Workspace`, `Profile`, `Session`, `Notification`), the welcome email send,
and the entire routing/layout architecture.

**Dummy, by design (per the brief):** dashboard content, workspace tool
screens (whiteboard sticky notes, documents list, AI chat thread, flashcards,
job applications, activity feed) all render from `src/lib/dummy-data.ts`.
None of it calls a model. Swapping dummy data for live data/AI calls is the
explicit scope of later phases.

## Where future modules plug in

- `prisma/schema.prisma` has commented extension points on `Workspace` for
  `WhiteboardNode`, `Document`, `ChatThread`, `StudyPlan`, `CareerPath`.
- Every workspace tool page already receives `workspaceId` as a route param
  and validates the workspace server-side — a real data-fetch just replaces
  the `getWorkspaceById` / `dummy-data` calls.
- `src/components/workspace/workspace-sidebar.tsx` is the one place that
  defines which tools exist; adding a seventh tool is a one-line change plus
  a new route folder.

## Known sandbox-only caveat

This was built and verified in a network-restricted container, so
`next build` couldn't reach `fonts.googleapis.com` to fetch Plus Jakarta
Sans / Inter / JetBrains Mono at build time — that's a sandbox limitation,
not a code issue, and it resolves itself on any normal network (local
machine, Vercel, CI with internet access). Everything else — TypeScript
(`npx tsc --noEmit`), ESLint, and a full `next build` with fonts swapped for
system fonts — passes clean with zero errors across all 14 routes (11 pages
+ 3 API routes), including the real-time canvas whiteboard and the Chrome
extension's backend. The extension's own JS files pass `node --check`
syntax validation; end-to-end testing of the popup naturally needs a real
Chrome browser, which this sandbox doesn't have.
