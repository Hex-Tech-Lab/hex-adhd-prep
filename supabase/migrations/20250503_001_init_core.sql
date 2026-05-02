-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =============================================================================
-- Users Table
-- =============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 120),
  timezone TEXT DEFAULT 'America/New_York',
  language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'US',
  tier TEXT NOT NULL DEFAULT '49' CHECK (tier IN ('49', '199')),
  tier_upgraded_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- Assessment Sessions Table
-- =============================================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('49', '199')),
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'paused', 'completed', 'abandoned', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paused_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  current_section TEXT CHECK (current_section IN ('asrs', 'family', 'history', 'impact', 'comorbidity', 'review')),
  interview_progress_percent INTEGER DEFAULT 0 CHECK (interview_progress_percent >= 0 AND interview_progress_percent <= 100),
  asrs_part_a_score INTEGER CHECK (asrs_part_a_score IS NULL OR (asrs_part_a_score >= 0 AND asrs_part_a_score <= 24)),
  asrs_part_b_score INTEGER CHECK (asrs_part_b_score IS NULL OR (asrs_part_b_score >= 0 AND asrs_part_b_score <= 24)),
  asrs_total_score DECIMAL CHECK (asrs_total_score IS NULL OR (asrs_total_score >= 0 AND asrs_total_score <= 4)),
  asrs_risk_level TEXT CHECK (asrs_risk_level IS NULL OR asrs_risk_level IN ('low', 'moderate', 'high')),
  asrs_completed_at TIMESTAMP WITH TIME ZONE,
  history_data JSONB,
  impact_data JSONB,
  comorbidity_data JSONB,
  report_generated_at TIMESTAMP WITH TIME ZONE,
  report_pdf_url TEXT,
  report_data JSONB,
  council_job_id TEXT,
  council_confidence_scores JSONB,
  council_comorbidity_flags JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status) WHERE status = 'in_progress';
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessments_expires_at ON assessments(expires_at) WHERE status IN ('in_progress', 'paused');

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own assessments"
  ON assessments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own assessments"
  ON assessments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own assessments"
  ON assessments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- Interview Responses Table
-- =============================================================================
CREATE TABLE interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_section TEXT NOT NULL CHECK (question_section IN ('asrs', 'family', 'history', 'impact', 'comorbidity')),
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  response_confidence FLOAT CHECK (response_confidence >= 0 AND response_confidence <= 1),
  response_data JSONB,
  ai_flagged_vague BOOLEAN DEFAULT FALSE,
  ai_follow_up_question TEXT,
  ai_follow_up_response TEXT,
  ai_follow_up_generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interview_responses_assessment_id ON interview_responses(assessment_id);
CREATE INDEX idx_interview_responses_question_id ON interview_responses(question_id);
CREATE INDEX idx_interview_responses_section ON interview_responses(question_section);
CREATE INDEX idx_interview_responses_created_at ON interview_responses(created_at ASC);

ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own responses"
  ON interview_responses FOR SELECT
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

-- =============================================================================
-- Family Input Table
-- =============================================================================
CREATE TABLE family_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  family_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  relationship TEXT NOT NULL CHECK (relationship IN ('parent', 'sibling', 'spouse', 'friend', 'other')),
  family_member_name TEXT,
  family_member_email TEXT,
  consented_at TIMESTAMP WITH TIME ZONE,
  responses JSONB,
  summary_text TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_family_inputs_assessment_id ON family_inputs(assessment_id);
CREATE INDEX idx_family_inputs_family_token ON family_inputs(family_token) WHERE submitted_at IS NULL;
CREATE INDEX idx_family_inputs_submitted_at ON family_inputs(submitted_at);

ALTER TABLE family_inputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read family inputs for their assessments"
  ON family_inputs FOR SELECT
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

-- =============================================================================
-- Reports Table
-- =============================================================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('basic', 'premium')),
  report_data JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own reports"
  ON reports FOR SELECT
  USING (user_id = auth.uid());
