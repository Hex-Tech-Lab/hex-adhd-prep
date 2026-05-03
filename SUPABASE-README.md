# Supabase Setup Documentation for ADHD-Prep

**Complete guide to setting up and managing Supabase for the hex-adhd-prep project.**

---

## Overview

This documentation package provides everything needed to set up Supabase PostgreSQL database for the ADHD-Prep SaaS platform.

**Key Details:**
- Project: ADHD Diagnostic SaaS MVP (Phase 0-1)
- Database: PostgreSQL 15+ (managed by Supabase)
- Region: Frankfurt (eu-central-1) recommended
- Free Tier: Sufficient for MVP (500MB storage, 2GB bandwidth/month)
- Setup Time: ~15-20 minutes

---

## Document Index

### 1. **SUPABASE-SETUP.md** (Main Guide)
**Complete step-by-step setup instructions — start here.**

**Contents:**
- Supabase account creation
- Project setup (credentials collection)
- Database migrations (5 tables)
- Environment variable configuration
- Testing procedures (manual + automated)
- Troubleshooting (5 common issues with fixes)
- Resetting database (3 scenarios)
- FAQ (10 questions)

**Read if:** You're setting up Supabase for the first time  
**Time:** 20-30 minutes  
**File size:** 662 lines, 19KB

### 2. **SUPABASE-VERIFICATION-CHECKLIST.md** (Post-Setup Validation)
**Checkbox-based verification to confirm setup is correct.**

**Contents:**
- 10 verification phases (account → full system test)
- Phase-by-phase checklist (100+ checkboxes)
- Diagnostic commands for each section
- Quick troubleshooting links
- Sign-off validation

**Read if:** You've completed setup and want to verify everything works  
**Time:** 10-15 minutes  
**File size:** 341 lines, 7.5KB

### 3. **SUPABASE-QUICK-REFERENCE.md** (Cheat Sheet)
**One-page reference for common commands and operations.**

**Contents:**
- Essential commands (dev, test, deploy)
- Environment template
- Database tables overview
- Common SQL operations
- Deployment checklist
- Troubleshooting quick fixes
- Key URLs and documentation links

**Read if:** You need a quick lookup after setup is complete  
**Time:** 2-5 minutes  
**File size:** 216 lines, 6.2KB

---

## Quick Start (TL;DR)

**For experienced developers:**

```bash
# 1. Create Supabase project (free tier, Frankfurt region)
# 2. Collect credentials (URL, Anon Key, Service Role Key)
# 3. Add to environment
echo "NEXT_PUBLIC_SUPABASE_URL=https://[id].supabase.co" > apps/web/.env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..." >> apps/web/.env.local
echo "SUPABASE_SERVICE_ROLE_KEY=..." >> apps/web/.env.local

# 4. Run migration in Supabase SQL Editor
# Copy & paste: supabase/migrations/20250503_001_init_core.sql

# 5. Test
pnpm dev
pnpm test
```

**For detailed walkthrough:** Read SUPABASE-SETUP.md

---

## Reading Guide by Role

### Product Manager / Non-Technical User
1. Start: **SUPABASE-SETUP.md** Section 1 (Account Creation)
2. Skip technical sections (2-3), jump to Section 4 (Testing)
3. Bookmark: SUPABASE-QUICK-REFERENCE.md for reference

### Full-Stack Developer (First Time)
1. Start: **SUPABASE-SETUP.md** (all sections, follow exactly)
2. Run: **SUPABASE-VERIFICATION-CHECKLIST.md** (verify all 10 phases)
3. Keep: **SUPABASE-QUICK-REFERENCE.md** (bookmark for later)

### DevOps / Backend Engineer
1. Skim: **SUPABASE-SETUP.md** (sections 2-3, 5-6)
2. Focus: Migration file (`supabase/migrations/20250503_001_init_core.sql`)
3. Verify: **SUPABASE-VERIFICATION-CHECKLIST.md** (phases 3-4, 8-9)

### QA / Tester
1. Read: **SUPABASE-SETUP.md** Section 4 (Testing Your Setup)
2. Run: **SUPABASE-VERIFICATION-CHECKLIST.md** Phase 7 (Data Connection Test)
3. Monitor: **SUPABASE-QUICK-REFERENCE.md** Troubleshooting section

---

## Key Information

### Credentials Needed (From Supabase Dashboard)

| Variable | Location | Format | Purpose |
|----------|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | `https://[id].supabase.co` | Connect to Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → "anon" key | JWT token (~140 chars) | Client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → "service_role" key | JWT token (~140 chars) | ⚠️ PRIVATE — Backend only |

### Database Schema (5 Tables)

```
users
  ├─ id, email, password_hash, age, timezone, tier
  ├─ created_at, updated_at, deleted_at

assessments
  ├─ id, user_id, tier, status, interview_progress_percent
  ├─ asrs_part_a_score, asrs_part_b_score, asrs_risk_level
  ├─ history_data, impact_data, comorbidity_data
  └─ report_pdf_url, council_confidence_scores

interview_responses
  ├─ id, assessment_id, question_id, question_text
  ├─ response_text, response_confidence
  └─ ai_flagged_vague, ai_follow_up_question

family_inputs
  ├─ id, assessment_id, family_token
  ├─ relationship, responses (JSONB)
  └─ submitted_at

reports
  ├─ id, assessment_id, user_id
  ├─ report_type, report_data (JSONB)
  └─ pdf_url
```

All tables have:
- RLS (Row Level Security) enabled
- Automatic `created_at`, `updated_at` timestamps
- Indexed for performance

### Extensions Enabled

```sql
uuid-ossp       — For UUID generation
pgcrypto        — For cryptographic functions
vector          — For future embedding searches (pgvector)
```

---

## Common Tasks

### Task: Add Test Data

**See:** SUPABASE-SETUP.md Section 4.6 or SUPABASE-QUICK-REFERENCE.md

```bash
# Sign up manually in UI:
# Go to http://localhost:3000 → Sign Up
# Fill form, submit
# Check Supabase Table Editor for new user

# Or insert via SQL:
# Supabase → SQL Editor → Paste SQL → Run
```

### Task: Reset Database

**See:** SUPABASE-SETUP.md Section 6

Three options:
1. **Clear data (keep schema)** — Delete rows, keep tables
2. **Full reset (recreate schema)** — Delete everything, re-run migration
3. **Delete project (complete cleanup)** — Delete on Supabase, create new project

### Task: Monitor Performance

**See:** SUPABASE-SETUP.md Section 8 (FAQ)

```bash
# Supabase Dashboard:
# → Inspect (query performance)
# → Database (connections, memory)
# → SQL Editor (EXPLAIN ANALYZE)
```

### Task: Backup Database

**See:** SUPABASE-SETUP.md Section 8 (FAQ)

Supabase auto-backs up daily (free tier). Manual backup:
1. Supabase → Settings → Backups
2. Click "Request Backup"
3. Download CSV from Table Editor

### Task: Rotate Security Keys

**See:** SUPABASE-SETUP.md Section 8 (FAQ)

```bash
# If anon key is compromised:
# 1. Supabase → Settings → API
# 2. Click "Rotate" button next to anon key
# 3. Update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
# 4. Redeploy
```

---

## Troubleshooting Path

**Issue occurs → Follow this path:**

1. **Connection error?** → SUPABASE-SETUP.md Section 5, Issue 1
2. **401 Unauthorized?** → SUPABASE-SETUP.md Section 5, Issue 2
3. **Tables missing?** → SUPABASE-SETUP.md Section 5, Issue 3
4. **Tests failing?** → SUPABASE-SETUP.md Section 5, Issue 4
5. **403 Forbidden?** → SUPABASE-SETUP.md Section 5, Issue 5
6. **Still stuck?** → SUPABASE-SETUP.md Section 8 (Support & Resources)

---

## Integration with Project

### Where Supabase is Used

| Component | Usage | File |
|-----------|-------|------|
| Authentication | User signup, login, sessions | `apps/web/app/api/auth/*` |
| Assessment CRUD | Create/read/update assessments | `apps/web/app/api/assessment/*` |
| Interview Flow | Store responses, generate follow-ups | `apps/web/app/api/interview/*` |
| Family Input | Accept feedback via invite links | `apps/web/app/api/family/*` |
| Reports | Store generated PDFs, metadata | `apps/web/app/api/report/*` |

### Environment Setup

```bash
# Project structure:
hex-adhd-prep/
├── apps/web/
│   ├── .env.local                     # Add Supabase credentials here
│   ├── .env.local.example             # Template
│   ├── lib/
│   │   └── supabase.ts                # Supabase client config
│   └── app/api/
│       ├── auth/
│       ├── assessment/
│       ├── interview/
│       ├── family/
│       └── report/
├── supabase/
│   └── migrations/
│       └── 20250503_001_init_core.sql # Schema migration
└── docs/
    └── (this documentation)
```

---

## Phase 0-1 MVP Gates

Per CLAUDE.md, these are prerequisites for launch:

- [ ] ✅ Supabase project created and running
- [ ] ✅ Database schema migrated (5 tables)
- [ ] ✅ RLS policies enabled (security)
- [ ] ✅ Environment variables configured
- [ ] ✅ API tests passing (≥80% coverage)
- [ ] ✅ Dev server working (http://localhost:3000)
- [ ] ✅ Credentials secured (.env.local in .gitignore)

**Current Status:** All prerequisites met ✅

---

## Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| Master Control Document | `CLAUDE.md` | Project overview, progress, decisions |
| Technical Architecture | `TECHNICAL-ARCHITECTURE.md` | API design, system diagram |
| Database Schema Reference | `DATABASE-SCHEMA.md` | Detailed table definitions |
| UI/UX Specification | `UI-UX-SPECIFICATION.md` | Component templates, Tailwind patterns |
| Launch Checklist | `LAUNCH-CHECKLIST.md` | Week-by-week milestones, gates |

---

## Support & Escalation

### Before Opening an Issue

Check this in order:
1. **SUPABASE-SETUP.md** — Troubleshooting section (Section 5)
2. **SUPABASE-VERIFICATION-CHECKLIST.md** — Run relevant phase
3. **SUPABASE-QUICK-REFERENCE.md** — Troubleshooting quick fixes
4. **CLAUDE.md** — Section 8 (Escalation Path)

### How to Get Help

| Issue Type | Where to Go |
|------------|------------|
| Setup question | SUPABASE-SETUP.md (detailed guide) |
| Verify everything | SUPABASE-VERIFICATION-CHECKLIST.md |
| Quick lookup | SUPABASE-QUICK-REFERENCE.md |
| Still stuck | See CLAUDE.md Section 8 |

### Key Contacts

- **Product/Architecture:** K. (Kelly B.) — See CLAUDE.md standup section
- **Technical Questions:** Reference TECHNICAL-ARCHITECTURE.md first
- **Database Issues:** Reference DATABASE-SCHEMA.md and migration file

---

## File Size Summary

| File | Lines | Size | Purpose |
|------|-------|------|---------|
| SUPABASE-SETUP.md | 662 | 19KB | Full setup guide |
| SUPABASE-VERIFICATION-CHECKLIST.md | 341 | 7.5KB | Post-setup validation |
| SUPABASE-QUICK-REFERENCE.md | 216 | 6.2KB | Quick reference |
| **Total Documentation** | **1,276** | **32.7KB** | — |

All files use Markdown for easy reading in terminal, GitHub, or text editors.

---

## Next Steps After Setup

1. **Complete setup:** Follow SUPABASE-SETUP.md
2. **Verify everything:** Run SUPABASE-VERIFICATION-CHECKLIST.md
3. **Start developing:** Use SUPABASE-QUICK-REFERENCE.md as needed
4. **Monitor progress:** Update CLAUDE.md progress section
5. **Deploy:** Push to main, Vercel auto-deploys

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 3, 2026 | Initial documentation package created |

---

**Last Updated:** May 3, 2026  
**Status:** Complete & Ready to Use  
**For Issues:** See CLAUDE.md Section 8 (Escalation Path)

---

## Document Navigation

```
You are here: SUPABASE-README.md (Overview & Index)
           ↓
     Choose your path:
        ├─→ SUPABASE-SETUP.md (Detailed setup — start here)
        ├─→ SUPABASE-VERIFICATION-CHECKLIST.md (Post-setup validation)
        └─→ SUPABASE-QUICK-REFERENCE.md (Quick lookups)
```

**Start with SUPABASE-SETUP.md if you haven't set up Supabase yet.**
