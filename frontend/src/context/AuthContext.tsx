"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  login,
  logout,
  register,
} from "@/services/auth.service";
import { getAccessToken, setAccessToken } from "@/services/api";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (payload: LoginRequest) => {
    const response = await login(payload);
    setUser(response.user);
  }, []);

  const handleRegister = useCallback(async (payload: RegisterRequest) => {
    const response = await register(payload);
    setUser(response.user);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
    }),
    [handleLogin, handleLogout, handleRegister, isLoading, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
