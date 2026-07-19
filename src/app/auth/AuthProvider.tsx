// src/app/auth/AuthProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { sendOtp, verifyOtp, getOrCreateUserRole, signOut as supabaseSignOut, getDashboardRoute } from "@/lib/auth";
import { Database } from "@/lib/supabase";

export type Role = Database["public"]["Tables"]["users"]["Row"]["role"];

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  requestOtp: (email: string) => Promise<void>;
  verifyAndLogin: (email: string, token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
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
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user?.email) {
            setUser(initialSession.user);
            const userRole = await getOrCreateUserRole(initialSession.user.email);
            setRole(userRole);
            
            // Auto-redirect if on login page
            if (pathname === "/login") {
              navigateToDashboard(userRole);
            }
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, currentSession: Session | null) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        setSession(currentSession);
        if (currentSession?.user?.email) {
          setUser(currentSession.user);
          try {
            const userRole = await getOrCreateUserRole(currentSession.user.email);
            setRole(userRole);
            
            // Redirect if on login page
            if (pathname === "/login") {
              navigateToDashboard(userRole);
            }
          } catch (e) {
            console.error("Error setting role on auth change:", e);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setRole(null);
        router.replace("/login");
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const requestOtp = async (email: string): Promise<void> => {
    await sendOtp(email);
    if (isDevMode) {
      console.info("Dev mode enabled: bypassing OTP verification.");
      const mockSession = { user: { email, id: "mock-id" } } as unknown as Session;
      setSession(mockSession);
      setUser(mockSession.user);
      const userRole = await getOrCreateUserRole(email);
      setRole(userRole);
      navigateToDashboard(userRole);
    }
  };

  const verifyAndLogin = async (email: string, token: string): Promise<void> => {
    if (!isDevMode) {
      await verifyOtp(email, token);
    }
    // Session is handled by onAuthStateChange listener in prod.
  };

  const signOut = async (): Promise<void> => {
    await supabaseSignOut();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-medium">Verifying authentication...</p>
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
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
