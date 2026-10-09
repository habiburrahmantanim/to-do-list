"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { googleClientId } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

interface GoogleOAuthButtonProps {
  className?: string;
  label?: string;
}

export function GoogleOAuthButton({
  className = "w-full",
  label = "Continue with Google",
}: GoogleOAuthButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  useEffect(() => {
    if (!googleClientId) return;

    const scriptId = "google-gsi-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initGsi = () => {
      if (window.google?.accounts?.id && googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                setIsLoading(true);
                await loginWithGoogle({ credential: response.credential });
                toast.success("Google authentication successful!");
                router.push("/dashboard");
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Failed to authenticate with Google.";
                toast.error(message);
              } finally {
                setIsLoading(false);
              }
            }
          },
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [googleClientId, loginWithGoogle, router]);

  const handleClick = async () => {
    if (!googleClientId) {
      setShowDevModal(true);
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.info("Loading Google Sign-In SDK, please wait a moment...");
    }
  };

  const handleDevMockLogin = async (email: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      setShowDevModal(false);
      const mockToken = `mock-google-token:${email}:${firstName}:${lastName}`;
      await loginWithGoogle({ credential: mockToken });
      toast.success(`Signed in via Google OAuth as ${email}`);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Dev OAuth simulation failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={className}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Globe className="mr-2 h-4 w-4 text-emerald-500" />
        )}
        {label}
      </Button>

      {showDevModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Google OAuth Configuration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Google Client ID is ready to connect
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              To enable live Google Sign-In, add your client ID to{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                frontend/.env.local
              </code>
              :
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-800 dark:bg-slate-800/80 dark:text-slate-200">
              NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
            </pre>

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Dev Mode Test Login
              </div>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300/80">
                You can test the OAuth JWT exchange right now using simulated Google credentials:
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleDevMockLogin("alex.dev@gmail.com", "Alex", "Dev")
                  }
                >
                  Test as Alex Dev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    handleDevMockLogin("taylor.oauth@gmail.com", "Taylor", "Google")
                  }
                >
                  Test as Taylor Google
                </Button>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDevModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
