"use client";

import { useEffect } from "react";

/**
 * The mobile app (see /mobile) loads this exact web app via a remote URL —
 * it doesn't bundle its own JS. That means calling native plugins (hiding
 * the splash screen, theming the status bar, handling the Android back
 * button) has to happen from inside the pages the web app already renders,
 * not from native code in /mobile. This component is that bridge.
 *
 * On a normal browser tab, `window.Capacitor` doesn't exist, so this is a
 * no-op — nothing is imported, nothing runs, no bundle cost paid outside
 * the native shell.
 */
export function NativeBridge() {
  useEffect(() => {
    let mounted = true;
    let removeBackListener: (() => void) | undefined;

    async function init() {
      const capacitorWindow = window as unknown as {
        Capacitor?: { isNativePlatform?: () => boolean };
      };
      if (!capacitorWindow.Capacitor?.isNativePlatform?.()) return;

      const [{ SplashScreen }, { StatusBar, Style }, { App }] = await Promise.all([
        import("@capacitor/splash-screen"),
        import("@capacitor/status-bar"),
        import("@capacitor/app"),
      ]);
      if (!mounted) return;

      await SplashScreen.hide().catch(() => {});
      await StatusBar.setStyle({ style: Style.Light }).catch(() => {});
      await StatusBar.setBackgroundColor({ color: "#F8FAFC" }).catch(() => {});

      const listener = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
      removeBackListener = () => listener.remove();
    }

    void init();

    return () => {
      mounted = false;
      removeBackListener?.();
    };
  }, []);

  return null;
}
