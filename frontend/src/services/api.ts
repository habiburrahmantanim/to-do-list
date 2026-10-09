import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { apiBaseUrl } from "@/config/env";

export class ApiError extends Error {
  fieldErrors?: Record<string, string[]>;
  status?: number;

  constructor(
    message: string,
    fieldErrors?: Record<string, string[]>,
    status?: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

export type ApiErrorPayload = ApiError;

const TOKEN_KEY = "taskflow_access_token";
const REFRESH_KEY = "taskflow_refresh_token";

let accessToken: string | null = null;
let refreshTokenValue: string | null = null;

if (typeof window !== "undefined") {
  accessToken = window.localStorage.getItem(TOKEN_KEY);
  refreshTokenValue = window.localStorage.getItem(REFRESH_KEY);
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshTokenValue;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;

  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function setRefreshToken(token: string | null): void {
  refreshTokenValue = token;

  if (typeof window !== "undefined") {
    if (token) {
      window.localStorage.setItem(REFRESH_KEY, token);
      return;
    }

    window.localStorage.removeItem(REFRESH_KEY);
  }
}

export function clearAuthSession(): void {
  setAccessToken(null);
  setRefreshToken(null);
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const rawData = error.response?.data;
    let fieldErrors: Record<string, string[]> | undefined;
    let message: string | undefined;

    if (rawData && typeof rawData === "object" && !Array.isArray(rawData)) {
      const payload = rawData as Record<string, unknown>;

      if (typeof payload.detail === "string") {
        message = payload.detail;
      } else if (
        Array.isArray(payload.non_field_errors) &&
        payload.non_field_errors.length > 0
      ) {
        message = payload.non_field_errors.join(" ");
      } else if (typeof payload.message === "string") {
        message = payload.message;
      }

      const collectedErrors: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(payload)) {
        if (key === "detail" || key === "message") continue;
        if (Array.isArray(val)) {
          collectedErrors[key] = val.map(String);
        } else if (typeof val === "string") {
          collectedErrors[key] = [val];
        }
      }

      if (Object.keys(collectedErrors).length > 0) {
        fieldErrors = collectedErrors;
        if (!message) {
          const firstKey = Object.keys(collectedErrors)[0];
          message = `${firstKey}: ${collectedErrors[firstKey][0]}`;
        }
      }
    } else if (typeof rawData === "string") {
      message = rawData;
    }

    return new ApiError(
      message || error.message || "Something went wrong. Please try again.",
      fieldErrors,
      error.response?.status,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Something went wrong. Please try again.");
}

export const api = axios.create({
  baseURL: apiBaseUrl || "/",
  timeout: 20000,
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

      const currentRefresh = getRefreshToken();
      if (!currentRefresh) {
        clearAuthSession();
        return Promise.reject(normalizeApiError(error));
      }

      try {
        const { data } = await api.post<{ access: string }>(
          "/api/auth/refresh/",
          { refresh: currentRefresh },
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
