// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/app/auth/AuthProvider";

export default function LoginPage() {
  const { requestOtp, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await requestOtp(email);
      // If not in dev mode, navigate to OTP verification page
      if (process.env.NEXT_PUBLIC_DEVELOPMENT_MODE !== "true") {
        router.push(`/login/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || authLoading;

  return (
    <motion.main
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-400 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-indigo-200"
          >
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 5.274 3.44 9.74 8.207 11.373.6.11.793-.262.793-.583v-2.17c-3.338.724-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.087-.744.082-.729.082-.729 1.203.084 1.837 1.236 1.837 1.236 1.07 1.834 2.808 1.304 3.492.997.108-.775.418-1.304.76-1.603-2.665-.304-5.466-1.332-5.466-5.932 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.51 11.51 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.553 3.296-1.23 3.296-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.804 5.624-5.476 5.92.43.371.814 1.102.814 2.222v3.293c0 .322.192.697.801.58C20.565 21.736 24 17.274 24 12c0-6.627-5.373-12-12-12z"
              fill="currentColor"
            />
          </svg>
          <CardTitle className="text-2xl font-bold text-white">Zivic AI</CardTitle>
          <p className="text-sm text-white/80">
            AI-Powered Urban Infrastructure Intelligence Platform
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-white/90">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isDisabled}
                className="bg-white/20 text-white placeholder-white/60 focus-visible:ring-2 focus-visible:ring-indigo-300"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={isDisabled || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Sending OTP
                </>
              ) : (
                "Continue"
              )}
            </Button>
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.replace("/")}
              disabled={isDisabled}
            >
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.main>
  );
}
