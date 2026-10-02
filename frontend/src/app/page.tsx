import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: LayoutDashboard,
    title: "Clear overview",
    description:
      "Track priorities, deadlines, and progress from a single streamlined dashboard.",
  },
  {
    icon: ListTodo,
    title: "Smart organization",
    description:
      "Create todo groups, categories, and due dates that scale with your workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Built for teams",
    description:
      "Keep tasks secure, usable, and ready for future authenticated API integration.",
  },
];

const highlights = [
  "Priority-based task planning",
  "Due-date tracking",
  "Search and filtering",
  "Dark mode experience",
  "Responsive dashboard UI",
  "Production-ready architecture",
];

const taskPreviewItems: Array<{
  title: string;
  priority: "High" | "Medium" | "Low";
  complete: boolean;
}> = [
  { title: "Design sprint review", priority: "High", complete: true },
  { title: "Write release notes", priority: "Medium", complete: true },
  { title: "Plan onboarding checklist", priority: "Low", complete: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="TaskFlow home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
              T
            </div>
            <span className="text-lg font-semibold tracking-tight">
              TaskFlow
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex dark:text-slate-300">
            <Link
              href="#features"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#workflow"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Workflow
            </Link>
            <Link
              href="#preview"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Preview
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge
              variant="secondary"
              className="mb-5 inline-flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Productive work, simplified
            </Badge>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              Organize your work. Get things done.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              TaskFlow helps individuals and teams prioritize work, manage
              deadlines, and keep momentum with a clean and focused task
              experience.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Today
                  </p>
                  <h2 className="text-xl font-semibold">Task overview</h2>
                </div>
                <Badge variant="success">On track</Badge>
              </div>

              <div className="space-y-3">
                {taskPreviewItems.map(({ title, priority, complete }) => (
                  <div
                    key={title}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
                        {complete ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Due today
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        priority === "High"
                          ? "warning"
                          : priority === "Medium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Why TaskFlow
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Built for focus, clarity, and momentum.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Productivity features
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              A workflow your day can actually keep up with.
            </h2>
            <ul className="mt-8 space-y-4">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="preview"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Workflow
                </p>
                <h3 className="text-xl font-semibold">
                  Plan. Prioritize. Complete.
                </h3>
              </div>
              <Zap className="h-5 w-5 text-amber-500" />
            </div>
            <div className="mt-6 space-y-4">
              {[
                "Define the task and important context",
                "Set priority and due date",
                "Track completion and keep momentum",
              ].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm text-slate-700 dark:text-slate-200">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:px-8 dark:text-slate-300">
          <p>© 2026 TaskFlow</p>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="transition hover:text-slate-900 dark:hover:text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
