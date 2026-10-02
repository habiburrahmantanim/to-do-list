"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
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
import { changePassword as updateUserPassword } from "@/services/user.service";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUserPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update password.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Security
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Password & access
        </h1>
      </div>

      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5" />
            Change password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="current-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Current password
              </label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  onClick={() => setShowCurrent((value) => !value)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                New password
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  onClick={() => setShowNew((value) => !value)}
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Confirm new password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    Security recommendation
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Use a unique password and avoid reusing your old login
                    credentials.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Updating password..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
