import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: 'citizen' | 'admin' | 'officer' | 'worker';
          city: string | null;
          ward: string | null;
          phone: string | null;
        };
        Insert: {
          email: string;
          name?: string;
          avatar_url?: string;
          role?: 'citizen' | 'admin' | 'officer' | 'worker';
          city?: string;
          ward?: string;
          phone?: string;
        };
        Update: {
          name?: string;
          avatar_url?: string;
          role?: 'citizen' | 'admin' | 'officer' | 'worker';
          city?: string;
          ward?: string;
          phone?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string | null;
          location: {
            lat: number;
            lng: number;
          };
          status: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'critical';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string;
          category?: string;
          location: { lat: number; lng: number };
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'critical';
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          location?: { lat: number; lng: number };
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'critical';
        };
      };
    };
    Functions: {};
    Enums: {};
  };
};
