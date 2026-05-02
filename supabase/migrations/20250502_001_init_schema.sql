-- hex-adhd-prep Supabase Schema
-- Database: hex-adhd-prep
-- Region: Frankfurt (EU compliance)
-- Version: 1.0

-- Core tables for ADHD diagnostic SaaS

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL DEFAULT 'adhd',
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asrs_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response_value INTEGER NOT NULL CHECK (response_value >= 0 AND response_value <= 4),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS asrs_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  inattention_score NUMERIC(3,2),
  hyperactivity_score NUMERIC(3,2),
  overall_score NUMERIC(3,2),
  risk_level TEXT,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE UNIQUE,
  content JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE asrs_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE asrs_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: read own data
CREATE POLICY "users_select" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Assessments: read/write own
CREATE POLICY "assessments_select" ON assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "assessments_insert" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessments_update" ON assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- ASRS Responses: via assessment ownership
CREATE POLICY "asrs_responses_select" ON asrs_responses
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "asrs_responses_insert" ON asrs_responses
  FOR INSERT WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

-- ASRS Scores: via assessment ownership
CREATE POLICY "asrs_scores_select" ON asrs_scores
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "asrs_scores_insert" ON asrs_scores
  FOR INSERT WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

-- Reports: via assessment ownership
CREATE POLICY "reports_select" ON reports
  FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "reports_insert" ON reports
  FOR INSERT WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_asrs_responses_assessment_id ON asrs_responses(assessment_id);
CREATE INDEX idx_asrs_scores_assessment_id ON asrs_scores(assessment_id);
CREATE INDEX idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX idx_users_email ON users(email);
