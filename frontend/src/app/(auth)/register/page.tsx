import { AuthGuard } from "@/components/auth/AuthGuard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            TaskFlow
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Create your account
          </h1>
        </div>
        <RegisterForm />
      </div>
    </AuthGuard>
  );
}
