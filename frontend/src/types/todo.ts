export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "all" | "pending" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "dueDate"
  | "priority"
  | "alphabetical";

export interface Todo {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  priority: TodoPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFilters {
  search?: string;
  status?: TodoStatus;
  priority?: "all" | TodoPriority;
  sort?: TodoSort;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: TodoPriority;
  due_date?: string | null;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  is_completed?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
