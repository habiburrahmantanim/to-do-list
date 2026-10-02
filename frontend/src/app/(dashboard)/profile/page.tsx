"use client";

import { useEffect, useState } from "react";
import { Save, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "@/services/user.service";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        name,
        avatar: user.avatar,
      });
      await refreshUser();
      toast.success("Profile updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Profile settings
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCircle2 className="h-5 w-5" />
              Personal info
            </CardTitle>
            <CardDescription>
              Update how your account appears to your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {user?.name ?? "User"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user?.email ?? "member@taskflow.dev"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Member since
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recently"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl">Edit profile</CardTitle>
            <CardDescription>
              Change your display name and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="profile-name"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Full name
                </label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="profile-email"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email address
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
