# NeuroDesk Mobile — Capacitor shell

A native iOS/Android wrapper around the deployed NeuroDesk web app — the
same "thin native shell around one deployed app" pattern as the Chrome
extension and the desktop app, using [Capacitor](https://capacitorjs.com).

## What's genuinely verified vs. what needs your machine

Unlike the desktop Tauri scaffold (which needed Rust — not installable in
the sandbox this was built in), Capacitor is plain Node tooling, so this
was actually run, not just hand-written:

- `npx cap init` — really executed, generated `capacitor.config.ts`
- `npx cap add android` — really executed, generated the full `android/`
  Gradle project
- `npx cap add ios` — really executed, generated the full `ios/` Xcode
  project
- `npx cap sync` — really executed after wiring in the three native plugins
  below, confirmed all three resolved correctly for both platforms

What wasn't possible here: actually compiling either platform (no Android
SDK, no Xcode/macOS in this sandbox) or running on a device/emulator. That
part needs Android Studio (for `android/`) or a Mac with Xcode (for `ios/`).

## Architecture

`capacitor.config.ts` sets `server.url` to `APP_URL` (from `config.ts`) —
the native shell just loads that URL directly, the same live Next.js app
used everywhere else. No static export, no bundled JS of its own.

Three native plugins are wired in:

- `@capacitor/splash-screen` — branded splash while the page loads
- `@capacitor/status-bar` — themes the status bar to match NeuroDesk's
  light background
- `@capacitor/app` — handles the Android hardware back button (goes back
  in-app history instead of just closing)

Because the app content is a remote page rather than bundled JS, these
plugins can't be called from native code alone — they have to be invoked
from *inside* the pages that load. That bridge lives in the main project,
not here: `src/components/native-bridge.tsx`, mounted in the root layout.
It checks `window.Capacitor?.isNativePlatform()` and no-ops entirely on a
normal browser tab.

## Running it yourself

```bash
cd mobile
npm install

# Point config.ts at your machine's IP if testing on a physical device,
# or leave it at 10.0.2.2:3000 for the Android emulator (that address
# means "the host machine" from inside the emulator).

npx cap sync
npx cap open android   # requires Android Studio
npx cap open ios       # requires Xcode (macOS only)
```

Make sure the main NeuroDesk app is running (`npm run dev` in the project
root) before opening either platform.

## Deploying beyond localhost

Change `APP_URL` in `mobile/config.ts` to your deployed HTTPS URL, remove
`cleartext: true` from `capacitor.config.ts` (that flag only exists to
allow plain `http://` during local development), then `npx cap sync`.
