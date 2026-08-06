# NeuroDesk — Demo Script

A walkthrough that presents all six build tasks as one coherent story
("one workspace, not six disconnected features") rather than six separate
demos bolted together. Roughly 8-10 minutes.

## 0. Before you start

- Have the app running (deployed, or `npm run dev` + `ngrok`/similar if
  presenting locally so a second device can reach it)
- Two browser windows/tabs ready (one normal, one incognito) — this is how
  you'll show real-time sync live
- The Chrome extension loaded (`chrome://extensions` → Load unpacked)
- One thing already captured via the extension *before* the demo starts, so
  you're not waiting on typing during the live section

## 1. The pitch (30 seconds)

"NeuroDesk is one workspace instead of six disconnected apps. A student
studying for an exam, applying for jobs, and running a group project
usually juggles a notes app, a job tracker, a whiteboard tool, and a chat
app — all with no shared context. Here, they're all views onto the same
workspace."

## 2. Landing page → sign up (1 minute)

Open the landing page — point out the hub graphic: it's not decoration, it's
literally the architecture (`/workspace/[id]/tool`, every tool is a child
of one workspace). Sign up with a fresh account, note the welcome email
sends via Resend (check the inbox if you want the payoff).

## 3. Dashboard (30 seconds)

Land on the dashboard. Point out: greeting, prompt box, quick actions,
continue-working carousel, right sidebar (AI suggestions + activity feed).
All dummy data by design — Phase 1 explicitly scoped "no AI yet, build the
foundation."

## 4. Open a workspace → real-time + canvas, live (2-3 minutes, the core bit)

Click into a workspace, land on the Whiteboard tool.

1. Point at the header: **connection status pill** (Live / Demo mode).
2. Open the *same workspace URL* in the second browser window.
3. Back in window 1: drag a sticky note. **It moves in window 2, live.**
4. Switch to the Pen tool, draw a stroke. **It appears in window 2, live,
   in your collaborator color.**
5. Switch to the Rectangle tool, draw a box. Same thing.
6. Click the Sticky Note tool, click an empty spot — a new note appears in
   both windows.
7. Mention: if Supabase isn't configured, this same interaction still
   works — it falls back to simulated collaborators clearly labeled "Demo
   mode," so the feature is always demoable, never silently broken.

This one sequence covers Tasks 3 and 4 together, which is the point — they
were never separate systems.

## 5. The other tools, quickly (1 minute)

Click through Documents (dropzone), AI Chat (dummy grounded conversation),
Study Assistant (flashcard + reading progress), Career Coach (resume score
+ application tracker), Activity (workspace history). Say once: "these all
render dummy data today — the architecture point is that when real AI
lands, it plugs into this same routing structure, not a new one."

## 6. Chrome extension (1-2 minutes)

Go to any article (Wikipedia, a blog post). Select a paragraph. Right-click
→ **Send "…" to NeuroDesk**. Popup opens, already showing your session,
workspace picker, and the selected text. Pick the workspace you had open in
step 4. Hit **Send to whiteboard**. Switch back to that browser tab — the
note is already there, live, without a page refresh.

Say explicitly: "the extension doesn't have its own storage or its own
concept of a note — it's calling the same broadcast event the whiteboard
itself uses. It's a third producer into the same workspace, not a separate
feature."

## 7. Mobile & desktop (1 minute, screenshots or a real device if you have one)

If you have Android Studio/an emulator or a Mac with Xcode, this is the
strongest possible close: open the app on a phone/native window and show
it's the identical app, no separate mobile-only feature set. If not,
show the generated `android/`, `ios/`, and `src-tauri/` project structures
and explain the "thin native shell around one deployed app" decision —
the same one the extension already demonstrated with a browser instead of
an app store.

## 8. Close (30 seconds)

"Every surface — web, extension, mobile, desktop — is a different way of
looking at the same workspace, backed by the same Next.js app and the same
real-time channel. That's the thing this project was actually building:
not six features, one architecture."
