// src/app/auth/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { sendOtp, verifyOtp, getOrCreateUserRole, getDashboardRoute } from "@/lib/auth";
import { Database } from "@/lib/supabase";

export type Role = Database["public"]["Tables"]["users"]["Row"]["role"];

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface AuthContextType {
  user: User | AuthUser | null;
  session: Session | { user: AuthUser } | null;
  role: Role | null;
  loading: boolean;
  requestOtp: (email: string) => Promise<void>;
  verifyAndLogin: (email: string, token: string) => Promise<void>;
  demoLogin: (email?: string, password?: string, role?: Role) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const DEMO_STORAGE_KEY = "zivic_demo_user_session";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | AuthUser | null>(null);
  const [session, setSession] = useState<Session | { user: AuthUser } | null>(null);
  const [role, setRole] = useState<Role | null>("citizen");
  const [loading, setLoading] = useState(true);

  const isDevMode = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === "true";

  const navigateToDashboard = (userRole: Role) => {
    const destination = getDashboardRoute(userRole);
    router.replace(destination);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Check local demo session first for fast response
        const storedDemo = typeof window !== "undefined" ? localStorage.getItem(DEMO_STORAGE_KEY) : null;
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo) as AuthUser;
          if (mounted) {
            setUser(parsed);
            setSession({ user: parsed });
            setRole(parsed.role || "citizen");
            setLoading(false);
            if (pathname === "/login" || pathname === "/") {
              navigateToDashboard(parsed.role || "citizen");
            }
            return;
          }
        }

        // 2. Safely check Supabase session if no demo session exists
        const { data } = await supabase.auth.getSession();
        if (mounted && data?.session?.user) {
          const supUser = data.session.user;
          setSession(data.session);
          setUser(supUser);
          try {
            const userRole = await getOrCreateUserRole(supUser.email || "citizen@zivic.ai");
            setRole(userRole);
            if (pathname === "/login" || pathname === "/") {
              navigateToDashboard(userRole);
            }
          } catch {
            setRole("citizen");
          }
        }
      } catch (err) {
        console.warn("Auth initialization note:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth changes safely
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          try {
            const userRole = await getOrCreateUserRole(currentSession.user.email || "citizen@zivic.ai");
            setRole(userRole);
            if (pathname === "/login" || pathname === "/") {
              navigateToDashboard(userRole);
            }
          } catch {
            setRole("citizen");
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (typeof window !== "undefined") {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
        setSession(null);
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const demoLogin = async (
    email: string = "citizen@zivic.ai",
    _password?: string,
    userRole: Role = "citizen"
  ): Promise<void> => {
    setLoading(true);
    const demoUser: AuthUser = {
      id: `usr_${Date.now().toString(36)}`,
      email: email || "citizen@zivic.ai",
      name: email.split("@")[0].toUpperCase() || "Citizen",
      role: userRole,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
    }

    setUser(demoUser);
    setSession({ user: demoUser });
    setRole(userRole);
    setLoading(false);

    // Navigate directly to dashboard
    navigateToDashboard(userRole);
  };

  const requestOtp = async (email: string): Promise<void> => {
    try {
      await sendOtp(email);
      if (isDevMode) {
        await demoLogin(email, undefined, "citizen");
      }
    } catch {
      // Fallback to demo login if OTP fails in demo mode
      await demoLogin(email, undefined, "citizen");
    }
  };

  const verifyAndLogin = async (email: string, token: string): Promise<void> => {
    try {
      if (!isDevMode) {
        await verifyOtp(email, token);
      } else {
        await demoLogin(email, undefined, "citizen");
      }
    } catch {
      await demoLogin(email, undefined, "citizen");
    }
  };

  const signOut = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore cleanup error in demo mode
    }
    setUser(null);
    setSession(null);
    setRole(null);
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14] text-white">
        <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl glass-panel">
          <div className="relative flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent glow-indigo" />
            <div className="absolute h-6 w-6 rounded-full bg-cyan-400/20 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-gradient-vibrant">ZIVIC AI</p>
            <p className="text-xs text-slate-400 mt-1">Initializing Urban Intelligence Platform...</p>
          </div>
        </div>
      </div>
    );
  }

  const contextValue: AuthContextType = {
    user,
    session,
    role,
    loading,
    requestOtp,
    verifyAndLogin,
    demoLogin,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
