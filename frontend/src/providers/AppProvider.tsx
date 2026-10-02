"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";

import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>{children}</AuthProvider>
      </QueryProvider>
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}
