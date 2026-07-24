// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, ArrowRight, CheckCircle2, User, Building2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/app/auth/AuthProvider";

export default function LoginPage() {
  const { demoLogin } = useAuth();
  
  const [email, setEmail] = useState("citizen@zivic.ai");
  const [password, setPassword] = useState("zivic2026");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"citizen" | "admin" | "officer">("citizen");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await demoLogin(email, password, selectedRole);
    } catch (err) {
      console.error("Login failed:", err);
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: "citizen" | "admin" | "officer") => {
    setSubmitting(true);
    const mockEmail = `${role}@zivic.ai`;
    setEmail(mockEmail);
    setSelectedRole(role);
    await demoLogin(mockEmail, "zivic2026", role);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#060a12] p-4 text-white">
      {/* Dynamic Animated Glass Blobs in background */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/40 via-purple-600/30 to-pink-500/20 blur-[120px] animate-blob-slow" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-500/30 via-teal-500/25 to-blue-600/40 blur-[130px] animate-blob-delay" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[150px] animate-blob-fast" />

      {/* Grid overlay for cyberpunk vibe */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Glassmorphic Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 p-6 sm:p-10 shadow-[0_16px_50px_0_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        {/* Top Glow Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

        {/* Header Header & Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            ZIVIC AI v2.0 Platform
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Welcome to <span className="text-gradient-vibrant">Zivic AI</span>
          </h1>
          <p className="text-sm text-slate-300/80 max-w-sm">
            AI-Powered Urban Infrastructure Intelligence Platform
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200 tracking-wide uppercase flex items-center justify-between">
              <span>Email Address</span>
              <span className="text-[10px] text-cyan-400 font-mono">DEMO READY</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@zivic.ai"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all duration-200 focus:border-indigo-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>

          {/* Password Input with EYE BUTTON */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-200 tracking-wide uppercase flex items-center justify-between">
              <span>Password</span>
              <span className="text-[10px] text-slate-400 font-mono">ANY PASSWORD WORKS</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-12 py-3 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all duration-200 focus:border-indigo-400 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              {/* EYE BUTTON TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-cyan-400" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Role selector buttons */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-slate-200 tracking-wide uppercase">
              Select Demo Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("citizen")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedRole === "citizen"
                    ? "border-cyan-400/80 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <User className="h-3.5 w-3.5" /> Citizen
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("officer")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedRole === "officer"
                    ? "border-indigo-400/80 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" /> Officer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  selectedRole === "admin"
                    ? "border-fuchsia-400/80 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Admin
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            <div className="relative flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Sign In & Launch Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </div>
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Instant Demo Sign-in
            </span>
            <span className="text-[10px] text-slate-400">1-Click Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("citizen")}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:bg-white/10 hover:border-cyan-400/40 transition-all text-left group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-cyan-300">Demo Citizen</div>
                <div className="text-[10px] text-slate-400">Public issues & maps</div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo("officer")}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-200 hover:bg-white/10 hover:border-indigo-400/40 transition-all text-left group"
            >
              <div>
                <div className="font-semibold text-white group-hover:text-indigo-300">Demo Officer</div>
                <div className="text-[10px] text-slate-400">Work orders & dispatch</div>
              </div>
              <CheckCircle2 className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
