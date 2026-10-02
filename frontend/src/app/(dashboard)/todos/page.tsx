"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Priority = "low" | "medium" | "high";
type StatusFilter = "all" | "pending" | "completed";

interface TodoTask {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

const priorityOptions: Array<{ value: Priority; label: string }> = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const initialTasks: TodoTask[] = [
  {
    id: "1",
    title: "Build landing page layout",
    description:
      "Finalize the hero, CTA, and conversion-focused sections for the public homepage.",
    dueDate: "2026-10-03",
    priority: "high",
    completed: false,
    createdAt: "2026-10-01T08:30:00.000Z",
  },
  {
    id: "2",
    title: "Prepare onboarding checklist",
    description:
      "Outline the first-run steps and assign labels for each stage of user activation.",
    dueDate: "2026-10-04",
    priority: "medium",
    completed: false,
    createdAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "3",
    title: "Review sprint retrospective",
    description:
      "Capture action items from the discussion and convert them into clear follow-ups.",
    dueDate: "2026-09-30",
    priority: "low",
    completed: true,
    createdAt: "2026-09-29T14:00:00.000Z",
  },
];

const defaultDraft = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium" as Priority,
};

export default function TodosPage() {
  const [tasks, setTasks] = useState<TodoTask[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(defaultDraft);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        const matchesSearch =
          !query ||
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "pending" && !task.completed) ||
          (statusFilter === "completed" && task.completed);

        const matchesPriority =
          priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }

        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
  }, [priorityFilter, search, statusFilter, tasks]);

  const summary = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;
    const highPriority = tasks.filter(
      (task) => task.priority === "high" && !task.completed,
    ).length;

    return [
      {
        label: "Total tasks",
        value: String(total),
        tone: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
      },
      {
        label: "Completed",
        value: String(completed),
        tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      },
      {
        label: "Pending",
        value: String(pending),
        tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      },
      {
        label: "High priority",
        value: String(highPriority),
        tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
      },
    ];
  }, [tasks]);

  const resetForm = () => {
    setDraft(defaultDraft);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim()) {
      return;
    }

    if (editingId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title: draft.title.trim(),
                description: draft.description.trim(),
                dueDate: draft.dueDate || undefined,
                priority: draft.priority,
              }
            : task,
        ),
      );
    } else {
      const nextTask: TodoTask = {
        id: crypto.randomUUID(),
        title: draft.title.trim(),
        description: draft.description.trim(),
        dueDate: draft.dueDate || undefined,
        priority: draft.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((current) => [nextTask, ...current]);
    }

    resetForm();
  };

  const handleEdit = (task: TodoTask) => {
    setDraft({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ?? "",
      priority: task.priority,
    });
    setEditingId(task.id);
    setIsFormOpen(true);
  };

  const handleToggle = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));

    if (editingId === taskId) {
      resetForm();
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Tasks
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            My task board
          </h1>
        </div>
        <Button
          className="w-fit"
          onClick={() => setIsFormOpen((current) => !current)}
        >
          {isFormOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {isFormOpen ? "Close" : "Add task"}
        </Button>
      </section>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map(({ label, value, tone }) => (
          <div key={label} className={`rounded-xl px-4 py-3 ${tone}`}>
            <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-80">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {isFormOpen ? (
        <Card className="mb-6 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Task title
                </label>
                <Input
                  id="task-title"
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Finish onboarding checklist"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-400"
                  placeholder="Add a few notes about this task..."
                />
              </div>

              <div>
                <label
                  htmlFor="task-date"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Due date
                </label>
                <Input
                  id="task-date"
                  type="date"
                  value={draft.dueDate}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      dueDate: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={draft.priority}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      priority: event.target.value as Priority,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Update task" : "Create task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "completed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={[
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                statusFilter === status
                  ? "border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {status === "all"
                ? "All tasks"
                : status === "pending"
                  ? "Active"
                  : "Completed"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>{filteredTasks.length} tasks shown</span>
        <select
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as "all" | Priority)
          }
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="all">All priorities</option>
          {priorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id)}
                    className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white transition-colors hover:border-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-200"
                    aria-label={
                      task.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                  <div>
                    <h2
                      className={[
                        "text-lg font-semibold",
                        task.completed
                          ? "text-slate-500 line-through dark:text-slate-400"
                          : "text-slate-900 dark:text-slate-100",
                      ].join(" ")}
                    >
                      {task.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                      {task.description || "No description provided."}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {task.dueDate ? (
                        <Badge variant="secondary" className="gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Badge>
                      ) : null}

                      <Badge
                        variant={
                          task.priority === "high"
                            ? "danger"
                            : task.priority === "medium"
                              ? "warning"
                              : "success"
                        }
                        className="gap-1"
                      >
                        <Target className="h-3 w-3" />
                        {task.priority}
                      </Badge>

                      <Badge
                        variant={task.completed ? "success" : "secondary"}
                        className="gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        {task.completed ? "Done" : "In progress"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(task)}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-12 text-center">
              <CheckCircle2 className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  No tasks match your filters
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try a different search or create a new task.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
