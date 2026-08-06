"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { signupSchema, loginSchema, forgotPasswordSchema } from "@/lib/validations";
import { hashPassword, verifyPassword } from "@/features/auth/password";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function signupAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, fieldErrors: { email: "An account with this email already exists" } };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      profile: { create: {} },
      workspaces: {
        create: {
          name: "My Workspace",
          slug: `my-workspace-${Date.now().toString(36)}`,
        },
      },
    },
  });

  await sendWelcomeEmail(user.email, user.name).catch((err) => {
    console.error("[signupAction] welcome email failed", err);
  });

  const token = await createSessionToken({ userId: user.id, email: user.email, name: user.name });
  await setSessionCookie(token);

  redirect("/dashboard");
}

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const { email, password, rememberMe } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { success: false, error: "Incorrect email or password" };
  }

  const token = await createSessionToken(
    { userId: user.id, email: user.email, name: user.name },
    rememberMe ? "30d" : "7d",
  );
  await setSessionCookie(token, rememberMe);

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}

export async function forgotPasswordAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, fieldErrors: { email: "Enter a valid email address" } };
  }

  // Always report success even if the user doesn't exist, to avoid leaking
  // account existence. A real reset-token flow is a Phase 2 extension point.
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    console.info(`[forgotPasswordAction] reset requested for ${user.email} (token flow: TODO Phase 2)`);
  }

  return { success: true };
}
