import { createClient } from '@supabase/supabase-js';

// Provide fallback values for build environments where env vars may be missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          location: string | null;
          latitude: number;
          longitude: number;
          image_url: string | null;
          status: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'critical';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          location?: string | null;
          latitude: number;
          longitude: number;
          image_url?: string | null;
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string | null;
          location?: string | null;
          latitude?: number;
          longitude?: number;
          image_url?: string | null;
          status?: 'new' | 'in_progress' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          updated_at?: string;
        };
      };
      ai_predictions: {
        Row: {
          id: string;
          report_id: string;
          detected_issue: string;
          confidence: number;
          severity: 'low' | 'medium' | 'high' | 'critical';
          priority: 'low' | 'medium' | 'high' | 'critical';
          department: string;
          estimated_resolution: string;
          summary: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id: string;
          detected_issue: string;
          confidence: number;
          severity: 'low' | 'medium' | 'high' | 'critical';
          priority: 'low' | 'medium' | 'high' | 'critical';
          department: string;
          estimated_resolution: string;
          summary: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string;
          detected_issue?: string;
          confidence?: number;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          department?: string;
          estimated_resolution?: string;
          summary?: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    Views: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
