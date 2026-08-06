"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/auth/form-field";
import { forgotPasswordAction, type ActionResult } from "@/features/auth/actions";

const initialState: ActionResult = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Sending link..." : "Send reset link"}
    </Button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-(--radius-card) border border-(--color-border) bg-(--color-surface) p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-(--color-secondary-soft)">
          <MailCheck className="size-6 text-(--color-secondary)" />
        </span>
        <div>
          <p className="font-(family-name:--font-display) text-base font-semibold text-(--color-ink)">
            Check your inbox
          </p>
          <p className="mt-1 text-sm text-(--color-ink-muted)">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
        </div>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-primary) hover:underline">
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormField id="email" label="Email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </FormField>

      <SubmitButton />

      <Link
        href="/login"
        className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-(--color-ink-muted) hover:text-(--color-ink)"
      >
        <ArrowLeft className="size-3.5" />
        Back to sign in
      </Link>
    </form>
  );
}
