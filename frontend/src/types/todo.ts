export type TodoPriority = "low" | "medium" | "high";
export type TodoStatus = "all" | "pending" | "completed";
export type TodoSort =
  | "newest"
  | "oldest"
  | "dueDate"
  | "priority"
  | "alphabetical";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TodoFilters {
  search?: string;
  status?: TodoStatus;
  priority?: "all" | TodoPriority;
  category?: string;
  sort?: TodoSort;
  page?: number;
  limit?: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority: TodoPriority;
  category?: string;
  dueDate?: string;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
