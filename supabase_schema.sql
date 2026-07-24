-- ============================================================================
-- ZIVIC AI - SUPABASE DATABASE SCHEMA MIGRATION
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin', 'officer', 'worker')),
  city TEXT,
  ward TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY DEFAULT ('rep_' || gen_random_uuid()),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create AI Predictions Table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id TEXT PRIMARY KEY DEFAULT ('pred_' || gen_random_uuid()),
  report_id TEXT NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  detected_issue TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  department TEXT NOT NULL,
  estimated_resolution TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Policies for Open Access in MVP
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reports" ON public.reports FOR UPDATE USING (true);

CREATE POLICY "Allow public read predictions" ON public.ai_predictions FOR SELECT USING (true);
CREATE POLICY "Allow public insert predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

-- 5. Storage Bucket Configuration for Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Report Images" ON storage.objects FOR SELECT USING (bucket_id = 'report-images');
CREATE POLICY "Public Upload Report Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'report-images');
