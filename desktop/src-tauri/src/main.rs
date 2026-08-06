// NeuroDesk's desktop app is intentionally thin: `tauri.conf.json` points
// the single window straight at the deployed NeuroDesk web app (see
// `build.devUrl` / `build.frontendDist`), the same "native shell around one
// deployed app" pattern used by the Chrome extension and the mobile app.
// There's no custom Rust business logic yet — this file exists as the
// obvious place to add native commands (e.g. native file drag-and-drop into
// the whiteboard, system tray, global shortcuts) in a later phase, without
// restructuring anything.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running the NeuroDesk desktop app");
}
