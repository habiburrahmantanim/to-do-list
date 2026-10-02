import type { ReactNode } from "react";

import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        {children}
      </div>
    </AuthGuard>
  );
}
