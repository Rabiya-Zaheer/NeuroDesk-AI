# Deploying NeuroDesk

The app is a single Next.js project, so it deploys to Vercel the same way
any Next.js app does — no separate backend to stand up. This guide assumes
you already have a Supabase project (from local setup) and a GitHub account.

## 1. Push to GitHub

```bash
cd neurodesk
git init
git add .
git commit -m "NeuroDesk — phases 1-6"
git remote add origin https://github.com/<you>/neurodesk.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, `.next`, and `.env` — double
check `.env` never got committed before this point (`git status` should
show it as untracked, not staged).

## 2. Import into Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import
   the GitHub repo you just pushed.
2. Vercel auto-detects Next.js — leave the build command / output settings
   on their defaults.
3. **Before your first deploy**, add every environment variable from
   `.env.example` under **Settings → Environment Variables**:

   | Variable | Where it comes from |
   |---|---|
   | `DATABASE_URL`, `DIRECT_URL` | Supabase → Project Settings → Database |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API — **server-only, never prefix with `NEXT_PUBLIC_`** |
   | `AUTH_SECRET` | Generate your own: `openssl rand -base64 32` — use a different one than local dev |
   | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | resend.com — optional, welcome email is skipped without it |
   | `NEXT_PUBLIC_APP_URL` | Your Vercel URL, e.g. `https://neurodesk.vercel.app` — you'll only know this after the first deploy, so redeploy once with it set correctly |

4. Deploy.

## 3. Push the database schema

Prisma needs to create tables in your Supabase Postgres instance once,
from your own machine (not from Vercel — this is a one-time setup step, not
part of the build):

```bash
npx prisma db push
```

## 4. Point the other three surfaces at the real URL

Each of these has exactly one line to change — same pattern deliberately
repeated across all of them:

| Surface | File | Change |
|---|---|---|
| Chrome extension | `extension/config.js` | `APP_URL` → your Vercel URL, and add it to `host_permissions` in `manifest.json` |
| Mobile | `mobile/config.ts` | `APP_URL` → your Vercel URL; remove `cleartext: true` from `capacitor.config.ts` since it's https now |
| Desktop | `desktop/src-tauri/tauri.conf.json` | both `build.devUrl` and `build.frontendDist` → your Vercel URL |

## 5. Smoke test

After deploy, walk through: sign up → check the welcome email arrived (if
Resend is configured) → land on the dashboard → open a workspace → confirm
the whiteboard renders → open the same workspace URL in a second browser
(or an incognito window, logged in as the same test account) and confirm
the connection-status pill says **Live**, not **Demo mode** — that's your
signal Supabase Realtime is actually wired up in production, not just
locally.

## Common first-deploy issues

- **"Live" never shows, stuck on "Demo mode"** — a `NEXT_PUBLIC_*` Supabase
  variable is missing or was added after the deploy (Vercel bakes
  `NEXT_PUBLIC_*` vars in at build time — redeploy after adding them, don't
  just wait).
- **Middleware redirect loop** — `AUTH_SECRET` differs between what signed
  the cookie and what's verifying it; make sure it's set in the same Vercel
  environment (Production vs. Preview) you're testing.
- **Welcome email never arrives** — check Resend's dashboard for the send
  log before assuming the app is broken; a missing `RESEND_API_KEY` fails
  silently by design (see `src/lib/email.ts`), it doesn't crash signup.
