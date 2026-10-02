import { api, setAccessToken } from "@/services/api";
import type {
  AuthResponse,
  ChangePasswordRequest,
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
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/auth/logout/");
  } finally {
    setAccessToken(null);
  }
}

export async function refreshToken(): Promise<string> {
  const { data } = await api.post<RefreshTokenResponse>("/api/auth/refresh/");
  setAccessToken(data.access);
  return data.access;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/me/");
  return data;
}

export async function changePassword(
  payload: ChangePasswordRequest,
): Promise<void> {
  await api.post("/api/users/change-password/", payload);
}
