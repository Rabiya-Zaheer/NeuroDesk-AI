"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormError } from "@/components/auth/form-field";
import { signupAction, type ActionResult } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

const initialState: ActionResult = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Creating account..." : "Create account"}
    </Button>
  );
}

function PasswordChecklist({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  return (
    <ul className="flex flex-col gap-1 pt-1">
      {checks.map((c) => (
        <li
          key={c.label}
          className={cn(
            "flex items-center gap-1.5 text-xs transition-colors",
            c.met ? "text-(--color-secondary)" : "text-(--color-ink-faint)",
          )}
        >
          {c.met ? <Check className="size-3" /> : <X className="size-3" />}
          {c.label}
        </li>
      ))}
    </ul>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState);
  const [password, setPassword] = useState("");

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormError message={state.error} />

      <FormField id="name" label="Full name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" type="text" placeholder="Amara Khan" autoComplete="name" required />
      </FormField>

      <FormField id="email" label="Email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </FormField>

      <FormField id="password" label="Password" error={state.fieldErrors?.password}>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordChecklist password={password} />
      </FormField>

      <FormField id="confirmPassword" label="Confirm password" error={state.fieldErrors?.confirmPassword}>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
      </FormField>

      <SubmitButton />

      <p className="text-center text-sm text-(--color-ink-muted)">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-(--color-primary) hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
