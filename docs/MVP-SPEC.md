# ADHD-PREP COMPLETE MVP SPECIFICATION

## **MODULES (What Must Exist)**

### 1. HOME PAGE
- Welcome screen
- "Start Assessment" button
- Navigation links

### 2. ASSESSMENT FLOW
- **ASRS Module** (6 questions) ✅ EXISTS
- **Family Input Module** (family history) ✅ EXISTS  
- **Childhood History** (symptoms timeline)
- **Work/School Impact** (functional assessment)
- **Comorbidity Screen** (anxiety, depression, bipolar)

### 3. RESULTS & REPORTING
- **Score Calculation** (aggregate all modules)
- **Risk Stratification** (low/moderate/high)
- **Clinical Summary** (PDF-ready report)
- **Recommendations** (next steps for user)

### 4. DASHBOARD
- Assessment history
- Previous scores
- Download reports

---

## **DATABASE SCHEMA (What Gets Stored)**

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMP
);

-- Assessments (one per session)
CREATE TABLE assessments (
  id UUID PRIMARY KEY,
  user_id UUID,
  created_at TIMESTAMP,
  completed_at TIMESTAMP,
  status TEXT ('in_progress', 'completed')
);

-- ASRS Responses
CREATE TABLE asrs_responses (
  id UUID PRIMARY KEY,
  assessment_id UUID,
  question_id TEXT,
  response_value INT (0-4)
);

-- Family History
CREATE TABLE family_history (
  id UUID PRIMARY KEY,
  assessment_id UUID,
  parent_adhd BOOLEAN,
  sibling_adhd BOOLEAN,
  childhood_onset BOOLEAN
);

-- Scores
CREATE TABLE scores (
  id UUID PRIMARY KEY,
  assessment_id UUID,
  asrs_score FLOAT,
  risk_level TEXT ('low', 'moderate', 'high'),
  created_at TIMESTAMP
);
```

---

## **API ENDPOINTS (What Must Respond)**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/assessment/start` | Create new assessment |
| POST | `/api/assessment/asrs` | Save ASRS responses |
| POST | `/api/assessment/family` | Save family history |
| POST | `/api/assessment/complete` | Finalize and score |
| GET | `/api/assessment/:id` | Get assessment data |
| GET | `/api/assessment/:id/report` | Download PDF report |
| GET | `/api/assessments` | List user's assessments |

---

## **PAGES (UI Routes)**

| Route | Status | Purpose |
|-------|--------|---------|
| `/` | BUILD | Home/landing |
| `/auth/login` | BUILD | User authentication |
| `/assessment/start` | BUILD | Create new assessment |
| `/assessment/asrs` | ✅ EXISTS | ASRS questionnaire |
| `/assessment/family` | ✅ EXISTS | Family history |
| `/assessment/history` | BUILD | Childhood symptoms |
| `/assessment/impact` | BUILD | Work/school impact |
| `/assessment/comorbidity` | BUILD | Mental health screen |
| `/assessment/review` | ✅ EXISTS | Summary before submit |
| `/assessment/results` | ✅ EXISTS | Final score/risk |
| `/dashboard` | BUILD | User portal |
| `/dashboard/history` | BUILD | Past assessments |
| `/dashboard/reports/:id` | BUILD | View/download report |

---

## **WHAT'S MISSING FOR FULL MVP**

❌ Authentication (Firebase/Supabase Auth)
❌ Database integration (all data currently in-memory)
❌ Additional assessment modules (history, impact, comorbidity)
❌ Report generation (PDF output)
❌ Dashboard & history
❌ Persistent storage

---

## **TONIGHT'S BUILD ORDER**

1. **FIX SERVER** - Get localhost:3000 stable ✅ IN PROGRESS
2. **ADD AUTH** - Login/register flow
3. **WIRE DATABASE** - Connect Supabase
4. **ADD HISTORY MODULE** - Childhood symptoms form
5. **ADD IMPACT MODULE** - Work/school assessment
6. **ADD COMORBIDITY MODULE** - Anxiety/depression screen
7. **BUILD REPORTS** - PDF generation
8. **BUILD DASHBOARD** - History and downloads
9. **STYLING** - Polish UI
10. **DEPLOYMENT** - Push live

---

**STATUS: Building out now. You'll see a working app by morning.**
