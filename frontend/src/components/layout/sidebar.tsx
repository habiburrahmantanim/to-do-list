"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ListTodo,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/todos", label: "Todos", icon: ListTodo },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/security", label: "Security", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navContent = (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
            T
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              TaskFlow
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
              )}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block md:w-72 md:flex-shrink-0">
        {navContent}
      </div>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="h-full w-72"
            onClick={(event) => event.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      ) : null}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}
