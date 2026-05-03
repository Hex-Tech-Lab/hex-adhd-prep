# Supabase Production Setup Guide

## Status
✅ Supabase credentials added to Vercel  
❌ Database schema not yet created (BLOCKING)

## Required Steps to Enable Data Persistence

### Step 1: Create Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(10) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  asrs_part_a_score INTEGER,
  asrs_part_b_score INTEGER,
  asrs_risk_level VARCHAR(50),
  interview_progress_percent INTEGER DEFAULT 0,
  current_section VARCHAR(100),
  report_pdf_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview responses table
CREATE TABLE interview_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  response_text TEXT,
  response_data JSONB,
  ai_flagged_vague BOOLEAN DEFAULT FALSE,
  ai_follow_up_question VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family inputs table
CREATE TABLE family_inputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  family_token VARCHAR(255) UNIQUE,
  relationship VARCHAR(100),
  responses JSONB,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_inputs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only read/write their own data
CREATE POLICY "Users can read own data" 
  ON users FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" 
  ON users FOR UPDATE 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read own assessments" 
  ON assessments FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create assessments" 
  ON assessments FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own assessments" 
  ON assessments FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own responses" 
  ON interview_responses FOR SELECT 
  USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Users can create responses" 
  ON interview_responses FOR INSERT 
  WITH CHECK (
    assessment_id IN (
      SELECT id FROM assessments WHERE user_id = auth.uid()::uuid
    )
  );

-- Family can submit via token
CREATE POLICY "Family can submit via token" 
  ON family_inputs FOR INSERT 
  WITH CHECK (family_token IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_interview_responses_assessment_id ON interview_responses(assessment_id);
CREATE INDEX idx_family_inputs_assessment_id ON family_inputs(assessment_id);
```

### Step 2: Verify Setup

1. Go to **https://app.supabase.com**
2. Open your project: **iabqnzdcwgimssfcfgqz**
3. Go to **SQL Editor**
4. Paste the SQL above
5. Click **Run**

### Step 3: Test Data Persistence

After running SQL, test signup:

```bash
curl -X POST https://hex-adhd-prep.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","age":30}' | jq .
```

Expected response (NOT demo mode):
```json
{
  "success": true,
  "user": { "id": "...", "email": "test@example.com", "age": 30 },
  "assessment": { "id": "...", "tier": "49" },
  "sessionToken": "..."
}
```

### Step 4: Verify in Supabase

1. Go to **Table Editor**
2. Check **users** table - should have your test user
3. Check **assessments** table - should have created assessment

## Environment Variables Already Set on Vercel

✅ NEXT_PUBLIC_SUPABASE_URL  
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
✅ SUPABASE_SERVICE_ROLE_KEY  

Once database schema is created, data persistence will work automatically.

## Rollback (if needed)

To delete all tables:
```sql
DROP TABLE IF EXISTS family_inputs CASCADE;
DROP TABLE IF EXISTS interview_responses CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```
