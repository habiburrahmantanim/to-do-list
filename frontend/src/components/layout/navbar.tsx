"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Moon, Search, SunMedium, UserCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const pageTitle =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname.startsWith("/todos")
        ? "Todos"
        : pathname.startsWith("/profile")
          ? "Profile"
          : "TaskFlow";

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <div className="h-9 w-9 rounded-lg bg-slate-900 text-center text-sm font-semibold leading-9 text-white dark:bg-slate-100 dark:text-slate-900">
            T
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Workspace
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:flex dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <input
              aria-label="Search"
              placeholder="Search"
              className="w-32 border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100">
              {user ? (
                ([user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || "U").charAt(0).toUpperCase()
              ) : (
                <UserCircle2 className="h-4 w-4" />
              )}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {user ? ([user.first_name, user.last_name].filter(Boolean).join(" ") || user.username) : "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email ?? "member@taskflow.dev"}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
              <Link
                href="/profile"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Profile
              </Link>
              <Link
                href="/profile/security"
                className="hover:text-slate-900 dark:hover:text-white"
              >
                Security
              </Link>
              <button
                type="button"
                onClick={() => void logout().then(() => router.push("/login"))}
                className="text-left hover:text-slate-900 dark:hover:text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
