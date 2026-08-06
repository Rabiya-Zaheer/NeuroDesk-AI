import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started — free"
      title="Create your NeuroDesk account"
      subtitle="One workspace for your studying, job search, and side projects."
    >
      <SignupForm />
    </AuthShell>
  );
}
