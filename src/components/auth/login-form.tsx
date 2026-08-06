"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormError } from "@/components/auth/form-field";
import { loginAction, type ActionResult } from "@/features/auth/actions";

const initialState: ActionResult = { success: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <FormError message={state.error} />

      <FormField id="email" label="Email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={state.fieldErrors?.password}
        hint={
          <Link href="/forgot-password" className="text-xs font-medium text-(--color-primary) hover:underline">
            Forgot password?
          </Link>
        }
      >
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-(--color-ink-muted)">
        <input
          type="checkbox"
          name="rememberMe"
          className="size-4 rounded border-(--color-border) text-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-primary)/40"
        />
        Remember me for 30 days
      </label>

      <SubmitButton />

      <p className="text-center text-sm text-(--color-ink-muted)">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-(--color-primary) hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
