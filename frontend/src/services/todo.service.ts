import { api } from "@/services/api";
import type {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>("/api/todos/");
  return data;
}

export async function getTodo(id: number): Promise<Todo> {
  const { data } = await api.get<Todo>(`/api/todos/${id}/`);
  return data;
}

export async function createTodo(payload: CreateTodoRequest): Promise<Todo> {
  const { data } = await api.post<Todo>("/api/todos/", payload);
  return data;
}

export async function updateTodo(
  id: number,
  payload: UpdateTodoRequest,
): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/api/todos/${id}/`, payload);
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/api/todos/${id}/`);
}

export async function toggleTodo(
  id: number,
  is_completed: boolean,
): Promise<Todo> {
  return updateTodo(id, { is_completed });
}
