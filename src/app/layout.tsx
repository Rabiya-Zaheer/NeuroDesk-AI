import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { NativeBridge } from "@/components/native-bridge";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NeuroDesk — One workspace for everything you're working on",
    template: "%s · NeuroDesk",
  },
  description:
    "NeuroDesk is an AI-powered productivity workspace: whiteboards, documents, study and career tools, all connected to one workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-(--color-background) font-(family-name:--font-sans) antialiased">
        {children}
        <NativeBridge />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "1rem",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-ink)",
            },
          }}
        />
      </body>
    </html>
  );
}