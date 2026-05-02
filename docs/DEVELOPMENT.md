# DEVELOPMENT.md — CONTEXT ENGINEERING & TEST-FIRST WORKFLOW
**Version:** 1.0  
**Status:** Active  
**Purpose:** Minimize context loss, reduce bugs, eliminate troubleshooting loops

---

## 1. CONTEXT ENGINEERING PRINCIPLES

### **The Problem We're Solving**

In long projects:
- LLM agents hand off to each other → context degrades
- Engineers forget why decisions were made → duplicate work
- Bugs get introduced → hours of troubleshooting
- Each agent starts from scratch → inefficient

### **The Solution**

**CONTEXT STACK:** Every session starts with full context.

```
Session Start Order (30 min total):
1. Read CLAUDE.md (5 min) — master context
2. Read NAMING-DECISION-TABLE.md (2 min) — product name locked
3. Read relevant PRD doc (10 min) — feature spec
4. Read your domain doc (tech/product/qa) (10 min) — architecture
5. Read current TEST-FIRST.md (3 min) — testing spec
```

**No exceptions. Every session, every agent.**

---

## 2. TEST-FIRST DEVELOPMENT (TFD) WORKFLOW

### **2.1 The Pattern: Red → Green → Refactor → Deploy**

```
┌─────────────────────────────────────────────────────┐
│ FEATURE REQUEST                                     │
│ "Implement ASRS screening module"                  │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │  1. WRITE FAILING TEST  │ (RED)
        │  ─────────────────────  │
        │  - Test file first      │
        │  - Assert what should   │
        │    happen (not what is) │
        │  - pnpm test → FAIL     │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  2. WRITE CODE          │ (GREEN)
        │  ─────────────────────  │
        │  - Minimal code to pass │
        │  - pnpm test → PASS     │
        │  - No premature optim.  │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  3. REFACTOR            │ (REFACTOR)
        │  ─────────────────────  │
        │  - Improve code quality │
        │  - Keep tests passing   │
        │  - pnpm test → PASS     │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  4. CODE REVIEW         │ (GATE)
        │  ─────────────────────  │
        │  - CodeRabbit approval  │
        │  - Coverage check (≥80%)│
        │  - Snyk pass (0 vulns)  │
        │  - Manual test (staging)│
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  5. DEPLOY              │ (GO LIVE)
        │  ─────────────────────  │
        │  - Merge to main        │
        │  - Vercel auto-deploys  │
        │  - Monitor Sentry 24hr  │
        │  - Check metrics        │
        └────────────┬────────────┘
                     │
        ┌────────────▼────────────┐
        │  6. DOCUMENT            │ (RECORD)
        │  ─────────────────────  │
        │  - Update CLAUDE.md     │
        │  - Close GitHub issue   │
        │  - Standup summary      │
        └────────────────────────┘
```

---

### **2.2 Test-First Checklist (Before Writing Code)**

**Every feature starts with a test file:**

```typescript
// src/lib/__tests__/asrs.test.ts
import { calculateASRSScore, calculateRiskLevel } from '../asrs';

describe('ASRS Scoring', () => {
  
  // Test 1: Correct scoring
  test('calculateASRSScore returns correct part A score', () => {
    const responses = {
      'a1_1': 4, 'a1_2': 3, 'a1_3': 2, // ... all 18 items
    };
    const score = calculateASRSScore(responses);
    expect(score.partA).toBe(9); // sum of part A items
  });

  // Test 2: Risk level classification
  test('calculateRiskLevel returns "High" for Part A ≥6', () => {
    expect(calculateRiskLevel(8, 2)).toBe('High');
  });

  // Test 3: Edge case (all zeros)
  test('calculateRiskLevel returns "Low" for all zeros', () => {
    expect(calculateRiskLevel(0, 0)).toBe('Low');
  });

  // Test 4: Edge case (invalid input)
  test('calculateASRSScore throws on invalid responses', () => {
    expect(() => calculateASRSScore({})).toThrow('18 responses required');
  });
});
```

**Then write code to pass:**

```typescript
// src/lib/asrs.ts
export function calculateASRSScore(responses: Record<string, number>) {
  if (Object.keys(responses).length !== 18) {
    throw new Error('18 responses required');
  }
  
  const partA = ['a1_1', 'a1_2', ...].reduce((sum, key) => sum + (responses[key] || 0), 0);
  const partB = ['a2_1', 'a2_2', ...].reduce((sum, key) => sum + (responses[key] || 0), 0);
  
  return { partA, partB, total: partA + partB };
}

export function calculateRiskLevel(partA: number, partB: number): string {
  if (partA >= 6 || partB >= 6) return 'High';
  if (partA >= 4 || partB >= 4) return 'Moderate';
  return 'Low';
}
```

**Then run tests:**

```bash
pnpm test asrs.test.ts
# PASS: 4 tests passed
# Coverage: asrs.ts → 100%
```

---

## 3. ZERO TROUBLESHOOTING LOOPS

### **The Problem**

Typical flow WITHOUT this approach:
```
Day 1: Write code
Day 2: Find bug
Day 3: Debug for 4 hours
Day 4: Find root cause (should have been obvious)
Day 5: Fix + test (1 hour, could have prevented)
```

**Lost time: 4+ hours per bug**

### **The Solution**

**Root Cause Analysis (RCA) First:**

1. **Bug found** → Immediately write a test that reproduces it
2. **Test fails** → Confirms bug
3. **Fix code** → Make test pass
4. **Test passes** → Bug is gone
5. **Add assertion** → Prevent regression

**Example:**

```typescript
// Bug: ASRS responses not saved to DB

// Step 1: Write test that reproduces bug
test('ASRS responses should persist to database', async () => {
  const assessmentId = 'test-123';
  const responses = { a1_1: 4, ... };
  
  await saveASRSResponses(assessmentId, responses);
  
  const saved = await getASRSResponses(assessmentId);
  expect(saved).toEqual(responses); // THIS FAILS
});

// Step 2: Debug (read test output)
// FAIL: Expected { a1_1: 4, ... } but got undefined
// ROOT CAUSE: No RLS policy allows user to read own responses

// Step 3: Fix (update RLS policy)
-- src/database/policies.sql
ALTER TABLE asrs_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own responses" ON asrs_responses
  FOR SELECT USING (assessment_id IN (
    SELECT id FROM assessments WHERE user_id = auth.uid()
  ));

// Step 4: Test passes
pnpm test
// PASS: ASRS responses should persist

// Step 5: Add assertion (prevent this specific regression)
test('RLS policy blocks other users from reading responses', async () => {
  const user1Responses = await getASRSResponses('assessment-123', user1Token);
  const user2Responses = await getASRSResponses('assessment-123', user2Token);
  
  expect(user1Responses).toBeDefined();
  expect(user2Responses).toBeNull(); // User 2 can't read User 1's data
});
```

**Result: 30 min fix + test + regression coverage. Zero troubleshooting loops.**

---

## 4. TESTING MATRIX (What to Test at Each Layer)

### **4.1 Unit Tests (pnpm test)**

**What:** Individual functions in isolation

**Examples:**
- `calculateASRSScore(responses)` → returns correct Part A/B scores
- `generateInterviewQuestion(section, index)` → returns valid Q object
- `validateEmail(email)` → returns true for valid, false for invalid
- `calculateReportSummary(responses)` → returns structured report

**Coverage Target:** ≥80%

```bash
pnpm test -- --coverage
# Coverage: 84%
```

---

### **4.2 Integration Tests (Next.js API routes)**

**What:** API endpoint + database + RLS all together

**Examples:**
```typescript
// src/__tests__/api/asrs.test.ts
test('POST /api/assessment/asrs saves responses and returns risk level', async () => {
  const response = await fetch('/api/assessment/asrs', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessment_id: 'test-123', responses: {...} })
  });
  
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.risk_level).toBe('Moderate');
  
  // Verify DB saved
  const dbCheck = await supabase.from('asrs_responses').select('*').eq('assessment_id', 'test-123');
  expect(dbCheck.length).toBe(18); // All 18 responses saved
});

test('POST /api/assessment/asrs denies access to other users', async () => {
  const response = await fetch('/api/assessment/asrs', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer otherUserToken', ... },
    body: JSON.stringify({ assessment_id: 'user1-assessment', ... })
  });
  
  expect(response.status).toBe(403); // Forbidden
});
```

---

### **4.3 End-to-End Tests (Full user flow)**

**What:** Landing page → signup → ASRS → interview → report

**Example (manual for MVP, automated later):**

```
E2E Test: Patient completes assessment

1. Navigate to https://diagprep.com
   ✅ Page loads in <2 sec
   ✅ "Prepare for your evaluation" headline visible
   ✅ CTA buttons clickable

2. Click "Start $49 Assessment"
   ✅ Redirects to /auth/signup
   ✅ Form loads
   ✅ Email validation works

3. Sign up: user@test.com, age 32
   ✅ Account created
   ✅ Email verification sent
   ✅ Redirected to /assessment/asrs

4. Complete ASRS (18 questions)
   ✅ Each question loads
   ✅ Progress bar updates
   ✅ Submit button enabled after all answered

5. Submit ASRS
   ✅ Scores calculated
   ✅ Risk level displayed
   ✅ Proceeds to interview

6. Complete interview (10 Q's, not full 36 for E2E time)
   ✅ AI generates questions
   ✅ Responses saved
   ✅ Can pause/resume

7. View report
   ✅ PDF generated in <30 sec
   ✅ Can download
   ✅ Can view on-page

8. Find clinician
   ✅ Directory loads
   ✅ Can filter
   ✅ Can click through to booking

RESULT: ✅ PASS — Full flow works
```

---

## 5. CODE REVIEW GATES (No Merge Without These)

### **5.1 Pre-PR Checklist (Before You Create PR)**

```bash
# 1. Tests pass locally
pnpm test
# PASS: 42 tests, 84% coverage

# 2. Lint + format
pnpm lint
pnpm format
# PASS: No issues

# 3. TypeScript strict
pnpm typecheck
# PASS: 0 errors

# 4. Build
pnpm build
# PASS: Build succeeds

# 5. Manual test on localhost
pnpm dev
# → Test feature manually
# → Check responsive (mobile/tablet/desktop)
# → Check network latency (throttle to slow 3G)

# Only then: git push
```

---

### **5.2 Automated Gates (GitHub Actions)**

On push to feature branch:

```
✅ Jest tests (coverage ≥80%)
✅ ESLint (no errors)
✅ TypeScript (strict mode, 0 errors)
✅ Snyk security (no high/critical issues)
✅ Build check (pnpm build succeeds)
✅ CodeRabbit AI review (automated)
```

If any fail: PR shows red X, cannot merge.

---

### **5.3 Human Code Review (CodeRabbit + You)**

CodeRabbit auto-flags:
- Complex logic (>10 lines without comments)
- Missing error handling
- Security issues (hardcoded secrets, SQL injection, XSS)
- Performance issues (N+1 queries, unoptimized loops)
- Test coverage gaps

You fix, push again, CodeRabbit re-reviews.

**Example CodeRabbit comment:**

```
❌ Line 42: Missing error handling for Claude API timeout
BEFORE:
  const response = await anthropic.messages.create({ ... });
  return response.content[0].text;

SUGGESTED:
  const response = await anthropic.messages.create({ 
    ...
    timeout: 5000 // Add timeout
  });
  
  if (!response.content?.[0]?.text) {
    // Fallback to static response
    return getStaticFollowUp(context);
  }
  
  return response.content[0].text;
```

You fix, comment "Done", CodeRabbit approves.

---

## 6. DEPLOYMENT PIPELINE (Automated, One-Way)

```
Your Code Workflow:

1. Feature branch: git checkout -b ccw/asrs-module
2. Code + test locally
3. git push origin ccw/asrs-module
4. Create PR on GitHub
5. CodeRabbit auto-reviews
6. You fix feedback (if any)
7. Approve on GitHub (🟢 green light)
8. Merge to main (button click)

Automated from here:

9. GitHub Actions runs:
   ├─ Tests
   ├─ Lint
   ├─ TypeScript check
   ├─ Security scan (Snyk)
   └─ Build

10. If all green: Vercel deploys
    ├─ Build artifacts
    ├─ Update DNS
    └─ Deploy to production (2 min)

11. Monitoring kicks in:
    ├─ Sentry error tracking
    ├─ Vercel analytics
    ├─ Database metrics
    └─ Alerts if > 1% error rate

RESULT: New code is live in 5-10 minutes from merge
```

---

## 7. TROUBLESHOOTING: WHAT TO DO IF SOMETHING BREAKS

### **P0 (Critical — fixes immediately)**

```
Scenario: Production error rate >1% (error dashboard)

1. Check Sentry dashboard
   └─ Identify which endpoint is failing

2. Check Vercel deployment log
   └─ Did the deploy actually work?
   └─ Any new errors in build?

3. Check database (Supabase)
   └─ Is DB still responsive?
   └─ Any RLS policy issues?

4. If clear root cause:
   └─ Hotfix on develop branch
   └─ Test locally
   └─ Create PR + merge (fast-track)
   └─ Verify Sentry clears up

5. If not clear:
   └─ Revert last merge: git revert [commit]
   └─ Push to main (Vercel auto-deploys rollback)
   └─ Error rate drops
   └─ Investigate in develop branch (post-incident)

TIMELINE: Identify + fix/rollback: 15 min max
```

### **P1 (High — fixes within 24 hours)**

```
Scenario: Test failure, or performance regression

1. Read test output
   └─ Most bugs are obvious from the test error

2. If obvious:
   └─ Fix code
   └─ Test locally
   └─ Create PR

3. If not obvious:
   └─ Add debug logging
   └─ Run test with verbose output
   └─ Find root cause
   └─ Fix + test

4. Post fix:
   └─ Add regression test (prevent same bug later)
   └─ Create PR with test + fix
   └─ Review + merge

TIMELINE: Most P1s fixed within 4 hours
```

---

## 8. MONITORING & METRICS (What We Watch)

### **Real-time Dashboard**

Every agent checks these daily:

| Metric | Target | Alert Threshold |
|--------|--------|---|
| Error Rate | <0.5% | >1% → P0 |
| FCP (First Contentful Paint) | <2 sec | >3 sec → investigate |
| API Response Time (p95) | <500 ms | >1 sec → investigate |
| Test Coverage | ≥80% | <75% → PR blocked |
| Uptime | 99.5% | <99% → P0 |
| Deploy Frequency | Daily | >3 days → review |

### **Weekly Metrics Review**

Every Friday:
- New bugs: how many, how severe?
- Performance trends: improving or degrading?
- Test coverage: stable or declining?
- User feedback: any patterns?
- Deployment frequency: sustainable?

---

## 9. PREVENTING BUGS BEFORE THEY HAPPEN

### **The 5 Most Common Bugs (and how we prevent them)**

| Bug | Prevention | Test |
|-----|-----------|------|
| **RLS policy blocks users** | Always test multi-user access | `test('User A can't read User B's data')` |
| **Missing null checks** | TypeScript strict + type guards | `expect(() => fn(null)).toThrow()` |
| **API timeout with no fallback** | Add timeout + fallback | `test('Claude API timeout uses static response')` |
| **Data not persisted to DB** | Test roundtrip (save → load) | `expect(await load()).toEqual(saved)` |
| **Email sent to wrong address** | Mock and verify email calls | `expect(mockSendEmail).toHaveBeenCalledWith('correct@email.com')` |

---

## 10. FINAL WORKFLOW SUMMARY

```
┌─────────────────────────────────────────────────────┐
│ MORNING: 30 MIN CONTEXT                            │
├─────────────────────────────────────────────────────┤
│ - Read CLAUDE.md (5 min)                            │
│ - Read feature spec (5 min)                         │
│ - Read TEST-FIRST.md (5 min)                        │
│ - Check GitHub issues assigned to you (10 min)     │
│ - Check Sentry for new errors (5 min)              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ DEVELOPMENT: RED → GREEN → REFACTOR                │
├─────────────────────────────────────────────────────┤
│ - Write test for feature                            │
│ - pnpm test → FAIL (RED)                           │
│ - Write code to pass test                           │
│ - pnpm test → PASS (GREEN)                         │
│ - Refactor for clarity                              │
│ - pnpm test → PASS (REFACTOR)                      │
│ - pnpm lint, pnpm typecheck                         │
│ - Manual test on localhost                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ REVIEW & DEPLOY                                     │
├─────────────────────────────────────────────────────┤
│ - git push → GitHub PR                              │
│ - CodeRabbit auto-reviews                           │
│ - Fix feedback (if any)                             │
│ - Merge to main                                     │
│ - GitHub Actions tests                              │
│ - Vercel deploys                                    │
│ - Monitor Sentry 24 hr                              │
│ - Update CLAUDE.md with progress                    │
└─────────────────────────────────────────────────────┘

✅ ZERO BUGS, ZERO TROUBLESHOOTING, FAST DELIVERY
```

---

**END DEVELOPMENT.md**
