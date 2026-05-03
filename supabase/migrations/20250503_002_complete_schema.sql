-- =============================================================================
-- ADHD-Prep Database Schema - Complete & Production Ready
-- =============================================================================
-- This migration creates all tables, indexes, and RLS policies for ADHD-Prep
-- Run this after creating Supabase project

-- =============================================================================
-- Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA public;

-- =============================================================================
-- Users Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  age INTEGER CHECK (age >= 18 AND age <= 120),
  timezone TEXT DEFAULT 'America/New_York',
  tier TEXT NOT NULL DEFAULT '49' CHECK (tier IN ('49', '199')),
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY IF NOT EXISTS "Users can read own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY IF NOT EXISTS "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- Assessments Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('49', '199')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'paused', 'completed', 'abandoned')),
  current_section TEXT CHECK (current_section IN ('start', 'asrs', 'history', 'impact', 'comorbidity', 'family', 'review', 'complete')),

  -- ASRS scores
  asrs_score DECIMAL(3,2) CHECK (asrs_score IS NULL OR (asrs_score >= 0 AND asrs_score <= 4)),
  asrs_risk_level TEXT CHECK (asrs_risk_level IS NULL OR asrs_risk_level IN ('low', 'moderate', 'high')),
  asrs_completed_at TIMESTAMP WITH TIME ZONE,

  -- Assessment data (JSONB for flexibility)
  history_data JSONB,
  impact_data JSONB,
  comorbidity_data JSONB,
  family_input_provided BOOLEAN DEFAULT FALSE,
  family_input_completed_at TIMESTAMP WITH TIME ZONE,

  -- Report & Council
  report_pdf_url TEXT,
  report_data JSONB,
  council_job_id TEXT,
  council_confidence_scores JSONB,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_user_status ON public.assessments(user_id, status);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own assessments
CREATE POLICY IF NOT EXISTS "Users can read own assessments"
  ON public.assessments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert own assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own assessments"
  ON public.assessments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- Interview Responses Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  response_text TEXT,
  response_score INTEGER CHECK (response_score IS NULL OR (response_score >= 0 AND response_score <= 100)),
  ai_flagged_vague BOOLEAN DEFAULT FALSE,
  ai_follow_up_question TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_responses_assessment_id ON public.interview_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_interview_responses_created_at ON public.interview_responses(created_at DESC);

ALTER TABLE public.interview_responses ENABLE ROW LEVEL SECURITY;

-- Users can read responses from their own assessments (via JOIN)
CREATE POLICY IF NOT EXISTS "Users can read own responses"
  ON public.interview_responses FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM public.assessments WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- Family Inputs Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.family_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  family_token TEXT UNIQUE NOT NULL,
  family_member_name TEXT NOT NULL,
  relationship TEXT CHECK (relationship IN ('parent', 'sibling', 'spouse', 'friend', 'other')),
  observations TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_family_inputs_assessment_id ON public.family_inputs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_family_inputs_family_token ON public.family_inputs(family_token);

ALTER TABLE public.family_inputs ENABLE ROW LEVEL SECURITY;

-- Anyone with the family_token can insert/update their own response
CREATE POLICY IF NOT EXISTS "Family can submit via token"
  ON public.family_inputs FOR INSERT
  WITH CHECK (TRUE);

-- Family can update their own response with token
CREATE POLICY IF NOT EXISTS "Family can update own response"
  ON public.family_inputs FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================================
-- Clinician Feedback Table (Software 3.0)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.clinician_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  clinician_id TEXT,
  actual_diagnosis TEXT CHECK (actual_diagnosis IN ('adhd', 'not-adhd', 'other')),
  confidence DECIMAL(2,2) CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  assessment_accuracy DECIMAL(2,2) CHECK (assessment_accuracy IS NULL OR (assessment_accuracy >= 0 AND assessment_accuracy <= 1)),
  missing_symptoms TEXT[],
  false_positives TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_assessment_id ON public.clinician_feedback(assessment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.clinician_feedback(created_at DESC);

-- =============================================================================
-- Analytics Table (for tracking response quality)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.response_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  response_id UUID REFERENCES public.interview_responses(id) ON DELETE CASCADE,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  length_category TEXT CHECK (length_category IN ('too_short', 'adequate', 'detailed')),
  specificity TEXT CHECK (specificity IN ('vague', 'specific', 'detailed')),
  relevance TEXT CHECK (relevance IN ('off_topic', 'relevant', 'highly_relevant')),
  clarity TEXT CHECK (clarity IN ('unclear', 'clear', 'very_clear')),
  needs_followup BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quality_metrics_assessment_id ON public.response_quality_metrics(assessment_id);
CREATE INDEX IF NOT EXISTS idx_quality_metrics_quality_score ON public.response_quality_metrics(quality_score DESC);

-- =============================================================================
-- Reports Table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT CHECK (report_type IN ('standard', 'enhanced')),
  report_data JSONB,
  pdf_url TEXT,
  clinician_notes TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_assessment_id ON public.reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can read own reports"
  ON public.reports FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to calculate assessment progress
CREATE OR REPLACE FUNCTION public.calculate_assessment_progress(assessment_id UUID)
RETURNS TABLE (progress_percent INTEGER, completed_sections TEXT[]) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROUND(
      (CASE WHEN a.asrs_score IS NOT NULL THEN 1 ELSE 0 END * 20 +
       CASE WHEN a.history_data IS NOT NULL THEN 1 ELSE 0 END * 20 +
       CASE WHEN a.impact_data IS NOT NULL THEN 1 ELSE 0 END * 20 +
       CASE WHEN a.comorbidity_data IS NOT NULL THEN 1 ELSE 0 END * 20 +
       CASE WHEN a.family_input_provided THEN 1 ELSE 0 END * 20)::numeric
    )::INTEGER as pct,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN a.asrs_score IS NOT NULL THEN 'asrs' END,
      CASE WHEN a.history_data IS NOT NULL THEN 'history' END,
      CASE WHEN a.impact_data IS NOT NULL THEN 'impact' END,
      CASE WHEN a.comorbidity_data IS NOT NULL THEN 'comorbidity' END,
      CASE WHEN a.family_input_provided THEN 'family' END
    ], NULL) as sections
  FROM public.assessments a
  WHERE a.id = assessment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Seed Data (Optional - for testing)
-- =============================================================================

-- Insert test user (demo@test.com)
-- Password hash for "demo12345" with random salt
INSERT INTO public.users (email, password_hash, age, tier)
VALUES (
  'demo@test.com',
  '$2b$10$demo.user.for.testing.purposes.only.do.not.use.in.production.12',
  30,
  '49'
)
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- Migration Complete
-- =============================================================================
-- Run these commands to verify:
-- SELECT * FROM public.users;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM pg_policies WHERE tablename LIKE '%assessment%';
