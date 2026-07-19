// src/app/login/verify/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/app/auth/AuthProvider";
// import { Loader2, RefreshCcw } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const { verifyAndLogin, requestOtp, loading: authLoading } = useAuth();

  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If email missing, redirect back to login
  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await verifyAndLogin(email, token);
      // In production, onAuthStateChange will redirect. In dev mode, already redirected.
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    try {
      await requestOtp(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
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
          <CardTitle className="text-2xl font-bold text-white">Verify OTP</CardTitle>
          <p className="text-sm text-white/80">Enter the 6‑digit code sent to <span className="font-medium">{email}</span></p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="otp" className="text-sm font-medium text-white/90">
                OTP Code
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isDisabled}
                maxLength={6}
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
              disabled={isDisabled || token.length !== 6}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {submitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
            <div className="flex justify-between text-sm">
              <Button variant="ghost" type="button" onClick={handleResend} disabled={isDisabled}>
                Resend OTP
              </Button>
              <Button variant="ghost" type="button" onClick={() => router.replace("/login")}>Change Email</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.main>
  );
}
