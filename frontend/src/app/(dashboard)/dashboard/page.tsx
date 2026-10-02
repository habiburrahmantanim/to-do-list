import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ListTodo,
  Target,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  {
    label: "Completed",
    value: "24",
    change: "+8% from last week",
    icon: CheckCircle2,
    tone: "emerald",
  },
  {
    label: "In progress",
    value: "08",
    change: "3 due today",
    icon: Clock3,
    tone: "amber",
  },
  {
    label: "Focus score",
    value: "86%",
    change: "Strong momentum",
    icon: Target,
    tone: "blue",
  },
  {
    label: "Productivity",
    value: "+12h",
    change: "This month",
    icon: TrendingUp,
    tone: "violet",
  },
] as const;

const tasks = [
  {
    title: "Finalize onboarding checklist",
    meta: "Design • Due today",
    priority: "High",
    completed: false,
  },
  {
    title: "Refine sprint backlog",
    meta: "Planning • Due tomorrow",
    priority: "Medium",
    completed: false,
  },
  {
    title: "Review client feedback",
    meta: "Product • Completed",
    priority: "Low",
    completed: true,
  },
] as const;

const activity = [
  "You completed 2 tasks before noon.",
  "The product review received 4 new comments.",
  "A team reminder was shared for tomorrow's sprint.",
] as const;

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Welcome back, Alex
          </h1>
        </div>
        <Button className="w-fit">
          New task
          <ArrowRight className="h-4 w-4" />
        </Button>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, change, icon: Icon, tone }) => (
          <Card
            key={label}
            className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {label}
              </CardTitle>
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-md",
                  tone === "emerald" &&
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                  tone === "amber" &&
                    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                  tone === "blue" &&
                    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
                  tone === "violet" &&
                    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                {value}
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Upcoming tasks</CardTitle>
                <CardDescription>
                  Focus on what needs attention today.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <ListTodo className="h-3.5 w-3.5" />5 active
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border",
                      task.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
                    ].join(" ")}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {task.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {task.meta}
                    </p>
                  </div>
                </div>
                <span
                  className={[
                    "rounded-full px-2 py-1 text-xs font-medium",
                    task.priority === "High" &&
                      "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
                    task.priority === "Medium" &&
                      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                    task.priority === "Low" &&
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                  ].join(" ")}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl">Recent activity</CardTitle>
            <CardDescription>
              Latest updates from your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950/60"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-200" />
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
