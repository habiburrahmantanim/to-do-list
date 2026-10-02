import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { apiBaseUrl } from "@/config/env";

export interface ApiErrorPayload {
  message: string;
  fieldErrors?: Record<string, string[]>;
  status?: number;
}

interface ErrorResponseShape {
  message?: string;
  detail?: string;
  non_field_errors?: string[];
  field_errors?: Record<string, string[]>;
  fieldErrors?: Record<string, string[]>;
  errors?: Record<string, string[]>;
}

let accessToken: string | null = null;

if (typeof window !== "undefined") {
  accessToken = window.localStorage.getItem("taskflow_access_token");
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem("taskflow_access_token", token);
      return;
    }

    window.localStorage.removeItem("taskflow_access_token");
  }
}

export function clearAuthSession(): void {
  setAccessToken(null);
}

export function normalizeApiError(error: unknown): ApiErrorPayload {
  if (axios.isAxiosError(error)) {
    const payload = (error.response?.data ?? {}) as ErrorResponseShape;
    const fieldErrors =
      payload.field_errors ?? payload.fieldErrors ?? payload.errors;

    const fallbackMessage =
      payload.detail ??
      (Array.isArray(payload.non_field_errors)
        ? payload.non_field_errors.join(" ")
        : undefined) ??
      payload.message ??
      "Something went wrong. Please try again.";

    return {
      message: fallbackMessage,
      fieldErrors,
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please try again." };
}

export const api = axios.create({
  baseURL: apiBaseUrl || "/",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
const failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
      return;
    }

    request.resolve(token);
  });

  failedQueue.length = 0;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/auth/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest as AxiosRequestConfig)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ access: string }>(
          "/api/auth/refresh/",
        );
        const nextToken = data.access;
        setAccessToken(nextToken);
        processQueue(null, nextToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthSession();
        return Promise.reject(normalizeApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
