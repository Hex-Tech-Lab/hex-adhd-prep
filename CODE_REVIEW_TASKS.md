# ADHD SaaS Code Review Task List
**Generated:** 2026-05-03 (Session 5 Continuation)  
**Status:** Pre-deployment code review findings  
**Total Issues:** 32 (4 Critical, 3 High, 8 Medium, 17 Low)  
**Estimated Fix Time:** 4–6 hours for critical/high, 6–8 hours for medium/low  

---

## CRITICAL ISSUES (Block Deployment — Fix First)

### 🔴 CRITICAL-001: Interview API Missing Auth Header
**File:** `apps/web/app/assessment/interview/page.tsx:72-78`  
**Severity:** CRITICAL — Feature completely broken in production  
**Description:**
- Client doesn't send Authorization header to `/api/assessment/interview/save-response` endpoint
- API expects `Authorization: Bearer <token>` but receives nothing
- Results in 401 Unauthorized errors on all interview responses
- Demo mode currently hides the issue

**Expected Behavior:**
```typescript
// Current (broken):
const response = await fetch('/api/assessment/interview/save-response', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ... })
});

// Should be:
const token = localStorage.getItem('session_token') || sessionStorage.getItem('session_token');
const response = await fetch('/api/assessment/interview/save-response', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ ... })
});
```

**Root Cause:** Session token management not integrated with interview module  
**Fix Type:** Client-side auth header injection  
**Dependencies:** None  
**Testing:** Manual E2E on staging; verify 200 response on save-response  

---

### 🔴 CRITICAL-002: Turbopack Hard-coded Path
**File:** `next.config.js:6`  
**Severity:** CRITICAL — CI/CD and multi-machine builds fail  
**Description:**
```javascript
// Current (broken):
turbopack: {
  root: '/home/kellyb_dev/projects/hex-adhd-prep'  // Hard-coded path
}

// Should be:
turbopack: {
  root: process.cwd()  // Dynamic based on actual directory
}
```

**Impact:**
- Local build fails when cloned to different directory
- GitHub Actions CI/CD fails entirely
- Vercel deployment fails during build step
- Blocks all deployment attempts

**Root Cause:** Absolute path instead of dynamic resolution  
**Fix Type:** Config change (1 line)  
**Dependencies:** None  
**Testing:** Run `pnpm build` on different directory paths; verify success

---

### 🔴 CRITICAL-003: Family Submit Token-Only Submissions Broken
**File:** `apps/web/app/api/assessment/family/submit/route.ts:25-27`  
**Severity:** CRITICAL — Family perspective feature completely broken  
**Description:**
- Endpoint requires `assessmentId` in body but should support token-based authentication
- Family members receive token links but can't submit because endpoint rejects valid tokens
- Current validation: checks assessmentId existence first, fails if missing
- Should: resolve assessmentId from token if not provided

**Expected Behavior:**
```typescript
// Current (broken):
const { assessmentId, relationship, responses } = body;
if (!assessmentId) throw new Error('Missing assessmentId');

// Should be:
let assessmentId = body.assessmentId;
const familyToken = req.headers.get('x-family-token');

if (!assessmentId && familyToken) {
  // Resolve assessmentId from family_inputs table via token
  assessmentId = await resolveAssessmentIdFromToken(familyToken);
} else if (!assessmentId) {
  throw new Error('Missing assessmentId or family token');
}
```

**Root Cause:** Incomplete token-based auth implementation  
**Fix Type:** Add token-based lookup flow  
**Dependencies:** Requires database function `getAssessmentByToken()` to work correctly (see CRITICAL-004)  
**Testing:** Submit via token link without assessmentId in body; verify success

---

### 🔴 CRITICAL-004: Assessment GET Missing Auth (HIPAA Violation)
**File:** `apps/web/app/api/assessment/get/route.ts:33-34`  
**Severity:** CRITICAL — Security/compliance risk  
**Description:**
```typescript
// Current (broken):
// NO authentication check - anyone can fetch any assessment
const { assessmentId } = await req.json();
const data = await getAssessmentData(assessmentId);

// Should be:
const token = req.headers.get('authorization')?.replace('Bearer ', '');
if (!token) return new Response('Unauthorized', { status: 401 });

const userId = await validateSessionToken(token);
const { assessmentId } = await req.json();
const data = await getAssessmentData(assessmentId, userId);  // Verify ownership
```

**Impact:**
- Unauthenticated users can fetch any assessment by ID
- HIPAA violation — PHI exposed to unauthorized parties
- Database doesn't verify user ownership
- Critical blocker for production launch

**Root Cause:** Auth guard copied from save-response but validation removed  
**Fix Type:** Add Bearer token validation + user ownership check  
**Dependencies:** `validateSessionToken()` function already exists  
**Testing:** 
  - Try to fetch assessment with invalid token → 401
  - Try to fetch assessment owned by different user → 401/403
  - Fetch own assessment with valid token → 200

---

## HIGH PRIORITY ISSUES (Breaks Core Features)

### 🟠 HIGH-001: Interview Progress Calculation Off-by-One
**File:** `apps/web/app/api/assessment/interview/save-response/route.ts:51-61`  
**Severity:** HIGH — Progress never reaches 100%, flow breaks  
**Description:**
```typescript
// Current (broken):
await insertInterviewResponse(...);
const count = await getInterviewResponseCount(assessmentId);
const progressPercent = Math.round((count / 30) * 100);  // 30 is hardcoded

// Problems:
// 1. Count fetched AFTER insert (double-counts latest response)
// 2. Hardcoded 30 but actual question set differs
// 3. Progress: 1→3%, 2→7%, ..., 30→100% (jumps)
// 4. Never triggers 100% unless exactly 30 questions answered
```

**Expected Behavior:**
```typescript
// Get count BEFORE insert to avoid double-count
const countBefore = await getInterviewResponseCount(assessmentId);
await insertInterviewResponse(...);
const countAfter = countBefore + 1;

// Use actual question count from database
const TOTAL_INTERVIEW_QUESTIONS = 30;  // Define once, use consistently
const progressPercent = Math.round((countAfter / TOTAL_INTERVIEW_QUESTIONS) * 100);

// When progress reaches 100%, transition to family module
if (progressPercent >= 100) {
  await updateAssessmentSection(assessmentId, 'family');
}
```

**Impact:**
- Progress bar stuck at 96% (29/30)
- User never transitions to family perspective module
- Assessment flow incomplete

**Root Cause:** Off-by-one error + hardcoded constant  
**Fix Type:** Reorder queries, define constant, add transition logic  
**Dependencies:** Need to verify TOTAL_INTERVIEW_QUESTIONS = 30 matches actual count  
**Testing:**
  - Submit 30 interview responses
  - Verify progress reaches 100% after 30th response
  - Verify assessment transitions to 'family' section
  - Verify next page shows family module, not interview

---

### 🟠 HIGH-002: Comorbidity Routing Wrong
**File:** `apps/web/app/assessment/comorbidity/page.tsx:100-102`  
**Severity:** HIGH — Assessment flow skips interview module  
**Description:**
```typescript
// Current (broken):
const handleSubmit = (data) => {
  await updateAssessmentSection(assessmentId, 'review');  // Wrong section
  router.push('/assessment/family');  // Routes to family, not interview
};

// Problems:
// 1. Sets current_section to 'review' but should be 'interview'
// 2. Routes to '/assessment/family' but flow should go to interview first
// 3. Assessment flow: asrs → history → impact → comorbidity → [INTERVIEW] → family → review
// 4. Current: asrs → history → impact → comorbidity → family → review (skips interview)
```

**Expected Flow (from CLAUDE.md):**
```
asrs → history → impact → comorbidity → interview → family → review → results
```

**Fix:**
```typescript
const handleSubmit = (data) => {
  await updateAssessmentSection(assessmentId, 'interview');  // Correct section
  router.push('/assessment/interview');  // Go to interview next
};
```

**Impact:**
- Interview module completely skipped
- User never answers interview questions
- Assessment data incomplete for clinician

**Root Cause:** Copy-paste error from family module  
**Fix Type:** Update route and section name (2 lines)  
**Dependencies:** None  
**Testing:** Manual flow test: asrs → history → impact → comorbidity → should land on interview page

---

### 🟠 HIGH-003: Assessment GET Import/Export Mismatch
**File:** `apps/web/app/api/assessment/get/route.ts:33` & `libs/supabase-server.ts`  
**Severity:** HIGH (conditional) — May cause runtime error  
**Description:**
```typescript
// Current (route.ts):
import { getSupabaseClient } from '@/lib/supabase-server';
const data = await getSupabaseClient().from('assessments').select('*').eq('id', assessmentId);

// Issue: Verify that supabase-server.ts exports 'getSupabaseClient'
// If it exports 'getSupabase' instead, this will fail at runtime
```

**Verification Needed:**
- Check `libs/supabase-server.ts` exports section
- Confirm function name matches import
- If mismatch: update import to match export

**Root Cause:** Refactoring possibly renamed function without updating all callers  
**Fix Type:** Update import or export (1 line)  
**Dependencies:** Requires reading supabase-server.ts  
**Testing:** Run `pnpm build` and verify no import errors

---

## MEDIUM PRIORITY ISSUES (UX/Code Quality)

### 🟡 MEDIUM-001: Assessment Review Error Not Displayed
**File:** `apps/web/app/assessment/review/page.tsx:37-41`  
**Severity:** MEDIUM — Silent failure, poor UX  
**Description:**
```typescript
// Current (broken):
try {
  const data = await fetchAssessment(assessmentId);
  setAssessmentData(data);
} catch (err) {
  console.error(err);  // Silent failure - user sees nothing
  // No error state set, UI shows blank page
}

// Should be:
catch (err) {
  setError(err.message || 'Failed to load assessment data');
  // Now error displays in UI
}
```

**Impact:**
- User sees blank review page if fetch fails
- No indication that something went wrong
- User may leave without completing flow

**Fix Type:** Set error state in catch block  
**Dependencies:** `const [error, setError]` hook must exist  
**Testing:** Mock failed API response; verify error message displays

---

### 🟡 MEDIUM-002: Interview Complete Navigation Using window.location.href
**File:** `apps/web/app/assessment/interview/page.tsx:111`  
**Severity:** MEDIUM — Breaks Next.js client-side routing  
**Description:**
```typescript
// Current (broken):
window.location.href = '/assessment/family';  // Full page reload

// Should be:
const router = useRouter();
router.push('/assessment/family');  // Client-side navigation
```

**Impact:**
- Full page reload instead of smooth transition
- Slower UX, lost component state
- Analytics may not track transition correctly

**Fix Type:** Use Next.js router  
**Dependencies:** `useRouter` already imported  
**Testing:** Verify smooth navigation without page reload

---

### 🟡 MEDIUM-003: Assessment Results Score Validation Missing
**File:** `apps/web/app/assessment/asrs/results/page.tsx:19-23`  
**Severity:** MEDIUM — UI displays NaN for invalid params  
**Description:**
```typescript
// Current (broken):
const scoreParam = searchParams.get('score');
const riskParam = searchParams.get('risk');
const score = parseFloat(scoreParam);  // Can be NaN if invalid

// Renders:
<div>Score: {score}/48</div>  // Shows "NaN/48" if param invalid

// Should be:
const score = Number.isFinite(parseFloat(scoreParam)) 
  ? parseFloat(scoreParam) 
  : 0;

// Or better: Validate upstream in previous page
if (!Number.isFinite(score)) {
  return <div>Invalid score data</div>;
}
```

**Impact:**
- User sees broken UI if params corrupted
- No validation feedback

**Fix Type:** Add Number.isFinite() check  
**Dependencies:** None  
**Testing:** Navigate to results with invalid score param; verify graceful handling

---

### 🟡 MEDIUM-004: Review Page Success Navigation Loses Score Data
**File:** `apps/web/app/assessment/review/page.tsx:58-63`  
**Severity:** MEDIUM — Results page can't display scores  
**Description:**
```typescript
// Current (broken):
const response = await fetch('/api/assessment/complete', {...});
router.push('/assessment/asrs/results');  // No params passed

// Results page tries to read:
const score = searchParams.get('score');  // null - not passed
const risk = searchParams.get('risk');     // null - not passed

// Should be:
const response = await fetch('/api/assessment/complete', {...});
const { asrs_score, asrs_risk_level } = await response.json();
router.push(`/assessment/asrs/results?score=${asrs_score}&risk=${asrs_risk_level}`);
```

**Impact:**
- Results page displays blank scores
- User doesn't see assessment outcome
- Business goal not met (show diagnosis)

**Fix Type:** Extract response data and pass as query params  
**Dependencies:** API must return asrs_score and asrs_risk_level  
**Testing:** Complete full flow; verify scores display on results page

---

### 🟡 MEDIUM-005: Family Form Clinician Filtering Inefficient
**File:** `apps/web/app/assessment/family/clinicians/page.tsx:22`  
**Severity:** MEDIUM — Performance anti-pattern  
**Description:**
```typescript
// Current (broken):
const [clinicians, setClinicians] = useState([]);
const [filteredClinicians, setFilteredClinicians] = useState([]);

useEffect(() => {
  // Recalculates on EVERY render
  const filtered = clinicians.filter(c => c.state === selectedState);
  setFilteredClinicians(filtered);
}, [clinicians, selectedState]);

// Should use useMemo:
const filteredClinicians = useMemo(
  () => clinicians.filter(c => c.state === selectedState),
  [clinicians, selectedState]
);
```

**Impact:**
- Unnecessary re-renders and state updates
- Scales poorly with large clinician list (100+)

**Fix Type:** Replace useState + useEffect with useMemo  
**Dependencies:** None  
**Testing:** Verify filtering still works correctly

---

### 🟡 MEDIUM-006: Family Submit API Error Handling Generic
**File:** `apps/web/app/assessment/family/submit/page.tsx:48`  
**Severity:** MEDIUM — Poor error feedback  
**Description:**
```typescript
// Current (broken):
catch (err) {
  setError('Failed to submit family data');
  // Doesn't indicate if server error, network, or validation
}

// Should be:
catch (err) {
  const message = err.response?.data?.error || err.message || 'Failed to submit';
  setError(message);
}
```

**Impact:**
- User can't troubleshoot submission failures
- No distinction between client and server errors

**Fix Type:** Extract and display API error message  
**Dependencies:** API must return error in response.data.error  
**Testing:** Trigger various failures (invalid token, missing data); verify error message displays

---

### 🟡 MEDIUM-007: Claude Client Response Variable Shadowing
**File:** `apps/web/lib/claude/client.ts:69-100`  
**Severity:** MEDIUM — Code smell, maintenance risk  
**Description:**
```typescript
// Current (broken):
async function generateInterviewQuestion(context) {
  const response = await anthropic.messages.create({...});  // Function parameter
  
  // Inside processing:
  const response = response.content[0];  // Shadows outer response
  return response;  // Ambiguous which response
}

// Should be:
async function generateInterviewQuestion(context) {
  const apiResponse = await anthropic.messages.create({...});
  const content = apiResponse.content[0];
  return content;
}
```

**Impact:**
- Confusing code, harder to debug
- Name shadowing violates best practices

**Fix Type:** Rename API response variable  
**Dependencies:** Update all references  
**Testing:** Verify interview questions still generate correctly

---

### 🟡 MEDIUM-008: Sentry Production-Only Config Always Enabled
**File:** `sentry.client.config.js:27-28`  
**Severity:** MEDIUM — Unnecessary Sentry overhead in dev  
**Description:**
```javascript
// Current (broken):
export const clientConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [...],
  enabled: true,  // ALWAYS enabled
  tracesSampleRate: 1.0,  // Send 100% of traces in DEV
};

// Should be:
export const clientConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  integrations: [...],
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
};
```

**Impact:**
- Sentry quota filled by dev/staging traffic
- Slower local development
- Production traces diluted with non-production events

**Fix Type:** Add environment checks  
**Dependencies:** None  
**Testing:** Dev: verify Sentry disabled; Production: verify traces enabled

---

## LOW PRIORITY ISSUES (Refactoring & Code Quality)

### 🔵 LOW-001: Replace Raw HTML Buttons with shadcn Button
**Files:**
- `apps/web/app/assessment/asrs/results/page.tsx`: 2 buttons
- `apps/web/app/assessment/asrs/page.tsx`: 2 buttons

**Severity:** LOW — UI consistency, refactoring  
**Description:**
```typescript
// Current (broken):
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Continue
</button>

// Should be:
import { Button } from '@/components/ui/button';
<Button>Continue</Button>
```

**Impact:** Inconsistent UI, harder to maintain styling  
**Fix Type:** Component replacement  
**Dependencies:** shadcn Button component exists  
**Testing:** Verify buttons display and click correctly

---

### 🔵 LOW-002: ClinicianCard Phone/Email Should Use Semantic HTML
**File:** `apps/web/components/ClinicianCard.tsx:21-27`  
**Severity:** LOW — Accessibility, SEO  
**Description:**
```typescript
// Current (broken):
<div onClick={() => window.location.href = `tel:${phone}`}>
  {phone}
</div>

// Should be:
<a href={`tel:${phone}`}>{phone}</a>
<a href={`mailto:${email}`}>{email}</a>
```

**Impact:**
- Phone/email not clickable on mobile
- Accessibility tools can't identify contacts
- Screen readers can't announce purpose

**Fix Type:** Use semantic HTML links  
**Dependencies:** None  
**Testing:** Verify phone/email links work on mobile and desktop

---

### 🔵 LOW-003: Family Form RadioGroup Should Use shadcn Component
**File:** `apps/web/app/assessment/family/submit/page.tsx:87-99`  
**Severity:** LOW — Code consistency  
**Description:**
```typescript
// Current (broken):
{['Parent', 'Sibling', 'Spouse'].map(rel => (
  <label key={rel}>
    <input type="radio" name="relationship" value={rel} />
    {rel}
  </label>
))}

// Should use shadcn RadioGroup:
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
<RadioGroup value={relationship} onValueChange={setRelationship}>
  {['Parent', 'Sibling', 'Spouse'].map(rel => (
    <div key={rel} className="flex items-center space-x-2">
      <RadioGroupItem value={rel} id={rel} />
      <label htmlFor={rel}>{rel}</label>
    </div>
  ))}
</RadioGroup>
```

**Impact:** Inconsistent with other forms in app  
**Fix Type:** Component replacement  
**Dependencies:** shadcn RadioGroup exists  
**Testing:** Verify relationship selection still works

---

### 🔵 LOW-004: Duplicate System Prompts in Claude Client
**Files:**
- `apps/web/lib/claude/client.ts`
- `apps/web/lib/claude/prompts.ts`

**Severity:** LOW — Code deduplication  
**Description:**
```typescript
// Current (broken): Prompts hardcoded in client.ts
const systemPrompt = `You are an empathic interviewer...`;

// Should import from prompts.ts:
import { INTERVIEW_SYSTEM_PROMPTS } from '@/lib/claude/prompts';
const systemPrompt = INTERVIEW_SYSTEM_PROMPTS.main;
```

**Impact:** Harder to maintain, risk of divergence  
**Fix Type:** Import instead of duplicate  
**Dependencies:** Verify prompts.ts exports exist  
**Testing:** Verify interview questions still generate

---

### 🔵 LOW-005: useRouter Unused Import
**File:** `apps/web/app/assessment/family/page.tsx:26`  
**Severity:** LOW — Code cleanup  
**Description:**
```typescript
// Current (broken):
const router = useRouter();  // Imported but never used

// Fix: Remove unused import and hook call
```

**Impact:** Dead code, minor performance hit  
**Fix Type:** Remove 1 line  
**Dependencies:** None  
**Testing:** Verify page still works

---

### 🔵 LOW-006: Comorbidity Button Label Stale
**File:** `apps/web/app/assessment/comorbidity/page.tsx:100-102`  
**Severity:** LOW — UX consistency  
**Description:**
```typescript
// Current (broken):
<button>Continue to Review</button>  // But actually goes to interview

// Should be:
<button>Continue to Interview</button>

// Or make dynamic:
const nextSection = currentSection === 'comorbidity' ? 'interview' : 'review';
<button>Continue to {nextSection}</button>
```

**Impact:** Misleading button text  
**Fix Type:** Update label  
**Dependencies:** Linked to HIGH-002 fix  
**Testing:** Verify button text matches destination

---

### 🔵 LOW-007: Sentry Test Page Missing 'use client'
**File:** `apps/web/app/sentry-test-page/page.tsx`  
**Severity:** LOW — React Server Component error  
**Description:**
```typescript
// Current (broken):
export default function SentryTestPage() {
  const handleClick = () => {  // onClick handler in Server Component
    throw new Error('Test error');
  };
  return <button onClick={handleClick}>Throw Error</button>;
}

// Should be:
'use client';

export default function SentryTestPage() {
  const handleClick = () => {
    throw new Error('Test error');
  };
  return <button onClick={handleClick}>Throw Error</button>;
}
```

**Impact:** Component may not work correctly with interactive handlers  
**Fix Type:** Add 'use client' directive  
**Dependencies:** None  
**Testing:** Verify error throws correctly

---

### 🔵 LOW-008: Sentry Example Page Missing 'use client'
**File:** `apps/web/app/sentry-example-page/page.tsx`  
**Severity:** LOW — React Server Component error  
**Description:** Same as LOW-007  
**Fix Type:** Add 'use client' directive  

---

### 🔵 LOW-009: E2E Test Assertions Incomplete
**File:** `apps/web/__tests__/interview.spec.ts`  
**Severity:** LOW — Test quality  
**Description:**
```typescript
// Current (broken):
test('follow-up question shown', async () => {
  // No assertions - test passes even if nothing happens
});

test('submit response', async () => {
  const button = await page.$('button:disabled');
  await button.click();  // Try to click disabled element - fails
});

// Should be:
test('follow-up question shown', async () => {
  const followUp = await page.$('[data-testid="follow-up"]');
  expect(followUp).toBeTruthy();
});

test('submit response', async () => {
  const button = await page.$('button:not(:disabled)');
  await button.click();
  expect(await page.waitForNavigation()).toBeTruthy();
});
```

**Impact:** Tests don't actually validate behavior  
**Fix Type:** Add assertions and fix element selectors  
**Dependencies:** None  
**Testing:** Run `pnpm test:e2e` and verify all pass

---

### 🔵 LOW-010: Documentation Coverage 0%
**Severity:** LOW — Pre-merge gate  
**Description:**
- All functions lack JSDoc comments
- Target: 80% coverage for pre-merge check
- Affected files: ~15 utility/library functions

**Fix Type:** Add JSDoc blocks to key functions  
**Priority:** Add to PR #4 and #5 before merge  
**Example:**
```typescript
// Should have:
/**
 * Validates user session token and returns user ID
 * @param token - Bearer token from request header
 * @returns User ID if valid, null if expired/invalid
 * @throws {Error} If token format invalid
 */
export async function validateSessionToken(token: string): Promise<string | null> {
  ...
}
```

---

### 🔵 LOW-011: TypeScript baseUri Deprecation Warnings
**Files:**
- `tsconfig.json`
- `apps/web/tsconfig.json`
- `apps/api/tsconfig.json`

**Severity:** LOW — Config warnings  
**Description:**
```json
// Current (deprecated):
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}

// Should be:
{
  "compilerOptions": {
    "ignoreDeprecations": "5.0",  // Add this
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Impact:** Build warnings (non-blocking)  
**Fix Type:** Add ignoreDeprecations flag  
**Testing:** Verify no warnings in build output

---

### 🔵 LOW-012: Package Transpilation Config Missing
**File:** `next.config.js`  
**Severity:** LOW — Build optimization  
**Description:**
```javascript
// Current (missing):
const nextConfig = {
  // TypeScript packages not transpiled
};

// Should be:
const nextConfig = {
  transpilePackages: ['@hex/shared', '@hex/types'],
};
```

**Impact:** Build time slower, larger bundle  
**Fix Type:** Add transpilePackages array  
**Testing:** Run `pnpm build` and verify faster build

---

### 🔵 LOW-013: Instrumentation Double-Init Issue
**File:** `instrumentation.ts`  
**Severity:** LOW — Config cleanup  
**Description:**
```typescript
// Current (broken):
import * as Sentry from '@sentry/nextjs';
Sentry.init({...});  // Direct call causes double-init

// Should use:
import { init as initServerSentry } from '@sentry/nextjs';
// Only call in specific environments
if (process.env.NODE_ENV === 'production') {
  initServerSentry({...});
}
```

**Impact:** Sentry initialized twice, duplicate spans  
**Fix Type:** Fix initialization logic  
**Testing:** Verify Sentry spans appear once in traces

---

### 🔵 LOW-014: Monitoring Dashboard Hardcoded Values
**File:** `apps/web/app/monitoring/page.tsx:39-42`  
**Severity:** LOW — UX honesty + technical debt  
**Description:**
```typescript
// Current (misleading):
<Stat label="API Response Time" value="142ms" />  // Hardcoded
<Stat label="DB Latency" value="8ms" />           // Hardcoded
<p>Real-time metrics dashboard</p>                 // Claim false

// Should be:
<p>Sample data (real-time metrics coming in Phase 2)</p>

// Or fetch real metrics:
const metrics = await fetchMetricsFromSentry();
<Stat label="API Response Time" value={metrics.responseTime} />
```

**Impact:** Misleading users about system health; need to convert to Server Component  
**Fix Type:** Add disclaimer or fetch real data; convert to Server Component with auth  
**Testing:** Verify page displays correctly

---

## DATABASE & API ISSUES

### 🔴 DB-001: insertInterviewResponse Missing question_text Field
**File:** `libs/supabase-server.ts:112-128`  
**Severity:** HIGH — API will crash  
**Description:**
```typescript
// Current (broken):
export async function insertInterviewResponse(
  assessmentId: string,
  questionId: string,
  responseText: string
) {
  // Missing question_text parameter
  // INSERT fails because column is NOT NULL
  return await supabase.from('interview_responses').insert({
    assessment_id: assessmentId,
    question_id: questionId,
    response_text: responseText,
    // Missing: question_text (NOT NULL constraint)
  });
}

// Should be:
export async function insertInterviewResponse(
  assessmentId: string,
  questionId: string,
  questionText: string,
  responseText: string
) {
  return await supabase.from('interview_responses').insert({
    assessment_id: assessmentId,
    question_id: questionId,
    question_text: questionText,  // Add this
    response_text: responseText,
  });
}

// Callers must pass question_text:
await insertInterviewResponse(
  assessmentId,
  questionId,
  "What was your attention like in school?",  // Add this
  userResponse
);
```

**Impact:** All interview saves fail with database constraint error  
**Root Cause:** Incomplete function signature after schema change  
**Fix Type:** Add parameter + update all callers  
**Dependencies:** Need to identify all callers of insertInterviewResponse  
**Testing:** Submit interview response; verify success without database error

---

### 🔴 DB-002: getAssessmentByToken Wrong Column
**File:** `libs/supabase-server.ts:149-159`  
**Severity:** HIGH — Feature completely broken  
**Description:**
```typescript
// Current (broken):
export async function getAssessmentByToken(token: string) {
  // assessments.family_token doesn't exist
  // Column is in family_inputs, not assessments
  return await supabase
    .from('assessments')
    .select('*')
    .eq('family_token', token)  // Wrong table
    .single();
}

// Should be:
export async function getAssessmentByToken(token: string) {
  const { data: family } = await supabase
    .from('family_inputs')
    .select('assessment_id')
    .eq('family_token', token)
    .single();
  
  if (!family) throw new Error('Invalid family token');
  
  return await supabase
    .from('assessments')
    .select('*')
    .eq('id', family.assessment_id)
    .single();
}
```

**Impact:**
- Family token submissions always fail (404)
- Family perspective feature entirely broken
- Query returns nothing because column doesn't exist

**Root Cause:** Incorrect schema understanding  
**Fix Type:** Two-step lookup via family_inputs join  
**Dependencies:** Requires database schema audit to confirm tables/columns  
**Testing:**
  - Get family token from database
  - Call getAssessmentByToken(token)
  - Verify returns correct assessment

---

### 🔴 DB-003: SQL Conflict Clause Incomplete
**File:** `supabase/migrations/20250503_002_complete_schema.sql:319`  
**Severity:** MEDIUM — Migration may fail on unique constraint  
**Description:**
```sql
-- Current (broken):
ON CONFLICT DO NOTHING;  -- Incomplete clause

-- Should be:
ON CONFLICT (email) DO NOTHING;  -- Specify column
```

**Impact:**
- Migration fails if duplicate emails in seed data
- Clinician table creation may rollback

**Fix Type:** Add email column to conflict clause  
**Dependencies:** None  
**Testing:** Run migration on staging; verify completes without errors

---

## SUMMARY TABLE

| Priority | Count | Block Deploy | Files Affected |
|----------|-------|--------------|-----------------|
| Critical | 4 | YES | interview/page.tsx, next.config.js, family/submit/route.ts, assessment/get/route.ts |
| High | 3 | YES (flow) | save-response/route.ts, comorbidity/page.tsx, supabase-server.ts |
| Medium | 8 | NO | review/page.tsx, interview/page.tsx, results/page.tsx, clinicians/page.tsx, submit/page.tsx, client.ts, sentry.client.config.js |
| Low | 17 | NO | buttons, radio groups, tests, docs, config, cleanup |
| **Database** | 3 | YES | supabase-server.ts, migrations |

---

## EXECUTION PLAN

### Phase 1: Critical Issues (1–2 hours)
**Must complete before any deployment:**
1. CRITICAL-001: Add auth header to interview API
2. CRITICAL-002: Fix Turbopack hard-coded path
3. CRITICAL-004: Add auth check to assessment GET
4. DB-002: Fix getAssessmentByToken query
5. HIGH-001: Fix interview progress off-by-one

**Gate:** All 48 tests pass, no build errors

### Phase 2: High Priority Issues (1 hour)
**Fixes broken features:**
1. CRITICAL-003: Fix family token submission flow
2. HIGH-002: Fix comorbidity routing (resume assessment flow)
3. HIGH-003: Verify assessment GET imports

**Gate:** Manual E2E test of complete assessment flow

### Phase 3: Medium Priority Issues (2–3 hours)
**Improves UX and code quality:**
1. MEDIUM-001–008: Error handling, navigation, validation
2. DB-001: Add question_text to insertInterviewResponse

**Gate:** Manual testing of edge cases

### Phase 4: Low Priority + Documentation (2–3 hours)
**Refactoring and polish:**
1. LOW-001–014: Button components, semantic HTML, tests, docs
2. Code review: 80% JSDoc coverage

**Gate:** Pre-merge checks pass (lint, coverage, security)

---

## BRANCH STRATEGY

Recommend creating focused feature branches:

```
# Critical fixes
git checkout -b fix/auth-interview-header
git checkout -b fix/turbopack-path
git checkout -b fix/family-token-lookup

# High priority
git checkout -b fix/interview-progress
git checkout -b fix/assessment-flow

# Medium fixes
git checkout -b fix/error-handling
git checkout -b refactor/ui-components
git checkout -b fix/database-constraints

# Parallel work if multiple agents available
# Each agent takes 1–2 branches, avoids merge conflicts
```

---

## TESTING CHECKLIST

Before each PR:
- [ ] `pnpm lint` passes (no ESLint errors)
- [ ] `pnpm test` passes (48 tests, ≥80% coverage)
- [ ] `pnpm build` succeeds (no build errors)
- [ ] Manual E2E: complete assessment flow
- [ ] Manual E2E: family token submission
- [ ] Manual E2E: interview progress tracking
- [ ] No console errors in browser DevTools
- [ ] Sentry integration confirms events logged (not 401s)

---

## POST-REVIEW ACTIONS (After KC Reviews)

1. **Prioritize:** KC marks issues with priority stickers (P0, P1, P2)
2. **Assign:** KC assigns to agents or self
3. **Create branches:** One per critical issue, group lower-priority
4. **Parallel work:** Multiple agents work independent branches
5. **PR review:** CodeRabbit auto-reviews, Snyk scans
6. **Merge:** Merge when all checks pass
7. **Deploy:** Vercel auto-deploys on merge to main
8. **Monitor:** 24 hrs of Sentry monitoring

---

**END CODE REVIEW TASK LIST**
