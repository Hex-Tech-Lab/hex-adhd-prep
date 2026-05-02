# LAUNCH CHECKLIST — PHASE 0-1 (4 WEEKS)
**Version:** 1.0  
**Status:** Pre-development  
**Owner:** Engineering Lead (KC/Claude)  
**Review Cadence:** Daily standup, end-of-week review

---

## WEEK 1: FOUNDATION & ASRS MODULE

### **Day 1-2: Project Setup**

```
☐ Repository initialized (GitHub)
  └─ [Branch structure: main, develop, feature/*, hotfix/*]
  └─ [.github/workflows/ configured]
  └─ [Secrets configured in GitHub Actions]

☐ Frontend scaffold (Next.js 15)
  └─ [src/app layout]
  └─ [tsconfig.json with strict mode]
  └─ [tailwind.config.ts configured]
  └─ [shadcn/ui init and first components]

☐ Supabase project initialized
  └─ [Database created (US region)]
  └─ [Auth configured (email/password)]
  └─ [RLS policies drafted]
  └─ [Local supabase dev instance running]

☐ Environment variables set
  └─ [.env.example committed to repo]
  └─ [Vercel env vars configured]
  └─ [GitHub Actions secrets configured]

☐ Dependency lock file (pnpm)
  └─ [pnpm-lock.yaml committed]
  └─ [Frozen versions in package.json]
```

### **Day 3-5: ASRS Module Implementation**

```
☐ Database Migration 001 (schema)
  └─ [users table created]
  └─ [assessments table created]
  └─ [RLS policies applied]
  └─ [Indexes created]
  └─ [Local test: pnpm run db:migrate]

☐ API Routes
  ☐ POST /api/auth/signup
    └─ [User creation]
    └─ [Email verification (future)]
    └─ [Unit tests]
    
  ☐ POST /api/auth/login
    └─ [JWT token generation]
    └─ [Session management]
    └─ [Error handling (invalid creds)]
    
  ☐ POST /api/assessment/asrs
    └─ [Validate 18 responses]
    └─ [Calculate scores (Part A, Part B, Total)]
    └─ [Determine risk level]
    └─ [Save to Supabase]
    └─ [Unit tests: 3 test cases (low/moderate/high)]

☐ Frontend Components
  ☐ src/components/auth/SignupForm.tsx
    └─ [Form validation (email format, age ≥18)]
    └─ [Error messages]
    └─ [Loading state during submit]
    
  ☐ src/components/assessment/ASRSForm.tsx
    └─ [18 questions rendered]
    └─ [Radio buttons (5 options per Q)]
    └─ [Real-time score display]
    └─ [Progress bar]
    └─ [Pause/resume (localStorage backup)]
    
  ☐ src/components/assessment/ASRSResults.tsx
    └─ [Display Part A, Part B, Risk level]
    └─ [Domain breakdown visualization]
    └─ [CTA to next step]

☐ Integration Testing
  └─ [Manual: signup → ASRS form → save → results]
  └─ [Browser: mobile/tablet/desktop viewport]
  └─ [Error cases: missing fields, invalid age, etc.]

☐ Code Review Gate 1 (CodeRabbit)
  └─ [Pass: No major issues, ≥80% code coverage]
  └─ [Fail: Hold deployment]

☐ Deploy to Staging (Vercel)
  └─ [Pull request → auto-deploy to vercel.app]
  └─ [Manual testing on staging]
```

### **End of Week 1 Validation Gate**

```
✅ PASS Criteria:
  • ASRS form loads in <2 sec (FCP)
  • 100 users can complete ASRS in 10 min
  • Zero P0 bugs (crashes, data loss)
  • ≥80% code coverage (unit tests)
  • CodeRabbit pass (no critical issues)
  • Snyk security scan: 0 high-severity issues

❌ FAIL Criteria:
  • Form crashes on submit
  • Scores calculated incorrectly
  • ASRS data not saved to DB
  • Performance: FCP >2 sec
  • Code coverage <70%

Decision: [PASS/FAIL] → [PROCEED TO WEEK 2 / HALT & FIX]
```

---

## WEEK 2: INTERVIEW ENGINE & FAMILY MODULE

### **Day 1-3: Interview Core Logic**

```
☐ Question Bank
  └─ [30 interview questions: 9 childhood inattention, 9 childhood hyperactivity, 9 adult inattention, 9 adult hyperactivity, 5 functional]
  └─ [Stored in public/questions.json]
  └─ [Q metadata: id, text, section, domain]

☐ API Routes
  ☐ POST /api/interview/next-question
    └─ [Fetch next Q based on section + index]
    └─ [Return Q text + context hint]
    
  ☐ POST /api/assessment/interview/save-response
    └─ [Save user response]
    └─ [Detect vagueness (length <20 chars?)]
    └─ [Optionally trigger follow-up]
    
  ☐ POST /api/assessment/interview/follow-up
    └─ [Claude API call for clarifying question]
    └─ [Mock: hardcoded follow-ups if Claude not ready]

☐ Claude Integration (Phase 2 upgrade)
  ☐ Sonnet model for interview agent
    └─ [System prompt: "empathic interviewer"]
    └─ [Generate adaptive follow-ups on vague answers]
    └─ [Max tokens: 300 per response]
    └─ [Cost estimate: ~$0.002 per interview]
    └─ [Rate limiting: 10 req/min per user]

☐ Frontend Components
  ☐ src/components/assessment/InterviewChat.tsx
    └─ [Message history display]
    └─ [Text input + send button]
    └─ [Loading state: "Thinking..."]
    └─ [Pause button: save progress]
    └─ [Progress bar + estimated time]
    
  ☐ src/hooks/useClaudeInterview.ts
    └─ [useEffect for Claude API polling]
    └─ [Error handling (timeout, 500 errors)]
    └─ [Fallback: use static follow-ups]

☐ Database Migrations
  ☐ Migration 002: interview_responses table
    └─ [Create table with RLS]
    └─ [Create indexes on assessment_id, question_id]

☐ Testing
  └─ [Manual: 5 full interview runs (expect ~50 min each)]
  └─ [Vagueness detection: test with short answers]
  └─ [Claude timeout: test with no network]
  └─ [Pause/resume: close browser mid-interview, reopen]
```

### **Day 4-5: Family Input Module & Report Generation**

```
☐ Family Input API
  ☐ POST /api/assessment/family/invite
    └─ [Generate unique family_token]
    └─ [Return shareable link]
    
  ☐ POST /api/assessment/family/submit
    └─ [Accept family responses (no auth, token-based)]
    └─ [Save to family_inputs table]
    
  ☐ GET /api/assessment/report/[report_id]
    └─ [Fetch report data]

☐ Report Generation (Static Template for MVP)
  ☐ Puppeteer + HTML → PDF
    └─ [src/lib/pdf.ts]
    └─ [Template: src/public/report-template.html]
    └─ [Input: interview responses + ASRS results]
    └─ [Output: professional PDF]

☐ API Route
  ☐ POST /api/assessment/report/generate
    └─ [Trigger PDF generation (async)]
    └─ [Return pdf_url]
    └─ [Timeout: 30 sec]

☐ Frontend
  ☐ src/components/assessment/FamilyInvite.tsx
    └─ [Show family link, copy to clipboard]
    
  ☐ src/components/assessment/ReportPreview.tsx
    └─ [Display report summary]
    └─ [Download button]

☐ Testing
  └─ [Generate 3 sample reports, verify PDF quality]
  └─ [Family link works, can submit without patient account]
  └─ [Reconciliation: compare family vs patient responses]
```

### **End of Week 2 Validation Gate**

```
✅ PASS Criteria:
  • 5 full interviews completed (avg 50 min)
  • Interview responses saved correctly
  • Claude follow-ups generated for vague answers
  • Family input module working
  • PDF reports generated (readable, professional)
  • Pause/resume: session persists after close
  • ≥80% code coverage
  • CodeRabbit pass

❌ FAIL Criteria:
  • Interview responses lost on network interruption
  • Claude API errors not handled gracefully
  • PDF generation timeout >30 sec
  • Family link broken or insecure
  • Any P0 bugs

Decision: [PASS/FAIL] → [PROCEED TO WEEK 3 / HALT & FIX]
```

---

## WEEK 3: VALIDATION & CLOSED-LOOP TESTING

### **Day 1-3: Clinical Validation**

```
☐ Partner with 2-3 ADHD clinicians
  └─ [Identify willing clinicians (Prof. Al-Wasify + others)]
  └─ [Explain: "MVP testing, not a diagnostic tool")]

☐ Run 10 closed-loop cases (patient → clinician)
  ☐ Day 1-2: 5 cases
    └─ [Patient: completes full assessment]
    └─ [Clinician: reviews report, takes diagnostic interview]
    └─ [Collect: Did AI report match your assessment?]
    └─ [Target: ≥4/5 "yes"]
    
  ☐ Day 3: 5 more cases
    └─ [Refine interview questions if needed]
    └─ [Validate consistency]

☐ Metrics Collection
  └─ [Time-to-complete: expected 45 min]
  └─ [NPS question: "Would you recommend?"]
  └─ [Clinician feedback: "Useful? Accurate?"]
  └─ [Error logs: crashes, timeouts, data loss]

☐ Iteration (if needed)
  └─ [Adjust interview questions based on clinician feedback]
  └─ [Fix any bugs found]
  └─ [Re-test affected flows]
```

### **Day 4-5: Code & Security Review**

```
☐ CodeRabbit Final Pass
  └─ [No critical issues remaining]
  └─ [Code coverage ≥80%]

☐ Security Scan (Snyk)
  └─ [Zero high/critical vulnerabilities]
  └─ [Fix any medium-severity issues]

☐ Performance Testing
  └─ [Lighthouse score ≥90]
  └─ [Web Vitals: FCP <2 sec, LCP <3 sec, CLS <0.1]
  └─ [Load test: 100 concurrent users]

☐ Accessibility Audit
  └─ [WCAG 2.1 AA compliance check]
  └─ [Screen reader test: mobile + desktop]
  └─ [Keyboard navigation: all interactive elements reachable]

☐ Database Backups
  └─ [Supabase backup configured]
  └─ [Test restore procedure]

☐ Error Monitoring (Sentry)
  └─ [Set up error tracking]
  └─ [Create alerts for critical issues]
```

### **End of Week 3 Validation Gate**

```
✅ PASS Criteria:
  • Diagnostic concordance: ≥8/10 clinician matches
  • NPS: ≥60
  • Time-to-complete: 45 ± 10 min
  • Zero P0 bugs
  • Code coverage ≥80%
  • CodeRabbit + Snyk pass
  • Lighthouse ≥90
  • WCAG 2.1 AA compliant

❌ FAIL Criteria:
  • Concordance <6/10
  • NPS <50
  • P0 bugs present
  • Code coverage <70%
  • Security vulnerabilities

Decision: [PASS/FAIL] → [PROCEED TO LAUNCH / HALT & FIX]
```

---

## WEEK 4: HARDENING & PUBLIC BETA LAUNCH

### **Day 1-2: Clinician Directory & Referral**

```
☐ Seed Clinician Data
  └─ [Seed 20 psychiatrists (NYC, SF, LA, Chicago, Houston)]
  └─ [Manual verification: hours, specialties, contact]

☐ API Route
  ☐ POST /api/assessment/directory/search
    └─ [Filter by state, modality, rating]
    └─ [Return top 5 results]

☐ Frontend
  ☐ src/components/assessment/DirectorySearch.tsx
    └─ [Search form]
    └─ [Results cards with booking links]
    └─ ["Send report to this clinician" button]

☐ Testing
  └─ [Search filters work]
  └─ [Booking URLs are valid]
  └─ [Report sharing works]
```

### **Day 3-4: Beta Launch Preparation**

```
☐ Create Beta Site
  └─ [beta.adhdsaas.com (or private beta page)]
  └─ [Invite-only (form for early access)]
  └─ [Email: "Join beta, get $20 discount on $199 tier")]

☐ Monitoring & Alerting
  └─ [Vercel monitoring active]
  └─ [Sentry error tracking live]
  └─ [Database metrics dashboard]
  └─ [Email alerts for P0 issues]

☐ Documentation
  └─ [README.md in repo]
  └─ [Contribution guide (for future team)]
  └─ [Deployment docs]
  └─ [API docs (inline comments)]

☐ Marketing Assets
  └─ [Landing page copy finalized]
  └─ [Email templates (confirmation, report ready, etc.)]
  └─ [Social media post (r/ADHD, Twitter, etc.)]

☐ Final QA Checklist
  ☐ Happy path: signup → ASRS → interview → report → clinician directory → success
  ☐ Edge cases:
    └─ [ ] Abandon & resume after 24 hrs
    └─ [ ] Invalid email format
    └─ [ ] Age <18
    └─ [ ] Family link expired
    └─ [ ] Network timeout during interview
    └─ [ ] Mobile viewport (375px)
    └─ [ ] Slow 3G network
  ☐ Compliance:
    └─ [ ] HIPAA notice displayed
    └─ [ ] Privacy policy linked
    └─ [ ] Emergency resources prominent
    └─ [ ] No diagnosis claims anywhere
```

### **Day 5: LAUNCH**

```
☐ Merge to main
  └─ [All PRs approved and merged]

☐ Deploy to production
  └─ [Vercel auto-deploy on main push]
  └─ [Smoke test: https://adhdsaas.com loads]

☐ Announce Beta
  └─ [Email to waitlist]
  └─ [Post on r/ADHD (if allowed)]
  └─ [Share on Twitter/LinkedIn]

☐ Monitor First 24 Hours
  └─ [Watch error logs]
  └─ [Respond to user feedback]
  └─ [Have rollback plan ready]

☐ Metrics Tracking (Day 1)
  └─ [Signup conversions]
  └─ [ASRS completion rate]
  └─ [Interview drop-off points]
  └─ [Error rates]
```

---

## PHASE 2 PREPARATION (Week 5-8, if Phase 1 succeeds)

```
☐ Tier 2 ($199) with Council v3.2
  └─ [Claude API integration for 13-advisor review]
  └─ [Confidence scoring]
  └─ [Comorbidity flagging]
  └─ [Enhanced report generation]

☐ Public Beta → GA
  └─ [Open signup]
  └─ [Pricing page live]
  └─ [Remove invite requirement]

☐ Expansion
  └─ [Add clinician directory (50+ providers)]
  └─ [Physician dashboard (if pilot succeeds)]
  └─ [International support (Canada, UK)]
```

---

## METRICS & REPORTING

### **Daily Standup (5 min)**
- What was completed yesterday?
- What's blocking today?
- Are we on track for the gate?

### **End-of-Week Review**
- Gate status: ✅ PASS or ❌ FAIL
- Bugs found / fixed
- Performance metrics
- Next week blockers

### **Success Dashboard (Vercel Analytics)**
```
FCP (First Contentful Paint): < 2 sec
API Error Rate: < 0.5%
Uptime: 99.5%+
User Sessions: Track by day
Signup → ASRS Completion: % completed
Avg Time-to-Complete: 45 min ± 10 min
```

---

## ROLLBACK & CONTINGENCY

If **FAIL at any gate:**

1. **Identify root cause** (code bug, data issue, performance)
2. **Hotfix on develop branch** (test locally)
3. **Request code review** (10 min turnaround)
4. **Deploy to staging** (Vercel preview)
5. **Re-run failing test scenario**
6. **Merge to main** (if PASS)
7. **Re-run gate validation**

**Rollback procedure** (if production issue):
```bash
# Kill current production deployment
git revert [commit-hash]

# Re-deploy previous stable version
# Vercel will auto-deploy within 1 min

# Notify team
# Post postmortem within 24 hrs
```

---

**END LAUNCH CHECKLIST**
