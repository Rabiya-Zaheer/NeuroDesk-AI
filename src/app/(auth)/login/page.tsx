import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to NeuroDesk"
      subtitle="Pick up right where you left off, across every workspace."
    >
      <LoginForm />
    </AuthShell>
  );
}
