"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiBaseUrl } from "@/config/env";
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
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword: _confirmPassword, ...payload } = values;
      await register(payload);
      toast.success("Account created successfully.");
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create account.";
      setError("root", { message });
      toast.error(message);
    }
  };

  const handleGoogleAuth = () => {
    const googleAuthUrl = apiBaseUrl
      ? `${apiBaseUrl.replace(/\/$/, "")}/api/auth/google/`
      : "/api/auth/google/";

    window.location.href = googleAuthUrl;
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start tracking your tasks with a cleaner workflow.
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
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Full name
            </label>
            <Input id="name" autoComplete="name" {...formRegister("name")} />
            {errors.name ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...formRegister("email")}
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
                autoComplete="new-password"
                className="pr-10"
                {...formRegister("password")}
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Minimum 8 characters
            </p>
            {errors.password ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Confirm password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                className="pr-10"
                {...formRegister("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.confirmPassword.message}
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
            {isSubmitting ? "Creating account..." : "Create account"}
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

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleAuth}
        >
          <Globe className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-slate-900 hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
