# ADHD DIAGNOSTIC SAAS — PRODUCT REQUIREMENTS DOCUMENT
**Version:** 1.0  
**Last Updated:** 2026-05-02  
**Status:** MVP Phase 0-1 (4-week executable)  
**Primary Audience:** Engineering (KC/Claude), Product, Design  

---

## 1. EXECUTIVE SUMMARY

### **Product Vision**
A global, low-cost, AI-guided DIVA-style pre-assessment SaaS that transforms unstructured patient narratives into diagnostic-grade case files for clinicians, reducing intake time by 45 min/patient while improving diagnostic accuracy through structured memory scaffolding, family input integration, and LLM Council v3.2 multi-expert validation.

### **Market**
- **TAM (US adult ADHD seeking diagnosis/year):** 400K people
- **SAM (Online-capable, willing-to-pay):** 200K people/year
- **SOM (Year 1-3):** 10K–200K patients
- **Primary market:** North America (US/Canada)
- **Secondary:** Europe (post-validation)

### **Business Model**
Two-tier direct-to-consumer + eventual B2B physician subscriptions:
- **$49 tier:** ASRS screening + AI interview + family input + PDF report (impulse buy, high volume)
- **$199 tier:** $49 + LLM Council v3.2 review + confidence scoring + clinician reasoning chain (deliberate buy, premium)
- **Physician B2B (Year 2+):** USD 10–50/report for clinic subscriptions + dashboard + EHR integration

### **Success Metrics (MVP Phase 1)**
- CAC: <USD 10 (organic channels: r/ADHD, communities)
- NPS: ≥60 (would recommend)
- Churn: <5% monthly
- Time-to-complete: 30–45 min for $49 tier, 50–70 min for $199 tier
- Diagnostic concordance (closed-loop validation): ≥80% match with clinician diagnosis

---

## 2. PRODUCT SCOPE — MVP PHASE 0-1 (4 WEEKS)

### **2.1 In Scope**

**Tier 1 ($49) — Baseline**
- ASRS v1.1 screening module (18-question, 10 min)
  - Output: risk level (Low/Moderate/High), domain breakdown (inattention vs hyperactivity/impulsivity)
  - No diagnosis language; always defer to clinician
- AI-guided DIVA-style interview (adaptive, 30–40 min)
  - Covers: childhood symptoms (age 5–12), adult symptoms (last 6–12 months), functional impairment (5 domains)
  - Memory scaffolding: contextual prompts, life-event anchors, example-driven questioning
  - Handles vague answers: "Can you give a specific example from work?" + gentle contradiction flags
- Family/partner input module (async, 10–15 min)
  - Separate link, same questions, focus on childhood recall
  - AI reconciles self vs informant: agreement/disagreement/missing info
- PDF report generation (clinician-ready)
  - Executive summary (5–7 bullets)
  - Symptom grid (A1/A2 items: childhood/adulthood presence, examples)
  - Functional impairment breakdown (5 domains with impact rating)
  - Informant perspective summary
  - AI notes for clinician ("areas to clarify")
  - Always: "This is preparation only. Clinician diagnosis is independent."
- Clinician directory + referral
  - Filter by: country, telehealth/in-person, ADHD expertise
  - Show: name, distance, rating, booking URL
  - One-click referral letter attachment to booking (future integrations)

**Tier 2 ($199) — Premium (Phase 1.5, add if $49 validation succeeds)**
- Everything in $49, PLUS:
- LLM Council v3.2 review layer (async background process)
  - 13 advisors independently analyze symptom consistency, blind spots, comorbidity flags
  - Confidence scoring (per domain, overall)
  - Reasoning chain visible to clinician in report
- Enhanced comorbidity flagging (not diagnosis, but flagged for clinician exploration)
  - Anxiety patterns, depression indicators, trauma markers, sleep disorder signs, substance use patterns
- Higher-grade models (Claude Opus for reasoning vs Sonnet for interview)

**Explicitly NOT in scope (Phase 0-1):**
- Diagnosis or treatment recommendations
- Medication suggestions
- Clinician-side dashboard or EHR integration
- Multi-condition modules (autism, bipolar)
- Insurance processing or payment
- Multi-language support (English + basic Spanish for future)
- Mobile app (web-first, responsive only)

---

## 3. USER FLOWS & UX

### **3.1 Patient Flow (Tier 1 — $49)**

```
┌─────────────────────────────────────────────────────────────┐
│ FLOW: Patient Self-Assessment Onboarding to Report Export  │
└─────────────────────────────────────────────────────────────┘

STEP 1: Landing Page
  ├─ Headline: "Prepare for your ADHD evaluation"
  ├─ Subheadline: "Structured assessment + clinician-ready report"
  ├─ CTA: "Start Assessment ($49)"
  └─ Trust signals: "Takes 45 min. Not a diagnosis. Clinician confirmation required."

STEP 2: Onboarding & Consent
  ├─ Email + age + language + timezone
  ├─ Explicit consent: "I understand this is NOT a diagnosis. Only a clinician can diagnose."
  ├─ Emergency clause: "If you have thoughts of self-harm, call [local emergency]"
  └─ CTA: "I Understand, Continue"

STEP 3: ASRS Screening (10 min)
  ├─ 18 questions, 5-point Likert (Never / Rarely / Sometimes / Often / Very Often)
  ├─ Show score in real-time (e.g., "Your responses so far: 12/18 in inattention domain")
  ├─ Output screen after completion:
  │  ├─ Risk level: "Moderate likelihood of ADHD-related difficulties"
  │  ├─ Domain breakdown: "Inattention: 8/9 | Hyperactivity: 4/9"
  │  ├─ Explanation: "These patterns align with X. Continue to detailed interview for clinician."
  │  └─ CTA: "Continue to Detailed Interview"
  └─ Allow pause/resume (save progress)

STEP 4: AI-Guided Interview (Adaptive, 40–50 min)
  ├─ Introduction: "Let's explore your ADHD symptoms in detail"
  ├─ Section A: Childhood (age 5–12)
  │  ├─ AI asks 9 inattention questions, then 9 hyperactivity/impulsivity questions
  │  ├─ For each: "Did this apply to you as a child?"
  │  ├─ If yes: "Can you give me an example?"
  │  ├─ If vague: "That's helpful. Can you be more specific? E.g., was it in school, at home, with friends?"
  │  ├─ Follow-up: "How often did this happen? Daily, weekly, sometimes?"
  │  ├─ Allow: pause, back-up, skip (but flag)
  │  └─ Progress bar: "Childhood symptoms — 4 of 9 inattention questions answered"
  │
  ├─ Section B: Adulthood (last 6–12 months)
  │  ├─ Same structure as childhood, but framed as "now"
  │  ├─ Add context: "How does this show up in your work/home/relationships?"
  │  ├─ Surface inconsistencies: "You mentioned childhood difficulties with organization. You still struggle with that now?"
  │  └─ Probe functional impact: "Has this caused problems at work, home, or relationships?"
  │
  ├─ Section C: Functional Impairment (5 domains)
  │  ├─ Work/Study: "Tell me about your job. How do you handle deadlines, organization, focus?"
  │  ├─ Home/Organization: "How is your home organized? Bills, emails, household tasks?"
  │  ├─ Relationships: "Has ADHD-like behavior affected your relationships?"
  │  ├─ Social/Leisure: "How do you maintain friendships or hobbies?"
  │  └─ Self-Image: "How has this affected your self-perception?"
  │
  ├─ Section D: Summary & Reflection
  │  ├─ Show patient: key symptom patterns identified
  │  ├─ Highlight: strongest impairment areas
  │  ├─ Flag: any inconsistencies or ambiguities for clinician discussion
  │  └─ CTA: "Review Your Report" or "Add Family Input"
  │
  └─ Allow: pause/resume after each section

STEP 5: Family Input Module (Optional, 10–15 min)
  ├─ Generate unique link for family member (spouse/parent/sibling)
  ├─ Their onboarding: name, relationship, optional consent attestation
  ├─ Focused questions on childhood & family history
  │  ├─ "What was [patient] like as a child? School performance, behavior?"
  │  ├─ "Family history of ADHD or other psychiatric conditions?"
  │  ├─ "Were there major events (moves, trauma, illness) in their childhood?"
  │  └─ Free-form comments: "Anything else you think clinician should know?"
  ├─ Family member submits; AI notifies patient: "Family input received"
  └─ Patient can view summary; option to add response/clarification

STEP 6: Report Generation & Review
  ├─ AI generates PDF (background process, ~30 sec)
  ├─ Patient sees: "Your report is ready"
  ├─ Report preview:
  │  ├─ Executive summary (5–7 bullets)
  │  ├─ ASRS results
  │  ├─ Symptom grid (with examples)
  │  ├─ Functional impairment breakdown
  │  ├─ Informant perspective
  │  ├─ AI-flagged "areas to clarify" for clinician
  │  └─ Disclaimer: "This is preparation only. Clinician confirmation required."
  ├─ Options:
  │  ├─ "Download PDF"
  │  ├─ "Email to myself"
  │  ├─ "Find a clinician"
  │  └─ "Share feedback"
  └─ CTA: "Find a Clinician to Review This"

STEP 7: Clinician Directory & Referral
  ├─ Filters: country (US), state, telehealth/in-person, ADHD expertise
  ├─ Results: 3–5 clinicians with:
  │  ├─ Name, specialty, distance/telehealth badge
  │  ├─ Rating (from Psychology Today / Zencare if available)
  │  ├─ Booking URL (direct to their scheduling system)
  │  └─ "Send my report to this clinician" button (future: secure link)
  ├─ FAQ: "What to expect at your appointment"
  └─ CTA: "Book appointment"

STEP 8: Post-Purchase (Optional)
  ├─ Email: "Here's your report + next steps"
  ├─ NPS: "Would you recommend this to others?"
  ├─ Feedback: "How could we improve?"
  └─ Incentive: "Early access to upgrades if you share your result"
```

### **3.2 Tier 2 ($199) Flow — Divergence**

After STEP 6 (Report Generation):
```
STEP 6.5: Council Review Processing
├─ Patient sees: "Submitting your assessment to expert advisors..."
├─ Background: 13 advisors independently analyze (async, ~5–10 min)
├─ Confidence scoring computed
├─ Enhanced comorbidity flagging run
└─ Patient notified: "Expert review complete. Enhanced report ready."

STEP 6.75: Enhanced Report Review
├─ Patient sees report WITH:
│  ├─ Confidence scores (per domain: inattention, hyperactivity, functional impairment)
│  ├─ Advisor disagreement zones (e.g., "3 advisors flagged anxiety patterns")
│  ├─ Comorbidity flags (NOT diagnosis, but "Patterns suggest anxiety may be relevant")
│  └─ Reasoning chain visible: "Here's why advisors flagged X"
└─ CTA: "Download Enhanced Report"
```

### **3.3 Clinician-Facing Output**

**PDF Report (one-page summary + detailed breakdown)**

```
┌─────────────────────────────────────────────────────────┐
│  ADHD PRE-ASSESSMENT REPORT                             │
│  Patient: [Name] | Age: [Age] | Date: [Date]            │
│  Assessment Tool: AI-Guided DIVA-Style Interview        │
│  ⚠️ NOT A DIAGNOSIS. Preparation only.                   │
└─────────────────────────────────────────────────────────┘

EXECUTIVE SUMMARY
─────────────────
• Self-reported pattern: predominantly inattentive symptoms
• Childhood consistency: Strong (7/9 inattention symptoms present age 5–12)
• Adulthood severity: High (8/9 inattention symptoms present last 6–12 months)
• Functional impairment: Severe in work/organization; moderate in relationships
• Family informant: Spouse confirms childhood disorganization pattern
• AI-flagged areas: Anxiety comorbidity possible; sleep data missing (ask directly)

ASRS SCREENING (v1.1)
─────────────────────
Part A (Inattention): 8/9 symptoms
Part B (Hyperactivity): 2/9 symptoms
Risk Band: MODERATE-HIGH likelihood of ADHD-related difficulties

SYMPTOM GRID (DSM-5 A1 & A2)
────────────────────────────
[Table: A1 inattention items, A2 hyperactivity items; childhood / adulthood presence; examples provided]

FUNCTIONAL IMPAIRMENT BREAKDOWN
───────────────────────────────
Work/Study: SEVERE
  Example: "4 job changes in 5 years. Each time: missed deadlines → conflict → left/fired."
  
Home/Organization: SEVERE
  Example: "Bills pile up. I pay them in batches when they're overdue. Kitchen disorganized constantly."
  
Relationships: MODERATE
  Example: "Partner says I interrupt a lot. Forget anniversary. Struggle to listen during conflicts."
  
Social/Leisure: MILD
  Example: "I have hobbies but struggle to maintain them consistently."
  
Self-Image: MODERATE-HIGH
  Example: "Feel incompetent. Like I should be able to manage my life. Frustrated with myself."

INFORMANT PERSPECTIVE
─────────────────────
Spouse input: "He was always messy as a child. Teachers said 'could do better if he tried.' He loses things constantly. Forgetful. But at work, he hyperfocuses on interesting projects."
Agreement: High consistency on disorganization, time management. Some disagreement on hyperactivity (patient reports high; spouse says "selective energy" in interesting tasks).

AI-FLAGGED AREAS FOR CLINICIAN DISCUSSION
──────────────────────────────────────────
1. Sleep patterns: Not directly assessed. Patient mentions "irregular sleep schedule" but no detail.
   → Ask: Current sleep architecture? Insomnia, hypersomnia, or irregular?
   
2. Anxiety signals: Patient reports perfectionism + self-criticism. Spouse notes "he worries about being late."
   → Ask: Does anxiety precede ADHD symptoms, or secondary to frustration with ADHD challenges?
   
3. Substance use: Not addressed in interview.
   → Ask: Caffeine use? Alcohol/drug use history? Self-medication patterns?

DISCLAIMER
──────────
This report is generated by an AI system trained to assist in structured data collection
for adult ADHD pre-assessment. It is NOT a diagnostic instrument. Only a licensed clinician
can diagnose ADHD. Use this report to:
- Organize patient's self-reported symptoms
- Identify areas for further clinical exploration
- Save intake interview time

This report does NOT:
- Replace clinical judgment
- Diagnose ADHD or any condition
- Substitute for medical history, physical exam, or differential diagnosis
- Guarantee accuracy (rely on clinician verification)

Patient consented to this assessment and understands these limitations.
─────────────────────────────────────────────────────────────────────
```

---

## 4. ACCEPTANCE CRITERIA

### **4.1 ASRS Module**
```yaml
Criteria:
  - Display 18 questions in randomized order (no learning signal)
  - Calculate Part A (inattention: items 1,2,3,4,5,7,8,9,10) and Part B (hyperactivity: items 6,11,12,13,14,15,16,17,18)
  - Show real-time score as patient answers
  - Output risk band: Low (<4 Part A items + <4 Part B) / Moderate (4-5 items in either part) / High (6+ items)
  - Output domain breakdown as percentage
  - Allow pause/resume (store progress in localStorage first, then Supabase)
  - Time limit: 10 minutes (warn at 8 min, allow override)
  - ✅ PASS: Risk band displayed, domain breakdown shown, next step unlocked

Validation:
  - Test with known ADHD-positive and ADHD-negative responses
  - Verify scoring logic matches public ASRS scoring algorithm
```

### **4.2 AI Interview Module**
```yaml
Criteria:
  - Generate 36 symptom questions (18 childhood, 18 adult) + 5 functional impairment questions
  - Adapt follow-ups based on vague answers (detected via keyword matching or confidence scoring)
  - Store responses in structured format: { symptom_id, presence, examples, frequency }
  - Flag contradictions gently: "Earlier you mentioned X, now you're saying Y. Help me understand both?"
  - Allow pause after each section (save to Supabase)
  - Time estimate: 45 min (track actual, show progress bar)
  - Memory scaffolding: offer contextual cues if patient says "I don't remember"
    E.g., "Think of primary school (age 7–10). School reports say anything?"
  - ✅ PASS: All responses captured, contradictions flagged, pause/resume works, report data exported

Validation:
  - Run 5 closed-loop interviews (patient → clinician)
  - Clinician confirms: "Report captured the key symptoms I would have asked about"
  - Average time: 45 ± 10 min
```

### **4.3 Family Input Module**
```yaml
Criteria:
  - Generate unique link for family member (no patient email exposure)
  - Collect: relationship, childhood recollections (free-form + structured), family history
  - Store separately from patient data (relation type as FK)
  - AI reconciles: agreement/disagreement zones visible in report
  - Optional (not required to complete assessment)
  - ✅ PASS: Unique link generated, data stored securely, report shows informant summary

Validation:
  - Test with spouse/parent; verify data quality
  - Clinician feedback: "Family input added context I wouldn't have gotten in 60 min interview"
```

### **4.4 Report Generation**
```yaml
Criteria:
  - PDF generated within 30 sec of completion
  - Contains: executive summary, ASRS results, symptom grid, functional impairment, informant summary, AI notes, disclaimer
  - All language: non-diagnostic ("patterns suggest," "areas to explore," "for clinician confirmation")
  - Clinician report includes patient's actual example quotes (verbatim from interview)
  - Professional formatting (Anthropic brand colors if applicable, readable font, clear hierarchy)
  - ✅ PASS: PDF downloadable, email-able, shareable with clinician via secure link (later)

Validation:
  - 5 clinicians review report: "Is this useful? Do you understand the patient's situation?"
  - Target: ≥80% say "Yes, this saves me 30 min of intake"
```

### **4.5 Directory & Referral**
```yaml
Criteria:
  - Directory populated with ≥50 US psychiatrists/psychologists in pilot region (NYC, SF, LA)
  - Filter by: country, state, telehealth, ADHD expertise
  - Show: name, specialty, location/telehealth badge, rating (if available), booking URL
  - "Send to clinician" button generates referral letter (text + PDF report)
  - ✅ PASS: Patient can find clinician in <2 min, click through to booking

Validation:
  - User test: 10 patients find + click to clinician. Track: time-to-click, click-through rate
  - Target: ≥70% CTR within 2 min
```

### **4.6 Tier 2 ($199) Council Review**
```yaml
Criteria:
  - Background process: 13 advisors analyze report (async, <10 min)
  - Confidence scores computed (0–100 per domain)
  - Comorbidity flags output (not diagnosis, but flagged)
  - Reasoning chain visible: "Why did advisors flag anxiety?"
  - Enhanced report generated with Council insights
  - ✅ PASS: Confidence scores shown, advisor insights displayed, enhanced report downloadable

Validation:
  - Run on 20 closed-loop cases
  - Clinician feedback: "Does Council review improve diagnostic confidence?"
  - Target: ≥80% say "Yes, gives me useful structure"
```

---

## 5. TECHNICAL REQUIREMENTS (See TECHNICAL-ARCHITECTURE.md)

- **Frontend:** Next.js 15, Tailwind CSS, shadcn/ui, TypeScript
- **Backend:** Node.js, Supabase (auth, DB, RLS), Vercel serverless
- **AI:** Claude Sonnet (interviews), Claude Opus (Council v3.2 reasoning)
- **Data:** Supabase PostgreSQL + pgvector (for future embedding-based recommendations)
- **Cache:** Upstash Redis (interview templates, common responses)
- **Deployment:** Vercel (frontend), Supabase managed (backend)
- **Code Review:** CodeRabbit, Sourcery, Sonar, Snyk (CI/CD auto-runs)

---

## 6. DATA & PRIVACY

- All PHI encrypted at rest (Supabase native encryption)
- RLS policies: patients see only their data
- No third-party sharing without consent
- HIPAA compliance plan (see COMPLIANCE-ROADMAP.md)
- Data retention: 3 years default, patient can request deletion anytime
- Vector embeddings (pgvector) for future: cohort analysis, anonymized research insights

---

## 7. LAUNCH CHECKLIST — PHASE 0-1

```
WEEK 1-2: Core Product Build
─ [ ] ASRS module + scoring (+ unit tests)
─ [ ] Interview engine (first 10 questions, Claude API integration)
─ [ ] Supabase schema (users, assessments, responses, families)
─ [ ] Frontend onboarding flow (landing → consent → ASRS)
─ [ ] Manual PDF report (template-based, no dynamic generation yet)

WEEK 3: Interview Completion & UX
─ [ ] Full AI interview (all 36 Qs + follow-ups)
─ [ ] Family input module (separate link, data collection)
─ [ ] Dynamic PDF generation (Puppeteer + React to PDF)
─ [ ] Pause/resume logic (localStorage + Supabase sync)
─ [ ] Progress bar + time tracking

WEEK 4: Validation & Hardening
─ [ ] 10 closed-loop interviews (patient → clinician feedback)
─ [ ] Clinical concordance measurement
─ [ ] Code review (CodeRabbit pass)
─ [ ] Performance testing (Vercel observability)
─ [ ] Security scan (Snyk, OWASP)
─ [ ] Launch: beta.adhdsaas.com (invite-only, 50 users)

POST-LAUNCH (Week 5-8):
─ [ ] Gather NPS + feedback
─ [ ] Iterate on interview questions (UX + clinical accuracy)
─ [ ] Add clinician directory (start with 20, expand)
─ [ ] Tier 2 ($199) feature work if $49 validation succeeds
─ [ ] Public beta launch (open signup, pricing page live)
```

---

## 8. METRICS & VALIDATION GATES

### **MVP Validation Metrics**

| Metric | Target | Owner | Check Frequency |
|--------|--------|-------|-----------------|
| Time-to-complete ($49) | 45 ± 10 min | Product | Daily (Vercel analytics) |
| Time-to-complete ($199) | 60 ± 15 min | Product | Daily |
| NPS | ≥60 | Product | Weekly (email survey) |
| Churn (monthly) | <5% | Finance | Weekly |
| CAC (organic channels) | <$10 | Marketing | Weekly |
| Diagnostic concordance (closed-loop) | ≥80% | Clinical | After every 10 cases |
| Report usefulness (clinician feedback) | ≥80% say "useful" | Clinical | After every 5 clinician reviews |
| Code coverage (unit tests) | ≥80% | Engineering | Every PR |
| Page load time (web vital: FCP) | <2 sec | Engineering | Daily (Vercel) |
| API error rate | <0.5% | Engineering | Daily |
| Security scan pass rate | 100% (no high-severity) | Security | Every commit (CI/CD) |

### **Go/No-Go Gates**

**Gate 1 (End Week 2):** ASRS + onboarding live
- Acceptance: ≥100 users, <1% signup drop-off, zero critical bugs
- No-go: Signup flow broken, security scan fails

**Gate 2 (End Week 3):** Full interview + family module live
- Acceptance: ≥50 completed interviews, average time 45–60 min, NPS ≥50
- No-go: Interview drops >30% of users, clinician says "data quality is poor"

**Gate 3 (End Week 4):** Closed-loop validation (10 cases)
- Acceptance: ≥8/10 clinicians say "report matches my assessment"
- No-go: <6/10 match, OR clinician identifies critical misses in comorbidities

**Gate 4 (Beta launch):** All systems operational
- Acceptance: Zero P0 bugs, CodeRabbit pass, Snyk pass, >50 beta signups
- No-go: Any P0 remains, security scan fails, poor early NPS

---

## 9. ROLLOUT STRATEGY

### **Phase 0 (Week 1-4): Closed Alpha**
- Internal team + 10 clinician partners + 50 public beta users
- Invite-only (beta.adhdsaas.com)
- Weekly feedback cycles
- Daily hot-fixes if needed

### **Phase 1 (Week 5-8): Open Beta**
- Public beta at adhdsaas.com (free tier = ASRS only)
- $49 tier available (invite-first, then public)
- Pricing page live
- Weekly feature releases (based on feedback)

### **Phase 2 (Month 3+): GA Launch**
- Full product (Tier 1 + Tier 2 if validation passes)
- Clinician directory live
- Marketing campaign (r/ADHD, ADHD blogs, communities)
- Target: 1K paying users by end of Month 3

---

## 10. NON-FUNCTIONAL REQUIREMENTS

- **Uptime:** 99.5% (acceptable downtime: 3.6 hours/month)
- **Latency:** API response <500ms (p95), page load <2s (FCP)
- **Scalability:** Handle 10K concurrent users (Vercel + Supabase auto-scaling)
- **Data retention:** 3 years (HIPAA-aligned)
- **Backup:** Daily snapshots (Supabase managed)
- **Disaster recovery:** RTO 4 hours, RPO 1 hour
- **Accessibility:** WCAG 2.1 AA minimum

---

## 11. FUTURE PRODUCT ROADMAP (Phase 2+)

**Data Product Vision (if clinical validation succeeds):**
- At critical mass (50K+ assessments), anonymized data becomes valuable
- Offer: cohort analysis, diagnostic pattern insights, clinician benchmarking
- Monetization: B2B research, data licensing to academic institutions (with full anonymization + consent)
- Technical: pgvector embeddings for cohort clustering, privacy-preserving aggregations

**Multi-Condition Expansion:**
- Month 3: Autism spectrum (adult, women-focused)
- Month 6: Bipolar II (symptomatic recall focus)
- Month 9: Complex PTSD / Trauma

**Clinician B2B (Year 2+):**
- Dashboard: patient prep summaries, diagnostic conversion rates, referral analytics
- EHR integrations: Epic, Cerner (future)
- Pricing: USD 10–50/report via clinic subscription

---

## 12. DEFINITIONS & GLOSSARY

- **DIVA-5:** Diagnostic Interview for ADHD in Adults (structured clinical interview, gold standard)
- **ASRS v1.1:** Adult ADHD Self-Report Scale (WHO-backed screening, 18 items)
- **DSM-5:** Diagnostic and Statistical Manual (diagnostic criteria for ADHD)
- **A1 (Inattention):** 9 symptoms (careless mistakes, difficulty sustaining attention, doesn't listen, etc.)
- **A2 (Hyperactivity/Impulsivity):** 9 symptoms (fidgets, restless, talks excessively, etc.)
- **LLM Council v3.2:** 13 independent AI advisors + peer review + Monte Carlo analysis
- **pgvector:** PostgreSQL vector extension (embedding storage for future recommendations)
- **RLS:** Row-Level Security (Supabase database policies, per-user data isolation)

---

**END PRD**
