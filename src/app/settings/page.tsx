import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SettingsView } from "@/features/dashboard/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="px-6 py-8 xl:px-8">
      <div className="mb-6">
        <p className="font-(family-name:--font-display) text-2xl font-bold text-(--color-ink)">Settings</p>
        <p className="mt-1 text-sm text-(--color-ink-muted)">Manage your profile, email, and preferences.</p>
      </div>
      <SettingsView name={session.name} email={session.email} />
    </div>
  );
}
