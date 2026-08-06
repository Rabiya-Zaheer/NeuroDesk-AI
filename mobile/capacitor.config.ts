import type { CapacitorConfig } from "@capacitor/cli";
import { APP_URL } from "./config";

// NeuroDesk's mobile app is intentionally a thin native shell, not a
// separate codebase — see the main README's "One workspace" architecture
// note. The native shell exists for app-icon presence, splash screen, and
// native APIs (status bar, back-button handling), while all real content
// keeps being server-rendered by the same Next.js app used everywhere else.
const config: CapacitorConfig = {
  appId: "com.neurodesk.app",
  appName: "NeuroDesk",
  webDir: "www",
  server: {
    url: APP_URL,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 600,
      backgroundColor: "#F8FAFC",
      showSpinner: false,
    },
    StatusBar: {
      style: "light",
      backgroundColor: "#F8FAFC",
    },
  },
};

export default config;
