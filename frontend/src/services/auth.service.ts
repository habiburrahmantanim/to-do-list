import {
  api,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAuthSession,
} from "@/services/api";
import type {
  AuthResponse,
  GoogleAuthRequest,
  LoginRequest,
  RegisterRequest,
  RefreshTokenResponse,
  User,
} from "@/types/auth";

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register/", payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login/", payload);
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  return data;
}

export async function loginWithGoogle(
  payload: GoogleAuthRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/google/", payload);
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
  return data;
}

export async function logout(): Promise<void> {
  try {
    const refresh = getRefreshToken();
    await api.post("/api/auth/logout/", { refresh });
  } finally {
    clearAuthSession();
  }
}

export async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  const { data } = await api.post<RefreshTokenResponse>("/api/auth/refresh/", {
    refresh,
  });
  setAccessToken(data.access);
  return data.access;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/me/");
  return data;
}
