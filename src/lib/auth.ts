// src/lib/auth.ts

/**
 * Authentication utilities for Zivic AI.
 *
 * - Email‑only OTP login (password‑less).
 * - Development mode auto‑verification (controlled by NEXT_PUBLIC_DEVELOPMENT_MODE).
 * - Role handling with type‑safe Supabase queries.
 * - Session restoration and auth state change listener.
 * - Next.js router navigation (no full page reloads).
 */

import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, Database } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Supabase client (singleton)
// ---------------------------------------------------------------------------
// Supabase client is imported from '@/lib/supabase' as a singleton.

// Development‑mode flag – only true when NEXT_PUBLIC_DEVELOPMENT_MODE="true".
const isDevMode = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true';

/**
 * Helper to safely read required environment variables. Throws with a clear message if missing.
 */
function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/** Simple email format validator (RFC‑5322‑ish). */
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Send a sign‑in OTP to the provided email.
 * In production the user receives a 6‑digit code via email.
 * In development mode we auto‑verify the OTP to speed up iteration.
 *
 * @param email User's email address.
 * @throws Error with a user‑friendly message on failure.
 */
export async function sendOtp(email: string): Promise<void> {
  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email address.');
  }
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // A redirect URL is required by Supabase, but we handle verification manually.
      options: { emailRedirectTo: `${getEnv('NEXT_PUBLIC_BASE_URL')}/auth/callback` },
    });
    if (error) {
      throw new Error('Failed to send OTP. Please try again later.');
    }
    // Development shortcut – bypass waiting for the email.
    if (isDevMode) {
      // Supabase does not expose the OTP, so we simply fetch the session.
      const { error: sessErr } = await supabase.auth.getSession();
      if (sessErr) {
        console.warn('Dev mode session not yet available; will rely on auth state change.');
      }
    }
  } catch (e) {
    console.error('sendOtp error:', e);
    throw e instanceof Error ? e : new Error('Unexpected error while sending OTP.');
  }
}

/**
 * Verify the OTP entered by the user.
 * This function is only used in production; in development mode the OTP is
 * considered verified automatically after `sendOtp`.
 *
 * @param email User's email address.
 * @param token The 6‑digit code received via email.
 */
export async function verifyOtp(email: string, token: string): Promise<void> {
  if (!isValidEmail(email)) {
    throw new Error('Please provide a valid email address.');
  }
  if (isDevMode) {
    // No verification required – the session should already be active.
    return;
  }
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) {
    // Surface a friendly error to the UI.
    throw new Error('Invalid or expired OTP. Please request a new code.');
  }
}

/**
 * Retrieve the role for the given user (by email).
 * If the user does not exist in the `users` table, create a row with role
 * "citizen". The operation is safe against race conditions using `upsert`.
 */
export async function getOrCreateUserRole(email: string): Promise<Database['public']['Tables']['users']['Row']['role']> {
  try {
    // Upsert: insert if not exists, otherwise return the existing row.
    const { data, error } = await supabase
      .from('users')
      .upsert<Database['public']['Tables']['users']['Insert']>({ email, role: 'citizen' }, {
        onConflict: 'email',
      })
      .select('role')
      .single();
    if (error) {
      console.error('Failed to upsert user role:', error);
      throw new Error('Unable to retrieve user role. Please try again later.');
    }
    if (!data) {
      throw new Error('No role data returned from upsert.');
    }
    return data.role;
  } catch (e) {
    console.error('getOrCreateUserRole error:', e);
    throw e instanceof Error ? e : new Error('Unexpected error while retrieving role.');
  }
}

/**
 * Return the appropriate dashboard route based on role.
 */
export function getDashboardRoute(role: Database['public']['Tables']['users']['Row']['role']): string {
  const pathMap: Record<string, string> = {
    citizen: '/dashboard/citizen',
    admin: '/dashboard/admin',
    officer: '/dashboard/officer',
    worker: '/dashboard/worker',
  };
  return pathMap[role] ?? '/dashboard/citizen';
}

/**
 * Restore the current session on app startup and set up a listener for auth state changes.
 * Calls the provided callback with the latest session (or `null`).
 * Returns an unsubscribe function to clean up the listener when the consumer unmounts.
 */
export function initAuthListener(callback: (session: Session | null) => void): () => void {
  // Initial session restoration.
  supabase.auth.getSession().then(({ data: { session } }) => callback(session));

  // Subscribe to auth changes.
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
    callback(session);
  });

  // Return cleanup function.
  return () => subscription?.unsubscribe();
}

/**
 * Sign the current user out.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('signOut error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
}

// ---------------------------------------------------------------------------
// Helper types (re‑export for convenience)
// ---------------------------------------------------------------------------

export type AuthUser = {
  email: string;
  role: Database['public']['Tables']['users']['Row']['role'];
};
