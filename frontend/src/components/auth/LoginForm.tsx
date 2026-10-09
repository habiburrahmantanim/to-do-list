"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GoogleOAuthButton } from "@/components/auth/GoogleOAuthButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const identifier = values.email.trim();
      await login({
        username: identifier,
        email: identifier.includes("@") ? identifier : undefined,
        password: values.password,
      });
      toast.success("Logged in successfully.");
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { message?: string; fieldErrors?: Record<string, string[]> };
      if (err?.fieldErrors) {
        for (const [key, msgs] of Object.entries(err.fieldErrors)) {
          if (Array.isArray(msgs) && msgs.length > 0) {
            if (key === "username" || key === "email") {
              setError("email", { message: msgs[0] });
            } else if (key === "password") {
              setError("password", { message: msgs[0] });
            }
          }
        }
      }
      const message =
        error instanceof Error ? error.message : "Unable to log in.";
      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue managing your tasks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email or Username
            </label>
            <Input
              id="email"
              autoComplete="username"
              placeholder="name@example.com or username"
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          {errors.root ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
              {errors.root.message}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            <span className="bg-white px-2 dark:bg-slate-900">Or</span>
          </div>
        </div>

        <GoogleOAuthButton />

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-slate-900 hover:underline dark:text-white"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
