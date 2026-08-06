"use client";

import { useState } from "react";
import { Sun, Moon, Laptop, LogOut } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";
import { logoutAction } from "@/features/auth/actions";

const themeOptions = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Laptop },
] as const;

export function SettingsView({ name, email }: { name: string; email: string }) {
  const [theme, setTheme] = useState<(typeof themeOptions)[number]["id"]>("system");
  const [jobTitle, setJobTitle] = useState("Product Design Student");

  return (
    <Tabs defaultValue="profile" className="flex flex-col gap-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="theme">Theme</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>This is how you appear across NeuroDesk.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                <AvatarImage alt={name} />
                <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change photo
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" defaultValue={name} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="job-title">Job title</Label>
                <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="A short line about what you're working on"
                className="rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-ink) placeholder:text-(--color-ink-faint) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/40"
              />
            </div>

            <div>
              <Button size="sm">Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>Used for sign-in and important notifications.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 sm:max-w-sm">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" defaultValue={email} />
            </div>
            <div>
              <Button size="sm" variant="outline">
                Send verification link
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="theme">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose how NeuroDesk looks on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {themeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 text-xs font-medium transition-colors",
                    theme === opt.id
                      ? "border-(--color-primary) bg-(--color-primary-soft) text-(--color-primary)"
                      : "border-(--color-border) text-(--color-ink-muted) hover:bg-(--color-surface-muted)",
                  )}
                >
                  <opt.icon className="size-5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Sign out of NeuroDesk on this device.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={logoutAction}>
              <Button type="submit" variant="destructive" size="sm">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
