# DATABASE SCHEMA & MIGRATIONS
**Version:** 1.0  
**Database:** Supabase PostgreSQL 15+  
**Extensions:** pgvector (for future embeddings)  
**Status:** Migration scripts ready for Phase 0

---

## 1. MIGRATION 001: Core Tables

**File:** `supabase/migrations/20250502_001_init_core.sql`

```sql
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
  
  -- User profile
  full_name TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 120),
  timezone TEXT DEFAULT 'America/New_York',
  language TEXT DEFAULT 'en',
  country TEXT DEFAULT 'US',
  
  -- Subscription tier
  tier TEXT NOT NULL DEFAULT '49' CHECK (tier IN ('49', '199')),
  tier_upgraded_at TIMESTAMP,
  
  -- Account status
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_is_active ON users(is_active) WHERE is_active = TRUE;

-- Enable RLS
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
  
  -- Session metadata
  tier TEXT NOT NULL CHECK (tier IN ('49', '199')),
  status TEXT NOT NULL DEFAULT 'in_progress' 
    CHECK (status IN ('in_progress', 'paused', 'completed', 'abandoned', 'expired')),
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paused_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  
  -- Progress tracking
  current_section TEXT CHECK (current_section IN ('onboarding', 'asrs', 'interview', 'family', 'report')),
  interview_progress_percent INTEGER DEFAULT 0 CHECK (interview_progress_percent >= 0 AND interview_progress_percent <= 100),
  
  -- ASRS Screening Results
  asrs_part_a_score INTEGER CHECK (asrs_part_a_score IS NULL OR (asrs_part_a_score >= 0 AND asrs_part_a_score <= 9)),
  asrs_part_b_score INTEGER CHECK (asrs_part_b_score IS NULL OR (asrs_part_b_score >= 0 AND asrs_part_b_score <= 9)),
  asrs_total_score INTEGER CHECK (asrs_total_score IS NULL OR (asrs_total_score >= 0 AND asrs_total_score <= 18)),
  asrs_risk_level TEXT CHECK (asrs_risk_level IS NULL OR asrs_risk_level IN ('Low', 'Moderate', 'High')),
  asrs_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Interview Progress
  interview_started_at TIMESTAMP WITH TIME ZONE,
  interview_completed_at TIMESTAMP WITH TIME ZONE,
  interview_responses_count INTEGER DEFAULT 0,
  interview_section_current TEXT CHECK (interview_section_current IN ('childhood', 'adulthood', 'functional')),
  
  -- Family Input
  family_input_requested_at TIMESTAMP WITH TIME ZONE,
  family_input_completed_at TIMESTAMP WITH TIME ZONE,
  family_input_provided BOOLEAN DEFAULT FALSE,
  
  -- Report Generation
  report_generated_at TIMESTAMP WITH TIME ZONE,
  report_pdf_url TEXT,
  report_data JSONB, -- denormalized for quick access
  
  -- Council Review (Tier 2 only)
  council_job_id TEXT,
  council_started_at TIMESTAMP WITH TIME ZONE,
  council_completed_at TIMESTAMP WITH TIME ZONE,
  council_confidence_scores JSONB, -- { "inattention": 0.87, "hyperactivity": 0.42, ... }
  council_comorbidity_flags JSONB, -- [ { "flag": "anxiety", "confidence": 0.65 }, ... ]
  council_result_data JSONB,
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
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
  
  -- Question metadata
  question_id TEXT NOT NULL, -- e.g., 'a1_inattention_1', 'functional_work'
  question_section TEXT NOT NULL CHECK (question_section IN ('childhood', 'adulthood', 'functional')),
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  
  -- Response data
  response_text TEXT NOT NULL,
  response_confidence FLOAT CHECK (response_confidence >= 0 AND response_confidence <= 1),
  
  -- Structured response (parsed from free text)
  response_data JSONB, -- { "presence": true, "frequency": "daily", "examples": [...], "severity": "high" }
  
  -- AI Processing
  ai_flagged_vague BOOLEAN DEFAULT FALSE,
  ai_follow_up_question TEXT,
  ai_follow_up_response TEXT,
  ai_follow_up_generated_at TIMESTAMP WITH TIME ZONE,
  ai_contradiction_flag TEXT, -- "contradicts: [response_id]" if found
  
  -- Metadata
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
  
  -- Security
  family_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  
  -- Family member info
  relationship TEXT NOT NULL CHECK (relationship IN ('spouse', 'parent', 'sibling', 'other')),
  family_member_name TEXT,
  family_member_email TEXT,
  
  -- Consent
  consented_at TIMESTAMP WITH TIME ZONE,
  
  -- Responses
  responses JSONB, -- { "q1": "answer", "q2": "answer", ... }
  summary_text TEXT,
  
  -- Metadata
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
  
  -- Report type
  report_type TEXT NOT NULL CHECK (report_type IN ('basic', 'premium')),
  
  -- Structured report content
  report_data JSONB NOT NULL, -- { "executive_summary": "...", "asrs_results": {...}, ... }
  
  -- PDF artifact
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP WITH TIME ZONE,
  pdf_file_size_bytes INTEGER,
  
  -- Clinician notes
  clinician_notes TEXT, -- AI-generated, visible to clinician
  clinician_summary TEXT,
  areas_for_clarification TEXT[], -- array of areas to explore
  
  -- Distribution
  email_sent_at TIMESTAMP WITH TIME ZONE,
  secure_link_token TEXT UNIQUE,
  secure_link_created_at TIMESTAMP WITH TIME ZONE,
  secure_link_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own reports"
  ON reports FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- Clinician Directory Table
-- =============================================================================
CREATE TABLE clinicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity & credentials
  full_name TEXT NOT NULL,
  credentials TEXT, -- "MD, PhD" etc.
  specialty TEXT NOT NULL CHECK (specialty IN ('psychiatry', 'psychology', 'nurse_practitioner', 'other')),
  license_number TEXT,
  license_state TEXT NOT NULL,
  board_certified BOOLEAN DEFAULT FALSE,
  
  -- ADHD expertise
  adhd_specialist BOOLEAN DEFAULT TRUE,
  adult_adhd BOOLEAN DEFAULT TRUE,
  child_adhd BOOLEAN DEFAULT FALSE,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  booking_url TEXT,
  booking_system TEXT, -- 'calendly', 'acuity', 'custom', etc.
  
  -- Location
  practice_address TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  latitude FLOAT,
  longitude FLOAT,
  
  -- Service delivery
  telehealth_available BOOLEAN DEFAULT TRUE,
  in_person_available BOOLEAN DEFAULT TRUE,
  
  -- Insurance accepted
  insurance_accepted TEXT[], -- ['BCBS', 'Aetna', ...]
  accepts_uninsured BOOLEAN DEFAULT TRUE,
  
  -- Reviews & ratings
  rating FLOAT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  review_count INTEGER DEFAULT 0,
  review_source TEXT, -- 'Psychology Today', 'Zencare', etc.
  
  -- Data quality
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_clinicians_state ON clinicians(state) WHERE deleted_at IS NULL;
CREATE INDEX idx_clinicians_city_state ON clinicians(city, state) WHERE deleted_at IS NULL;
CREATE INDEX idx_clinicians_adhd_specialist ON clinicians(adhd_specialist) WHERE deleted_at IS NULL AND verified = TRUE;
CREATE INDEX idx_clinicians_location ON clinicians USING gist(ll_to_earth(latitude, longitude)) WHERE deleted_at IS NULL;
CREATE INDEX idx_clinicians_verified ON clinicians(verified) WHERE deleted_at IS NULL;

-- Note: clinicians table is public (no RLS needed)

-- =============================================================================
-- Referrals Table (Audit Trail)
-- =============================================================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES clinicians(id) ON DELETE SET NULL,
  
  -- Referral delivery
  referral_type TEXT NOT NULL CHECK (referral_type IN ('direct_link', 'email')),
  secure_link_token TEXT UNIQUE,
  secure_link_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  secure_link_expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),
  
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_address TEXT,
  
  -- Tracking
  link_first_accessed_at TIMESTAMP WITH TIME ZONE,
  link_access_count INTEGER DEFAULT 0,
  report_downloaded_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_referrals_assessment_id ON referrals(assessment_id);
CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_clinician_id ON referrals(clinician_id);
CREATE INDEX idx_referrals_secure_link_token ON referrals(secure_link_token) WHERE secure_link_token IS NOT NULL;

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own referrals"
  ON referrals FOR SELECT
  USING (user_id = auth.uid());

-- =============================================================================
-- Audit Log Table (Compliance & Security)
-- =============================================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Action details
  action TEXT NOT NULL, -- 'login', 'assessment_start', 'report_generate', 'data_export', etc.
  resource_type TEXT, -- 'assessment', 'report', 'user', 'family_input'
  resource_id UUID,
  
  -- Details & context
  details JSONB, -- { "tier": "199", "section": "asrs", ... }
  
  -- Network info
  ip_address INET,
  user_agent TEXT,
  
  -- Status
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure')),
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);

-- Note: audit_logs have minimal RLS (only admins read)

-- =============================================================================
-- Response Embeddings Table (for future AI features)
-- =============================================================================
CREATE TABLE response_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES interview_responses(id) ON DELETE CASCADE,
  
  -- Embedding data
  embedding vector(1536), -- Claude/OpenAI embedding dimension
  embedding_model TEXT NOT NULL DEFAULT 'text-embedding-3-small',
  embedding_version INTEGER DEFAULT 1,
  
  -- Source text (for reference)
  source_text TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_response_embeddings_assessment_id ON response_embeddings(assessment_id);
CREATE INDEX idx_response_embeddings_response_id ON response_embeddings(response_id);
CREATE INDEX idx_response_embeddings_vector ON response_embeddings USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);

ALTER TABLE response_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read embeddings for their responses"
  ON response_embeddings FOR SELECT
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

-- =============================================================================
-- Utility Functions
-- =============================================================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interview_responses_updated_at BEFORE UPDATE ON interview_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_inputs_updated_at BEFORE UPDATE ON family_inputs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinicians_updated_at BEFORE UPDATE ON clinicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Comment on tables (documentation)
-- =============================================================================

COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON TABLE assessments IS 'ADHD assessment sessions (one per user, per initiation)';
COMMENT ON TABLE interview_responses IS 'Individual symptom/interview responses within an assessment';
COMMENT ON TABLE family_inputs IS 'Family member / collateral information for an assessment';
COMMENT ON TABLE reports IS 'Generated clinician-ready reports (one per assessment)';
COMMENT ON TABLE clinicians IS 'Clinician directory (public, seeded data)';
COMMENT ON TABLE referrals IS 'Referral tracking (which clinician, when, how)';
COMMENT ON TABLE audit_logs IS 'Compliance & security audit trail';
COMMENT ON TABLE response_embeddings IS 'Vector embeddings for future cohort analysis & data product';
```

---

## 2. MIGRATION 002: Seed Data (Clinician Directory)

**File:** `supabase/migrations/20250502_002_seed_clinicians.sql`

```sql
-- Seed 20 sample clinicians across US major metro areas
INSERT INTO clinicians (
  full_name, credentials, specialty, license_state,
  adhd_specialist, adult_adhd,
  email, phone, website, booking_url, booking_system,
  city, state, latitude, longitude,
  telehealth_available, in_person_available,
  insurance_accepted, accepts_uninsured,
  rating, review_count, review_source,
  verified, verified_at
) VALUES
  ('Dr. Sarah Mitchell, MD', 'MD, ABPN', 'psychiatry', 'NY', true, true,
   'sarah@psychiatry-ny.com', '+1-212-555-0101', 'https://sarah-mitchell-md.com', 'https://calendly.com/sarahmitchell', 'calendly',
   'New York', 'NY', 40.7128, -74.0060,
   true, true,
   ARRAY['BCBS', 'Aetna', 'UnitedHealth'], true,
   4.8, 127, 'Psychology Today',
   true, NOW()),

  ('Dr. James Chen, PhD', 'PhD Clinical Psychology', 'psychology', 'CA', true, true,
   'james@adhd-sf.com', '+1-415-555-0202', 'https://james-chen.org', 'https://acuity.com/jamesc', 'acuity',
   'San Francisco', 'CA', 37.7749, -122.4194,
   true, true,
   ARRAY['BCBS', 'Cigna', 'Aetna'], true,
   4.9, 203, 'Zencare',
   true, NOW()),

  ('Dr. Rebecca Lopez, MD', 'MD, ABPN', 'psychiatry', 'IL', true, true,
   'rebecca@chicago-adhd.com', '+1-312-555-0303', 'https://rebeccalopez-md.com', 'https://calendly.com/rebeccalopez', 'calendly',
   'Chicago', 'IL', 41.8781, -87.6298,
   true, true,
   ARRAY['BCBS', 'Humana', 'UnitedHealth'], true,
   4.7, 95, 'Psychology Today',
   true, NOW()),

  ('Dr. Michael Torres, NP', 'NP, PMHCNS-BC', 'nurse_practitioner', 'TX', true, true,
   'michael@houston-adhd.com', '+1-713-555-0404', 'https://m-torres-np.com', 'https://acuity.com/mtorres', 'acuity',
   'Houston', 'TX', 29.7604, -95.3698,
   true, false,
   ARRAY['Cigna', 'BlueCross'], true,
   4.6, 78, 'Zencare',
   true, NOW()),

  ('Dr. Elena Rodriguez, PhD', 'PhD Clinical Psychology', 'psychology', 'AZ', true, true,
   'elena@phoenix-mental.com', '+1-602-555-0505', 'https://elena-rodriguez.org', 'https://calendly.com/erodriguez', 'calendly',
   'Phoenix', 'AZ', 33.4484, -112.0742,
   true, true,
   ARRAY['BCBS', 'Aetna'], true,
   4.8, 112, 'Psychology Today',
   true, NOW());

-- Note: In production, seed with 50+ clinicians from:
-- - Psychology Today API
-- - Zencare directory
-- - Healthgrades database
-- - Manual community clinician partnerships
```

---

## 3. MIGRATION 003: Functions & Stored Procedures

**File:** `supabase/migrations/20250502_003_stored_procedures.sql`

```sql
-- =============================================================================
-- Function: Get Assessment Summary (for reports)
-- =============================================================================
CREATE OR REPLACE FUNCTION get_assessment_summary(
  p_assessment_id UUID
)
RETURNS TABLE (
  total_responses INTEGER,
  a1_items_present INTEGER,
  a2_items_present INTEGER,
  functional_domains JSONB,
  family_input_present BOOLEAN,
  time_to_complete INTERVAL
) AS $$
DECLARE
  v_started_at TIMESTAMP;
  v_completed_at TIMESTAMP;
BEGIN
  SELECT started_at, interview_completed_at
  INTO v_started_at, v_completed_at
  FROM assessments
  WHERE id = p_assessment_id;

  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_responses,
    (SELECT COUNT(*) FROM interview_responses
     WHERE assessment_id = p_assessment_id
     AND question_section IN ('childhood', 'adulthood')
     AND (response_data->>'presence')::BOOLEAN = true
     AND question_id LIKE 'a1_%')::INTEGER as a1_items_present,
    (SELECT COUNT(*) FROM interview_responses
     WHERE assessment_id = p_assessment_id
     AND question_section IN ('childhood', 'adulthood')
     AND (response_data->>'presence')::BOOLEAN = true
     AND question_id LIKE 'a2_%')::INTEGER as a2_items_present,
    jsonb_build_object(
      'work', COUNT(*) FILTER (WHERE question_id LIKE 'functional_work%'),
      'home', COUNT(*) FILTER (WHERE question_id LIKE 'functional_home%'),
      'relationships', COUNT(*) FILTER (WHERE question_id LIKE 'functional_relationships%')
    ) as functional_domains,
    EXISTS(SELECT 1 FROM family_inputs WHERE assessment_id = p_assessment_id AND submitted_at IS NOT NULL) as family_input_present,
    v_completed_at - v_started_at as time_to_complete
  FROM interview_responses
  WHERE assessment_id = p_assessment_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Function: Calculate ASRS Risk Level (helper)
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_asrs_risk_level(
  p_part_a INTEGER,
  p_part_b INTEGER
)
RETURNS TEXT AS $$
BEGIN
  IF p_part_a >= 6 OR p_part_b >= 6 THEN
    RETURN 'High';
  ELSIF p_part_a >= 4 OR p_part_b >= 4 THEN
    RETURN 'Moderate';
  ELSE
    RETURN 'Low';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- Trigger: Auto-update assessment progress on new response
-- =============================================================================
CREATE OR REPLACE FUNCTION update_assessment_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_total_qs INTEGER;
  v_answered INTEGER;
  v_progress_percent INTEGER;
BEGIN
  -- Count expected questions by section (18 childhood + 18 adult + 5 functional = 41)
  v_total_qs := 41;

  -- Count answered questions
  SELECT COUNT(DISTINCT question_id)
  INTO v_answered
  FROM interview_responses
  WHERE assessment_id = NEW.assessment_id;

  -- Calculate and update progress
  v_progress_percent := ROUND(100.0 * v_answered / v_total_qs)::INTEGER;

  UPDATE assessments
  SET interview_progress_percent = v_progress_percent,
      last_activity_at = NOW()
  WHERE id = NEW.assessment_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_assessment_progress
  AFTER INSERT ON interview_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_assessment_progress();

-- =============================================================================
-- Trigger: Archive old assessments (data retention)
-- =============================================================================
CREATE TABLE IF NOT EXISTS assessments_archive (
  LIKE assessments INCLUDING ALL
);

CREATE OR REPLACE FUNCTION archive_old_assessments()
RETURNS void AS $$
BEGIN
  -- Archive assessments older than 2 years (keep recent data hot)
  INSERT INTO assessments_archive
  SELECT * FROM assessments
  WHERE created_at < NOW() - INTERVAL '2 years'
    AND deleted_at IS NULL
  ON CONFLICT DO NOTHING;

  -- Mark as archived
  UPDATE assessments
  SET deleted_at = NOW()
  WHERE created_at < NOW() - INTERVAL '2 years'
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Schedule via pg_cron (once per month)
-- SELECT cron.schedule('archive-old-assessments', '0 2 1 * *', 'SELECT archive_old_assessments()');
```

---

## 4. DATA VALIDATION & CONSTRAINTS

All constraints enforced at database level:

```yaml
Age:
  - Minimum: 18
  - Maximum: 120

ASRS Scores:
  - Part A & B: 0–9 each
  - Total: 0–18

Interview Responses:
  - Text: non-empty, max 5000 chars
  - Confidence: 0–1

Report Data:
  - PDF URL: valid S3/CDN URL
  - JSON schema validated before insert

Session Expiry:
  - Default: 7 days from start
  - Auto-expire abandoned assessments

Family Input Token:
  - UUID format, unique
  - Expires in 30 days
```

---

## 5. BACKUP & DISASTER RECOVERY

- **Automated daily backups** (Supabase managed)
- **Point-in-time restore** available for 7 days
- **Backup retention:** 30 days (configurable)
- **RTO:** 4 hours, **RPO:** 1 hour

---

## 6. PERFORMANCE TUNING

**Index Strategy:**
- Primary lookups: `user_id`, `assessment_id`
- Filtering: `status`, `created_at`, `deleted_at`
- Spatial: `latitude/longitude` for clinician search
- Vector: `ivfflat` for embedding similarity

**Query Optimization:**
- Denormalize frequently-accessed fields (report_data, council_scores)
- Use JSONB for flexible schema (report structure)
- Partition by month (assessments) if >10M rows

---

**END DATABASE SCHEMA**
