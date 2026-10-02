export const API_BASE_PATH = "/api";
export const DEFAULT_PAGE_LIMIT = 10;
export const TODO_PRIORITIES = ["low", "medium", "high"] as const;
export const TODO_STATUS_OPTIONS = ["all", "pending", "completed"] as const;
export const TODO_SORT_OPTIONS = [
  "newest",
  "oldest",
  "dueDate",
  "priority",
  "alphabetical",
] as const;
