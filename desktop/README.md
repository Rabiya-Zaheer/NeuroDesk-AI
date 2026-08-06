# NeuroDesk Desktop — Tauri shell

A native desktop window around the deployed NeuroDesk web app — same "thin
shell around one deployed app" pattern as the Chrome extension and the
mobile app, using [Tauri](https://tauri.app) v2 (Rust + the OS's native
webview, not a bundled Chromium — small binaries, low memory).

## Why this repo can scaffold it but not build it

This project was built inside a network-restricted sandbox with no Rust
toolchain installed and no way to install one (rustup's install domains
aren't reachable from here). Every file in `src-tauri/` is hand-written to
the real Tauri v2 schema and syntax-validated (`tauri.conf.json` and
`capabilities/default.json` as JSON, `Cargo.toml` as TOML) — but none of it
has been through `cargo check` or an actual compile, unlike the rest of this
project. Same honesty as the Chrome extension section: this needs your own
machine.

## Setup (on a machine with Rust installed)

```bash
# One-time: install Rust if you don't have it
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

cd desktop
npm install
npm run icon src-tauri/icons/icon.png   # generates .icns / .ico from the source PNG
npm run dev                              # opens a native window loading http://localhost:3000
```

Make sure the main NeuroDesk app (`npm run dev` in the project root) is
already running on `localhost:3000` before `npm run dev` here — the desktop
window just loads that URL, it doesn't serve anything itself.

## Deploying beyond localhost

Edit `src-tauri/tauri.conf.json` — change both `build.devUrl` and
`build.frontendDist` from `http://localhost:3000` to your deployed HTTPS
URL, then `npm run build` produces a real installer (`.dmg` / `.msi` /
`.AppImage`, platform-dependent) that always points at that URL.

## Why no custom Rust code yet

`src-tauri/src/main.rs` is intentionally a minimal window shell. It's the
obvious place to add native capabilities later — a system tray icon,
global keyboard shortcuts, native drag-and-drop of files straight onto the
whiteboard — without restructuring anything, the same way `background.js`
in the Chrome extension is the obvious place for its native-ish behavior.
