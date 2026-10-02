import { api } from "@/services/api";
import type {
  CreateTodoRequest,
  PaginatedResponse,
  Todo,
  UpdateTodoRequest,
} from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>("/api/todos/");
  return data;
}

export async function getTodo(id: string): Promise<Todo> {
  const { data } = await api.get<Todo>(`/api/todos/${id}/`);
  return data;
}

export async function createTodo(payload: CreateTodoRequest): Promise<Todo> {
  const { data } = await api.post<Todo>("/api/todos/", payload);
  return data;
}

export async function updateTodo(
  id: string,
  payload: UpdateTodoRequest,
): Promise<Todo> {
  const { data } = await api.put<Todo>(`/api/todos/${id}/`, payload);
  return data;
}

export async function patchTodo(
  id: string,
  payload: Partial<UpdateTodoRequest>,
): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/api/todos/${id}/`, payload);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(`/api/todos/${id}/`);
}

export async function toggleTodo(
  id: string,
  completed: boolean,
): Promise<Todo> {
  return patchTodo(id, { completed });
}

export async function getTodosPaginated(): Promise<PaginatedResponse<Todo>> {
  const { data } = await api.get<PaginatedResponse<Todo>>("/api/todos/");
  return data;
}
