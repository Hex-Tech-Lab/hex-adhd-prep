# TECHNICAL ARCHITECTURE — ADHD DIAGNOSTIC SAAS
**Version:** 1.0  
**Last Updated:** 2026-05-02  
**Tech Stack:** Next.js 15 + Tailwind + shadcn + Supabase + Vercel + Upstash  
**Status:** MVP Phase 0-1 Implementation Guide

---

## 1. SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  Next.js 15 (SPA + SSR)  |  Tailwind CSS  |  shadcn/ui         │
└─────────────────────────────────────────────────────────────────┘
                               │
                    API Routes (/api/*)
                    (serverless, Vercel)
                               │
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ AI Engine    │  │ Data Service │  │ Auth Service │          │
│  │ (Claude API) │  │ (Supabase)   │  │ (Supabase)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                             │
│  Supabase PostgreSQL + pgvector (embeddings for future)         │
│  Real-time subscriptions via PostgREST                          │
│  RLS policies (per-user data isolation)                         │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                      CACHE LAYER                                │
│  Upstash Redis: Interview templates, common responses           │
│  TTL: 24 hours for query cache                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                             │
│  Anthropic Claude API  |  Stripe (future payments)              │
│  SendGrid (emails)     |  Geography API (clinician location)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FRONTEND ARCHITECTURE

### **2.1 Project Structure**

```
adhd-saas/
├── .github/
│   └── workflows/
│       ├── test.yml (Jest + coverage gates)
│       ├── lint.yml (ESLint + Prettier)
│       ├── security.yml (Snyk scan, secrets check)
│       └── deploy.yml (auto-deploy to Vercel on main merge)
│
├── public/
│   ├── og-image.png (social media card)
│   └── favicon.ico
│
├── src/
│   ├── app/ (Next.js 15 App Router)
│   │   ├── layout.tsx (root layout)
│   │   ├── page.tsx (landing)
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── assessment/
│   │   │   ├── layout.tsx (auth guard)
│   │   │   ├── page.tsx (assessment hub)
│   │   │   ├── asrs/page.tsx (screening)
│   │   │   ├── interview/page.tsx (AI interview)
│   │   │   ├── family/page.tsx (family input)
│   │   │   ├── review/page.tsx (report preview)
│   │   │   └── directory/page.tsx (clinician finder)
│   │   ├── dashboard/
│   │   │   └── page.tsx (past assessments)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts (Supabase auth)
│   │   │   ├── assessment/
│   │   │   │   ├── asrs/route.ts (save ASRS responses)
│   │   │   │   ├── interview/route.ts (save interview responses + AI probing)
│   │   │   │   ├── family/route.ts (save family input)
│   │   │   │   ├── report/route.ts (generate PDF)
│   │   │   │   └── validate/route.ts (clinician concordance check)
│   │   │   ├── interview/
│   │   │   │   ├── next-question/route.ts (adaptive Q generation)
│   │   │   │   └── follow-up/route.ts (clarification)
│   │   │   ├── claude/
│   │   │   │   ├── interview/route.ts (Claude interview agent)
│   │   │   │   ├── reasoning/route.ts (Claude reasoning agent)
│   │   │   │   └── council/route.ts (13-advisor Council v3.2)
│   │   │   └── health/route.ts (readiness probe)
│   │   └── error.tsx (error boundary)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── assessment/
│   │   │   ├── ASRSForm.tsx (18-question form)
│   │   │   ├── InterviewChat.tsx (AI conversation)
│   │   │   ├── FamilyInputForm.tsx (family module)
│   │   │   ├── ReportPreview.tsx (report viewer)
│   │   │   └── DirectorySearch.tsx (clinician finder)
│   │   ├── common/
│   │   │   ├── Button.tsx (shadcn)
│   │   │   ├── Card.tsx (shadcn)
│   │   │   ├── Input.tsx (shadcn)
│   │   │   ├── Modal.tsx (shadcn Dialog)
│   │   │   ├── ProgressBar.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── ui/ (shadcn pre-built)
│   │
│   ├── hooks/
│   │   ├── useAssessment.ts (context hook)
│   │   ├── useAuth.ts (Supabase auth)
│   │   ├── useClaudeInterview.ts (Claude API integration)
│   │   └── usePDF.ts (report generation)
│   │
│   ├── lib/
│   │   ├── api.ts (fetch wrapper + error handling)
│   │   ├── asrs.ts (ASRS scoring logic)
│   │   ├── interview.ts (question bank + branching logic)
│   │   ├── supabase.ts (Supabase client init)
│   │   ├── redis.ts (Upstash client init)
│   │   ├── claude.ts (Claude API client)
│   │   ├── pdf.ts (Puppeteer PDF generation)
│   │   └── validators.ts (schema validation)
│   │
│   ├── styles/
│   │   ├── globals.css (Tailwind + custom)
│   │   └── variables.css (design tokens)
│   │
│   └── types/
│       ├── assessment.ts (AssessmentSession, Response, Report types)
│       ├── interview.ts (InterviewQuestion, InterviewState types)
│       ├── user.ts (User, Session types)
│       └── api.ts (API response envelope types)
│
├── public/
│   ├── report-template.html (Puppeteer HTML template)
│   └── questions.json (ASRS, interview Q bank)
│
├── .env.example
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── jest.config.js (unit tests)
├── package.json
└── pnpm-lock.yaml (locked deps)
```

### **2.2 Key Components & UX Flow**

#### **Landing Page (`src/app/page.tsx`)**
```tsx
// Key sections:
// 1. Hero: "Prepare for your ADHD evaluation"
// 2. Value prop: "45-min assessment. Clinician-ready report."
// 3. Trust signals: "Not a diagnosis. Clinician confirmation required."
// 4. Pricing cards: $49 (impulse) vs $199 (premium)
// 5. CTA: "Start Assessment"
// 6. FAQ: common questions about ADHD, assessment, report use
// 7. Social proof: "Join [1K+] patients preparing for diagnosis"

// Component structure:
<Layout>
  <HeroSection />
  <ValueProposition />
  <PricingCards />
  <FAQ />
  <CTASection />
  <Footer />
</Layout>
```

#### **Assessment Flow (`src/app/assessment/*`)**
- **Page 1: Onboarding** → Email capture, consent, emergency resources
- **Page 2: ASRS screening** → 18 questions, real-time scoring, risk output
- **Page 3: AI Interview** → Adaptive chatbot, 40 min, pause/resume
- **Page 4: Family Input** → Generate unique link, collect collateral
- **Page 5: Report Review** → Preview, download, email, find clinician
- **Page 6: Directory** → Filter, book, send report

#### **Interview Chat Component (`src/components/assessment/InterviewChat.tsx`)**
```tsx
// Structure:
// 1. Message history (patient responses, AI questions)
// 2. Input area (text field + submit)
// 3. Progress bar (current question / total)
// 4. Buttons: "Back", "Pause", "Skip" (skipped flagged in report)
// 5. Loading state: "Thinking..." (Claude API call)
// 6. Memory scaffolding triggers: "Hint: Think of school..."

// Key logic:
// - Stream AI responses as they arrive (Vercel AI SDK optional, or fetch streaming)
// - Validate answer before saving (non-empty)
// - Detect vague responses → auto-trigger follow-up
// - Save to Supabase after each response (persistence)
// - Show estimated time remaining
```

---

## 3. BACKEND ARCHITECTURE

### **3.1 API Routes & Endpoints**

#### **Authentication**
```typescript
POST /api/auth/signup
  Body: { email, password, age, timezone }
  Returns: { user_id, session_token, message: "Check email for verification" }
  Error: 400 (invalid email), 409 (already registered)

POST /api/auth/login
  Body: { email, password }
  Returns: { user_id, session_token, user: { id, email, tier } }
  Error: 401 (invalid credentials)

POST /api/auth/logout
  Returns: { message: "Logged out" }

GET /api/auth/user
  Auth required: Bearer token
  Returns: { user: { id, email, tier, created_at }, assessment_ids: [...] }
```

#### **Assessment Core**
```typescript
POST /api/assessment/create
  Auth required: Bearer token
  Body: { tier: "49" | "199" }
  Returns: { assessment_id, session_id, expires_at }
  Purpose: Initialize new assessment session

POST /api/assessment/asrs
  Auth required: Bearer token
  Body: { assessment_id, responses: { item_1: 0-4, item_2: 0-4, ... } }
  Returns: { 
    asrs_score: { part_a: 0-9, part_b: 0-9, risk_level: "Low|Moderate|High" },
    next_step: "interview"
  }
  Validation: All 18 responses required

POST /api/assessment/interview/next-question
  Auth required: Bearer token
  Body: { assessment_id, section: "childhood|adulthood|functional", current_question_index: number }
  Returns: { 
    question_id: string,
    question_text: string,
    context: string,
    allow_skip: boolean
  }
  Purpose: Fetch next interview question (adaptive)

POST /api/assessment/interview/save-response
  Auth required: Bearer token
  Body: { 
    assessment_id,
    question_id,
    response: string,
    follow_up_trigger: boolean // if true, request AI follow-up
  }
  Returns: { 
    response_id,
    follow_up?: { ai_question: string, context: string }
  }
  Purpose: Save answer + optionally trigger AI follow-up

POST /api/assessment/interview/follow-up
  Auth required: Bearer token
  Body: { assessment_id, last_response: string, follow_up_context: string }
  Returns: { ai_follow_up_question: string }
  Purpose: Generate clarifying question via Claude (see 3.2 below)

POST /api/assessment/family/invite
  Auth required: Bearer token
  Body: { assessment_id, family_member_name: string, family_member_email: string }
  Returns: { 
    family_token: string,
    family_link: "https://adhdsaas.com/family?token=[token]"
  }
  Purpose: Generate unique link for family member

POST /api/assessment/family/submit
  Auth required: Family token (different auth path)
  Body: { assessment_id, relationship: string, responses: { ...family questions } }
  Returns: { success: true, family_data_id: string }

POST /api/assessment/report/generate
  Auth required: Bearer token
  Body: { assessment_id }
  Returns: { 
    report_id,
    pdf_url: "https://storage.adhdsaas.com/reports/[id].pdf",
    status: "generating|ready|failed"
  }
  Purpose: Trigger PDF generation (async, Puppeteer)

GET /api/assessment/report/[report_id]
  Auth required: Bearer token
  Returns: PDF binary (with Content-Disposition: attachment)

POST /api/assessment/council/review (Tier 2 only)
  Auth required: Bearer token
  Body: { assessment_id }
  Returns: { 
    council_job_id,
    status: "queued|processing|complete",
    eta_seconds: 300
  }
  Purpose: Queue Council v3.2 review (async background job)

GET /api/assessment/council/results/[council_job_id]
  Auth required: Bearer token
  Returns: {
    confidence_scores: { inattention: 0.87, hyperactivity: 0.42, ... },
    comorbidity_flags: [ { flag: "anxiety_pattern", confidence: 0.65 }, ... ],
    advisor_summary: "3/13 advisors flagged anxiety..."
  }
  Purpose: Poll for Council review results

POST /api/assessment/directory/search
  Auth: None (public)
  Body: { country: "US", state: "NY", modality: "telehealth|in_person", specialty: "ADHD" }
  Returns: {
    clinicians: [
      { id, name, specialty, distance_miles, telehealth, rating, booking_url },
      ...
    ]
  }
  Purpose: Search clinician directory (seed data)

POST /api/assessment/directory/refer
  Auth required: Bearer token
  Body: { assessment_id, clinician_id, referral_mode: "direct_link|email" }
  Returns: { referral_id, referral_link: "https://..." }
  Purpose: Generate referral (secure link or email)
```

### **3.2 Claude Integration (AI Engine)**

#### **Interview Agent (`src/lib/claude.ts`)**
```typescript
// Purpose: Adaptive interview question generation + follow-up probing

async function generateInterviewQuestion(
  section: "childhood" | "adulthood" | "functional",
  previousResponses: { question_id: string; answer: string }[],
  questionIndex: number,
  context: { age: number; gender?: string }
): Promise<{ question: string; shouldProbe: boolean }> {
  
  const systemPrompt = `
    You are an empathic interviewer trained in DIVA-style adult ADHD assessment.
    
    Your role:
    - Ask clear, specific questions about ADHD symptoms
    - Accept answers and probe for concrete examples
    - Detect vague answers and ask clarifying questions
    - Compare childhood vs adult symptoms for consistency
    - Assess functional impairment across domains
    
    Rules:
    - Never diagnose or label
    - Always defer to clinician
    - Ask one question at a time
    - If answer is vague (e.g., "kind of", "sometimes"), ask for an example
    - Be warm and non-judgmental
  `;
  
  const userPrompt = `
    Patient age: ${context.age}
    Current section: ${section}
    Question index: ${questionIndex}/9
    
    Previous answers:
    ${previousResponses.map(r => `Q: ${r.question_id}\nA: ${r.answer}`).join("\n")}
    
    Generate the next interview question for section "${section}".
    Question index ${questionIndex} of 9 inattention/hyperactivity symptoms.
    
    If previous answer was vague, generate a follow-up probe first.
    Otherwise, generate the next symptom question.
    
    Format:
    {
      "question": "...",
      "context": "...", // memory cue or clarification hint
      "shouldProbe": boolean
    }
  `;
  
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 300,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });
  
  // Parse + return
}

async function generateFollowUp(
  lastAnswer: string,
  questionContext: string,
  symptomDomain: "inattention" | "hyperactivity"
): Promise<{ follow_up_question: string; follow_up_context: string }> {
  
  const systemPrompt = `
    You are an expert diagnostic interviewer.
    The patient gave a vague answer. Generate ONE clarifying follow-up question.
    
    Examples of good follow-ups:
    - "Can you give me a specific example from [work/home/school]?"
    - "How often does this happen — daily, weekly, or less often?"
    - "What's the impact on you? Does it cause problems?"
    
    Be warm, specific, and concrete.
  `;
  
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 150,
    messages: [{
      role: "user",
      content: `Last answer: "${lastAnswer}"\nContext: ${questionContext}\nGenerate follow-up.`
    }],
    system: systemPrompt,
  });
  
  // Return parsed follow-up
}
```

#### **Reasoning Agent (Report Generation)**
```typescript
// Purpose: Analyze all responses, flag inconsistencies, generate clinician-ready summary

async function generateReportSummary(
  assessmentId: string,
  asrsScores: { partA: number; partB: number },
  interviewResponses: Response[],
  familyInput?: FamilyResponse[]
): Promise<ReportData> {
  
  const systemPrompt = `
    You are a clinical data analyst specializing in ADHD assessments.
    
    Your task:
    1. Analyze interview responses against DSM-5 A1 (inattention) and A2 (hyperactivity) criteria
    2. Extract functional impairment examples from free-form responses
    3. Flag inconsistencies (e.g., "perfect childhood, now chaotic" → suggests acquired condition)
    4. Integrate family informant perspective (agreement/disagreement)
    5. Identify areas for clinician follow-up (comorbidities, missing data)
    
    Output: Structured clinical summary for report.
  `;
  
  const interviewSummary = interviewResponses
    .map(r => `Q${r.question_id}: ${r.question_text}\nA: ${r.response}`)
    .join("\n\n");
  
  const familySummary = familyInput
    ? `Family member (${familyInput.relationship}): ${familyInput.summary}`
    : "No family input";
  
  const userPrompt = `
    ASRS Screening:
    Part A: ${asrsScores.partA}/9 | Part B: ${asrsScores.partB}/9
    
    Interview responses:
    ${interviewSummary}
    
    Family informant:
    ${familySummary}
    
    Analyze and produce:
    {
      "symptom_grid": {
        "a1_inattention": [
          { "symptom": "...", "childhood_present": true/false, "childhood_example": "...", "adult_present": true/false, "adult_example": "..." },
          ...
        ]
      },
      "functional_impairment": {
        "work": { "severity": "none|mild|moderate|severe", "examples": [...] },
        "home": { ... },
        ...
      },
      "inconsistencies": [ "...", ... ],
      "areas_for_clinician": [ "sleep patterns not assessed", "anxiety signals present" ],
      "summary": "..."
    }
  `;
  
  const response = await anthropic.messages.create({
    model: "claude-3-5-opus-20250514", // Higher-grade for reasoning
    max_tokens: 2000,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });
  
  return parseReportData(response.content[0].text);
}
```

#### **Council v3.2 Agent (Tier 2)**
```typescript
// Purpose: 13 advisors independently validate + cross-check findings + confidence scoring

async function runCouncilReview(
  assessmentId: string,
  reportData: ReportData
): Promise<CouncilResult> {
  
  // See COUNCIL-ARCHITECTURE.md for full spec
  // Summary: spawn 13 parallel Claude calls (each advisor), aggregate, compute confidence scores
  
  const advisors = [
    "The Skeptic",
    "The Clinician (Psychiatry)",
    "The Clinician (Neurology)",
    "The Neuropsychologist",
    "The Comorbidity Expert",
    "The Statistician",
    // ... 7 more
  ];
  
  const councilPrompt = (advisor: string) => `
    You are "${advisor}" on a clinical council reviewing an ADHD pre-assessment.
    
    Assessment data:
    ${JSON.stringify(reportData, null, 2)}
    
    Provide your independent analysis:
    - Is the symptom pattern consistent with ADHD?
    - What blind spots or concerns do you have?
    - What confidence level would you assign (0-100)?
    - What areas need clinician clarification?
  `;
  
  // Run all 13 in parallel
  const advisorResponses = await Promise.all(
    advisors.map(advisor =>
      anthropic.messages.create({
        model: "claude-3-5-opus-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: councilPrompt(advisor) }],
      })
    )
  );
  
  // Aggregate: compute mean confidence, flag disagreements, synthesize
  return aggregateCouncilResponses(advisorResponses);
}
```

---

## 4. DATABASE SCHEMA

### **4.1 Core Tables (Supabase PostgreSQL)**

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  tier TEXT DEFAULT '49', -- '49' or '199'
  age INTEGER,
  timezone TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Authentication & RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Assessment Sessions
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- '49' or '199'
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  expires_at TIMESTAMP, -- 7 days from start
  
  -- ASRS screening data
  asrs_part_a INTEGER, -- 0-9
  asrs_part_b INTEGER, -- 0-9
  asrs_risk_level TEXT, -- 'Low', 'Moderate', 'High'
  
  -- Interview progress
  interview_started_at TIMESTAMP,
  interview_completed_at TIMESTAMP,
  interview_section TEXT, -- 'childhood', 'adulthood', 'functional', 'complete'
  interview_progress INTEGER, -- 0-100%
  
  -- Family input
  family_input_requested_at TIMESTAMP,
  family_input_completed_at TIMESTAMP,
  
  -- Report
  report_generated_at TIMESTAMP,
  report_pdf_url TEXT,
  
  -- Council review (Tier 2)
  council_job_id TEXT, -- reference to async job queue
  council_completed_at TIMESTAMP,
  council_confidence_scores JSONB, -- { "inattention": 0.87, ... }
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own assessments"
  ON assessments FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Interview Responses
CREATE TABLE interview_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL, -- e.g., 'a1_inattention_1', 'functional_work'
  question_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  response_data JSONB, -- { "presence": true, "frequency": "daily", "examples": [...] }
  ai_flagged BOOLEAN DEFAULT FALSE, -- true if AI detected vagueness
  follow_up_question TEXT,
  follow_up_response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interview_responses_assessment_id ON interview_responses(assessment_id);
CREATE INDEX idx_interview_responses_question_id ON interview_responses(question_id);

ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own responses"
  ON interview_responses FOR SELECT
  USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

-- Family Input
CREATE TABLE family_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  family_token TEXT UNIQUE NOT NULL, -- secure invite link token
  relationship TEXT NOT NULL, -- 'spouse', 'parent', 'sibling'
  family_member_name TEXT,
  family_member_email TEXT,
  
  -- Responses (similar structure to interview_responses)
  responses JSONB, -- { question_id: answer, ... }
  
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_family_inputs_assessment_id ON family_inputs(assessment_id);
CREATE INDEX idx_family_inputs_family_token ON family_inputs(family_token);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  report_type TEXT NOT NULL, -- 'basic' (tier1) or 'premium' (tier2)
  report_data JSONB NOT NULL, -- structured report content
  
  pdf_url TEXT,
  pdf_generated_at TIMESTAMP,
  
  clinician_notes TEXT, -- AI-generated notes for clinician
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reports_assessment_id ON reports(assessment_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own reports"
  ON reports FOR SELECT
  USING (user_id = auth.uid());

-- Clinician Directory (seed data)
CREATE TABLE clinicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  specialty TEXT, -- 'psychiatry', 'psychology', 'nurse_practitioner'
  license_state TEXT, -- 'NY', 'CA', etc.
  telehealth BOOLEAN DEFAULT TRUE,
  in_person BOOLEAN DEFAULT TRUE,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  booking_url TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  latitude FLOAT,
  longitude FLOAT,
  
  -- Review data
  rating FLOAT, -- 1.0-5.0 from external sources
  review_count INTEGER,
  
  -- ADHD focus
  adhd_focus BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clinicians_state ON clinicians(state);
CREATE INDEX idx_clinicians_adhd_focus ON clinicians(adhd_focus);
CREATE INDEX idx_clinicians_location ON clinicians USING gist(ll_to_earth(latitude, longitude));

-- Referrals (audit trail)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  clinician_id UUID NOT NULL REFERENCES clinicians(id),
  
  referral_type TEXT, -- 'direct_link', 'email'
  secure_link_token TEXT UNIQUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  accessed_at TIMESTAMP
);

CREATE INDEX idx_referrals_assessment_id ON referrals(assessment_id);
CREATE INDEX idx_referrals_secure_link_token ON referrals(secure_link_token);

-- Audit Log (compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'login', 'assessment_start', 'report_generate', etc.
  resource_type TEXT, -- 'assessment', 'report', 'user'
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

### **4.2 pgvector Extension (Future Data Product)**

```sql
-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Embeddings table (stores pre-computed embeddings for future use)
CREATE TABLE response_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  response_id UUID NOT NULL REFERENCES interview_responses(id) ON DELETE CASCADE,
  
  embedding vector(1536), -- Claude embeddings (openai-compatible)
  embedding_model TEXT DEFAULT 'text-embedding-3-small',
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_response_embeddings_assessment_id ON response_embeddings(assessment_id);
CREATE INDEX idx_response_embeddings_vector ON response_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Future: Use for cohort similarity, pattern discovery, anonymized research
```

---

## 5. API RATE LIMITING & CACHING

### **5.1 Rate Limiting (Vercel + Upstash Redis)**

```typescript
// middleware.ts
import { rateLimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = new rateLimit({
  redis,
  limiter: rateLimit.slidingWindow(
    10, // 10 requests
    "1 m" // per 1 minute
  ),
});

export async function middleware(request: NextRequest) {
  const id = `api_${request.headers.get("x-forwarded-for") || "anonymous"}`;
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(id);

  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }

  // Continue to API route
  return NextResponse.next();
}
```

### **5.2 Query Caching (Redis)**

```typescript
// lib/cache.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getCachedQuestion(
  section: string,
  index: number
): Promise<string | null> {
  const key = `question:${section}:${index}`;
  return redis.get(key);
}

export async function cacheQuestion(
  section: string,
  index: number,
  question: string
) {
  const key = `question:${section}:${index}`;
  await redis.setex(key, 86400, question); // 24 hours TTL
}
```

---

## 6. DEPLOYMENT & CI/CD PIPELINE

### **6.1 GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Test, Lint, Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run test -- --coverage
      - run: pnpm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      - name: Secrets check
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}

  coderabbit:
    runs-on: ubuntu-latest
    steps:
      - name: CodeRabbit Review
        uses: coderabbithq/action@v1
        with:
          token: ${{ secrets.CODERABBIT_TOKEN }}

  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### **6.2 Vercel Environment Variables**

```
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
SUPABASE_SERVICE_ROLE_KEY=[key]

ANTHROPIC_API_KEY=[key]

UPSTASH_REDIS_REST_URL=https://[project].upstash.io
UPSTASH_REDIS_REST_TOKEN=[token]

STRIPE_SECRET_KEY=[key] (future)
SENDGRID_API_KEY=[key] (future)

NEXT_PUBLIC_APP_URL=https://adhdsaas.com
```

---

## 7. PERFORMANCE & MONITORING

### **7.1 Web Vitals (Vercel Analytics)**

Target metrics:
- **FCP (First Contentful Paint):** <2 sec
- **LCP (Largest Contentful Paint):** <3 sec
- **CLS (Cumulative Layout Shift):** <0.1
- **FID (First Input Delay):** <100ms (deprecated, replaced by INP)
- **INP (Interaction to Next Paint):** <200ms

### **7.2 API Monitoring (Vercel + Sentry)**

```typescript
// Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.OnUncaughtException(),
  ],
  tracesSampleRate: 0.1,
});

// Automatic error tracking on API routes
```

---

## 8. SECURITY

### **8.1 Auth & Session**

- Supabase Auth (JWT-based, with refresh tokens)
- HTTPS only (Vercel TLS)
- Secure cookies (HttpOnly, SameSite=Lax)
- CSRF protection (SameSite + token validation)

### **8.2 Data Encryption**

- Supabase: TDE (Transparent Data Encryption) at rest
- API requests: HTTPS (TLS 1.3+)
- Sensitive fields: AES-256 GCM in application code (future for PII)

### **8.3 Secrets Management**

- Vercel Environment Variables (encrypted, not logged)
- No secrets in code or .env files (use .env.example)
- Rotate keys every 90 days (Snyk compliance)

---

## 9. LOCAL DEVELOPMENT SETUP

### **9.1 Prerequisites**

```bash
# Node 20+
node --version  # v20.x.x

# pnpm (locked)
npm install -g pnpm@9
pnpm --version

# Supabase CLI (for local DB)
brew install supabase/tap/supabase

# Docker (for local Supabase)
docker --version
```

### **9.2 Quick Start**

```bash
# Clone repo
git clone https://github.com/your-org/adhd-saas.git
cd adhd-saas

# Install deps
pnpm install

# Supabase setup
supabase init
supabase start

# Copy env
cp .env.example .env.local

# Edit .env.local with Supabase local credentials
# (printed by `supabase start`)

# Run dev server
pnpm dev

# Open http://localhost:3000
```

### **9.3 Testing**

```bash
# Unit tests
pnpm test

# Test coverage
pnpm test -- --coverage

# E2E tests (Playwright, future)
pnpm test:e2e

# Lint + format
pnpm lint
pnpm format

# Type check
pnpm typecheck
```

---

## 10. SCALABILITY & FUTURE

### **10.1 Horizontal Scaling**

- **Frontend:** Vercel auto-scales (CDN + serverless)
- **Backend:** Supabase auto-scales (managed PostgreSQL with read replicas)
- **Cache:** Upstash Redis auto-scales
- **AI:** Anthropic API has rate limits (start low, scale up with request)

### **10.2 Data Product Vision**

Once 50K+ anonymized assessments exist:
- Cohort analysis: "What % of women report different hyperactivity patterns?"
- Diagnostic patterns: "What combinations predict fastest clinician confirmation?"
- Research partnerships: "Can we license anonymized data to academic institutions?"
- Technical: pgvector embeddings for pattern discovery

---

**END TECHNICAL ARCHITECTURE**
