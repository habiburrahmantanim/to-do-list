export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  access: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
