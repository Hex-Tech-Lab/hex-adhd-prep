# 10X ARCHITECTURE CRITIQUE — HEX-ADHD-PREP FOLDER STRUCTURE
**Date:** 2026-05-02  
**Status:** Pre-build critique (permanent decisions made now)

---

## WHAT'S RIGHT (KEEP AS-IS)

✅ **API-first structure**
- `/apps/web/app/api/*` routes are first-class citizens (not afterthought)
- Clear separation: `/app` (pages) vs `/app/api` (endpoints)
- RPC-style routes (no REST bloat) — matches Supabase best practices

✅ **Specs as source of truth**
- `/packages/specs/adhd/*` is the **single source of truth**
- YAML format (not SaaS, not OpenSpec — Council decision locked)
- Codegen scripts read specs, generate types + logic + API
- Version-controlled, auditable, git-native

✅ **Shared logic pattern**
- `/packages/logic/` (scoring, validation) — shared across web + mobile
- `/packages/types/` (generated) — shared TypeScript types
- `/packages/ui/` (components) — reusable across platforms
- **Perfect for Expo later** (minimal duplicate code)

✅ **Turborepo + monorepo structure**
- Clean `/apps` (web, mobile, api) separation
- `/packages` for shared code
- `turbo.json` for parallelization + caching
- Scales to 3+ apps without chaos

✅ **GitHub workflows (CI/CD)**
- Linting, testing, security scanning, auto-deploy
- Code review gates (CodeRabbit, Snyk)
- All locked in `.github/workflows/`

✅ **Database-as-code (Supabase migrations)**
- `/supabase/migrations/` with version control
- RLS policies + procedures in SQL
- Reproducible, auditable, reversible

✅ **Docs + Scripts**
- `/docs/*` — architecture, API, schema, contributing
- `/scripts/*` — codegen pipeline, validation
- Automation-first, not manual

---

## WHAT NEEDS OPTIMIZATION (10X CRITIQUES)

### **CRITIQUE #1: Missing `/packages/api-client`**

**Problem:** Frontend will call API routes, but there's no shared API client.

**Current state:**
```
/apps/web/app/api/*     ← API routes
/apps/web/components/*  ← Components call fetch directly?
```

**Risk:** 
- Duplicate fetch logic across web + mobile
- Type safety lost (no TypeScript validation of API calls)
- No DRY principle for API consumption

**Fix:** Add `/packages/api-client`

```
/packages/api-client/
  ├── index.ts
  ├── assessments.ts      # assessment endpoints
  ├── interview.ts        # interview endpoints
  ├── auth.ts             # auth endpoints
  ├── __tests__/
  ├── package.json
  └── tsconfig.json

// Usage:
import { assessmentClient } from '@hex/api-client';
const result = await assessmentClient.submitASRS(responses);
```

**10X impact:** Eliminates fetch boilerplate, ensures type safety, enables web + mobile code reuse.

---

### **CRITIQUE #2: Missing testing infrastructure at root**

**Problem:** Jest config is scattered (in `/apps/web/jest.config.js`). Hard to run tests across monorepo.

**Current state:**
```
jest.config.js        (individual app)
```

**Risk:**
- Can't run `pnpm test` at root to test everything
- Coverage reports fragmented
- CI/CD has to know about each app's test config

**Fix:** Add shared Jest config at root

```
jest.config.js        (root, orchestrates all)
jest.preset.js        (root, shared preset)

turbo.json:
  "test": {
    "outputs": ["coverage/**"],
    "cache": false
  }

pnpm test → runs all tests in parallel via Turborepo
pnpm test --coverage → unified coverage report
```

**10X impact:** Single source of truth for testing. Fast parallel test runs.

---

### **CRITIQUE #3: Missing `/packages/hooks` (React hooks)**

**Problem:** Components will need custom hooks (useASRS, useAuth, etc.). Where do they live?

**Current state:**
```
/apps/web/components/* 
```

**Risk:**
- Hooks are embedded in components (not reusable)
- Mobile app can't reuse hooks
- Hooks logic mixed with UI logic

**Fix:** Add `/packages/hooks`

```
/packages/hooks/
  ├── useAuth.ts          # Auth context hook
  ├── useAssessment.ts    # Assessment state management
  ├── useClaudeAPI.ts     # Claude API integration
  ├── __tests__/
  ├── package.json
  └── tsconfig.json
```

**Web usage:**
```
import { useAssessment } from '@hex/hooks';
export function ASRSForm() {
  const { submitResponse } = useAssessment();
  ...
}
```

**Mobile usage (Expo):**
```
Same import, works identically.
```

**10X impact:** Hooks are a first-class abstraction. Shared across platforms. Testable in isolation.

---

### **CRITIQUE #4: Missing `/packages/config` (constants, validation schemas)**

**Problem:** Constants (ASRS item weights, risk thresholds, etc.) are scattered or hardcoded.

**Current state:**
```
const RISK_THRESHOLD = 3.5;  // Hardcoded in scoring.ts
```

**Risk:**
- Constants scattered across codebase
- If you need to change a threshold, you search + replace (fragile)
- API validation schemas not shared between frontend + backend

**Fix:** Add `/packages/config`

```
/packages/config/
  ├── constants.ts        # ASRS weights, thresholds, etc.
  ├── schemas.ts          # Zod validation schemas (API input validation)
  ├── errors.ts           # Error codes and messages
  ├── index.ts
  ├── package.json
  └── tsconfig.json

// Usage:
import { RISK_THRESHOLDS, schemas } from '@hex/config';

// In API route:
const validated = schemas.assessmentInput.parse(req.body);

// In frontend:
import { schemas } from '@hex/config';
const data = schemas.assessmentInput.parse(formData);
```

**10X impact:** Single source of truth for business logic constants. Type-safe validation everywhere.

---

### **CRITIQUE #5: Database schema in root `/supabase`, not in `/packages`**

**Problem:** Database is a "package" (shared resource), but it's at root level.

**Current state:**
```
/supabase/migrations/
```

**Better state:**
```
/packages/database/
  ├── migrations/
  ├── rls-policies/
  ├── seed.sql
  ├── schema.md
  └── package.json
```

**10X impact:** Database is treated as a package (more composable). Easier to document, version, migrate.

---

### **CRITIQUE #6: Missing `pnpm-workspace.yaml` definition**

**Problem:** Workspace dependencies are implicit. Hard for new engineers to understand.

**Fix:** Add explicit `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'supabase'     # If treating as package

catalog:
  dependencies:
    react: 18.3.1
    next: 15.1.0
    typescript: 5.3.3
    tailwindcss: 3.4.1
```

**10X impact:** Monorepo structure is explicit + documented. Easier to onboard.

---

### **CRITIQUE #7: Missing `tsconfig.json` path mappings**

**Problem:** Imports are long: `import { Button } from '../../../packages/ui/components'`

**Fix:** Add path mappings to root `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@hex/ui": ["packages/ui"],
      "@hex/types": ["packages/types"],
      "@hex/logic": ["packages/logic"],
      "@hex/hooks": ["packages/hooks"],
      "@hex/config": ["packages/config"],
      "@hex/api-client": ["packages/api-client"],
      "@hex/specs": ["packages/specs"]
    }
  }
}
```

**Usage:**
```typescript
import { Button } from '@hex/ui';
import { useAssessment } from '@hex/hooks';
import { RISK_THRESHOLDS } from '@hex/config';
```

**10X impact:** Shorter, cleaner imports. Easier to refactor packages.

---

### **CRITIQUE #8: API routes need consistent error handling + middleware**

**Problem:** Each API route has to handle auth, validation, error handling. Boilerplate.

**Fix:** Add `/apps/web/middleware.ts` + `/apps/web/lib/api-utils.ts`

```typescript
// middleware.ts
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization');
  if (!token && request.nextUrl.pathname.startsWith('/api/')) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Continue...
}
```

```typescript
// lib/api-utils.ts
export async function handler<T>(
  req: NextRequest,
  fn: (req: NextRequest) => Promise<T>
) {
  try {
    const result = await fn(req);
    return NextResponse.json(result);
  } catch (error) {
    // Unified error handling
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Usage in API route:
export async function POST(req: NextRequest) {
  return handler(req, async (req) => {
    const data = await req.json();
    // Your logic
    return result;
  });
}
```

**10X impact:** DRY API code. Consistent error handling. Middleware layer.

---

### **CRITIQUE #9: Missing `.env` structure documentation**

**Problem:** Engineers don't know what env vars are needed.

**Fix:** Detailed `.env.example`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Claude API
ANTHROPIC_API_KEY=xxxxx

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# See docs/ENVIRONMENT.md for full details
```

**10X impact:** Clear setup instructions. No "why is this failing?" moments.

---

### **CRITIQUE #10: Performance optimization layer missing**

**Problem:** No caching strategy defined. API calls will be slow.

**Fix:** Add `/packages/cache` (Upstash Redis wrapper)

```
/packages/cache/
  ├── redis.ts            # Redis client init
  ├── keys.ts             # Cache key constants
  ├── strategies.ts       # Caching strategies (TTL, invalidation)
  ├── __tests__/
  ├── package.json
  └── tsconfig.json

// Usage:
import { cache } from '@hex/cache';
const questions = await cache.get('adhd-questions', 
  () => fetchQuestionsFromDB(), 
  { ttl: 3600 }  // 1 hour
);
```

**10X impact:** Caching is not an afterthought. Performance is built-in.

---

## FINAL STRUCTURE (10X OPTIMIZED)

```
hex-adhd-prep/
├── apps/
│   ├── web/
│   ├── mobile/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/           (GENERATED FROM SPECS)
│   ├── logic/           (GENERATED FROM SPECS)
│   ├── specs/           (YAML — SOURCE OF TRUTH)
│   ├── agent/           (Unified Dev Agent)
│   ├── api-client/      (NEW: Shared API client)
│   ├── hooks/           (NEW: Shared React hooks)
│   ├── config/          (NEW: Constants + schemas)
│   ├── cache/           (NEW: Redis wrapper)
│   ├── database/        (MOVED: /supabase → /packages/database)
│   └── eslint-config/
│
├── docs/
├── scripts/
├── supabase/            (Legacy, move to /packages/database)
├── .github/workflows/
│
├── tsconfig.json        (WITH PATH MAPPINGS)
├── turbo.json           (WITH TEST TASK)
├── pnpm-workspace.yaml  (EXPLICIT WORKSPACE)
├── jest.config.js       (ROOT JEST CONFIG)
├── CLAUDE.md            (ALWAYS READ FIRST)
└── README.md
```

---

## IMPLEMENTATION ORDER (WEEK 1)

**Day 1:**
- [ ] Create base structure (folders above)
- [ ] Initialize root `package.json`, `tsconfig.json`, `turbo.json`, `pnpm-workspace.yaml`
- [ ] Push to GitHub

**Day 2:**
- [ ] Set up CI/CD (GitHub Actions)
- [ ] Create shared Jest config
- [ ] Create `/packages/specs` with YAML examples

**Day 3:**
- [ ] Create `/packages/config` (constants, Zod schemas)
- [ ] Create `/packages/api-client`
- [ ] Create `/packages/hooks`

**Day 4:**
- [ ] Initialize `/apps/web` (Next.js scaffolding)
- [ ] Set up Tailwind + shadcn

**Day 5:**
- [ ] Deploy skeleton to Vercel
- [ ] Health check endpoints
- [ ] Ready for feature work

---

## FROZEN DECISIONS

These cannot change:
- ✅ Turborepo + monorepo structure
- ✅ YAML specs in `/packages/specs`
- ✅ Spec → code generation pipeline
- ✅ API-first design
- ✅ Shared packages (logic, types, hooks, config)
- ✅ Path mappings for clean imports

---

**READY TO BUILD. All 10X critiques incorporated above.**

