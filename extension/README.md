# NeuroDesk Web Capture — Chrome extension

Captures selected text (or the whole page, via right-click) from any
website and drops it as a sticky note on a NeuroDesk workspace whiteboard —
live, if that workspace is already open in another tab.

## How it fits together

```
Any webpage                  NeuroDesk app (this repo)
┌─────────────────┐         ┌───────────────────────────────┐
│ content-script.js│  ───►  │ /api/extension/session  (GET)  │  is the user logged in?
│  reads selection │        │ /api/extension/workspaces(GET) │  which workspace?
└────────┬─────────┘        │ /api/extension/capture (POST)  │  land the note
         │                  └───────────────┬─────────────────┘
         ▼                                  │ broadcasts "note-add"
   popup.html/js  ──── fetch, credentials:'include' ──┘  on the Supabase channel
                                                          workspace:{id} — same
                                                          event the in-app
                                                          whiteboard listens for
```

The popup authenticates the same way the web app does: it calls the app's
API with `credentials: "include"`, so the browser attaches the existing
`neurodesk_session` cookie automatically. No separate extension login, no
token to copy-paste — if you're logged into NeuroDesk in your browser,
you're logged in in the popup too.

## Load it locally

1. `npm run dev` in the main project, so the app is running at
   `http://localhost:3000`.
2. Chrome → `chrome://extensions` → enable **Developer mode** (top right).
3. **Load unpacked** → select this `extension/` folder.
4. Log into NeuroDesk at `localhost:3000` in a normal tab.
5. On any other page, select some text → right-click → **Send "…" to
   NeuroDesk**, or click the extension icon directly to send the whole page.
6. Pick a workspace, edit the note text if you want, hit **Send to
   whiteboard**. Open that workspace's whiteboard tab and watch the note
   land live.

## Deploying beyond localhost

Two edits, both intentionally centralized so this is a two-line change:

1. `extension/config.js` — change `APP_URL` to your deployed domain.
2. `extension/manifest.json` — add that domain under `host_permissions`
   (Chrome blocks cross-origin fetches to origins not listed there, even
   with correct CORS headers).

## Why a sticky note, not a new "Captures" list

The brief's architecture is "everything writes into the same workspace" —
so a capture becomes the same `StickyNoteState` shape the whiteboard already
renders, delivered through the same `note-add` broadcast event the
in-browser whiteboard already listens for (see
`src/features/workspace/realtime-context.tsx`). The extension isn't a
separate feature bolted on; it's one more producer writing into the thing
that was already there.
