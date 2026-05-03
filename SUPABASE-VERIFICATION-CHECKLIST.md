# Supabase Setup Verification Checklist

**Use this checklist after following SUPABASE-SETUP.md to verify your setup is correct.**

---

## Phase 1: Account & Project Creation

- [ ] Supabase account created at supabase.com
- [ ] New project created named `hex-adhd-prep` (or similar)
- [ ] Region selected: Frankfurt (eu-central-1) or preferred region
- [ ] Project status is "Running" (visible in Supabase dashboard)
- [ ] Database password saved securely

---

## Phase 2: Credentials Collection

### Verify You Have:

- [ ] **Project URL** 
  - Format: `https://[something].supabase.co`
  - From: Settings → API → Project URL
  - Example: `https://abcd1234efgh5678.supabase.co`

- [ ] **Anon Key**
  - Format: starts with `eyJhbGc...` (JWT token)
  - From: Settings → API → "anon" key
  - Length: ~140 characters

- [ ] **Service Role Key**
  - Format: starts with `eyJhbGc...` (JWT token)
  - From: Settings → API → "service_role" key
  - Length: ~140 characters
  - ⚠️ Keep this PRIVATE (never commit to Git)

---

## Phase 3: Extensions & Migrations

### Extensions Enabled:

- [ ] `uuid-ossp` — Run in SQL Editor, verify no error
- [ ] `pgcrypto` — Run in SQL Editor, verify no error
- [ ] `vector` — Run in SQL Editor, verify no error

**Test:** In SQL Editor, run:
```sql
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'vector');
```
You should see 3 rows.

### Migration Applied:

- [ ] Migration file exists: `supabase/migrations/20250503_001_init_core.sql`
- [ ] Migration SQL executed in Supabase SQL Editor
- [ ] No error messages (all green checkmarks)
- [ ] Output shows: "Successfully executed 50+ commands"

---

## Phase 4: Tables & RLS

### Tables Created:

In Supabase → Table Editor, verify all 5 tables exist:

- [ ] `users`
- [ ] `assessments`
- [ ] `interview_responses`
- [ ] `family_inputs`
- [ ] `reports`

### Row Level Security (RLS) Enabled:

For each table, click → RLS tab:

- [ ] `users` — RLS toggle is GREEN (ON)
- [ ] `assessments` — RLS toggle is GREEN (ON)
- [ ] `interview_responses` — RLS toggle is GREEN (ON)
- [ ] `family_inputs` — RLS toggle is GREEN (ON)
- [ ] `reports` — RLS toggle is GREEN (ON)

**If any toggle is RED:** Click it to enable RLS.

---

## Phase 5: Environment Configuration

### File Exists:

- [ ] `apps/web/.env.local` created (from `.env.local.example`)

### Credentials Filled In:

Open `apps/web/.env.local` and verify (without sharing values):

```bash
# Terminal command to check structure (not values):
grep -E "SUPABASE_|NEXT_PUBLIC" apps/web/.env.local
```

Should output 3 lines:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Starts with `https://`, ends with `.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Starts with `eyJhbGc`, ~140 chars
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — Starts with `eyJhbGc`, ~140 chars

### File Permissions:

```bash
# Run this command:
ls -la apps/web/.env.local | grep -E "^-rw.*"
```

- [ ] File is NOT readable by others (permissions are `600` or `-rw-------`)

### Git Ignored:

```bash
# Run this command:
cat .gitignore | grep ".env.local"
```

- [ ] Output shows `.env.local` (file is in .gitignore)

---

## Phase 6: Development Environment

### Dependencies Installed:

```bash
# Terminal:
cd /home/kellyb_dev/projects/hex-adhd-prep
pnpm install
```

- [ ] Command completes without errors
- [ ] `node_modules/` directory exists
- [ ] `pnpm-lock.yaml` is up-to-date

### Dev Server Starts:

```bash
# Terminal 1:
pnpm dev
```

- [ ] Output shows: `▲ Next.js 15.x.x`
- [ ] Output shows: `Local: http://localhost:3000`
- [ ] No error messages (no red text)
- [ ] Server stays running (doesn't crash)

### Tests Pass:

```bash
# Terminal 2 (keep Terminal 1 running):
pnpm test
```

- [ ] Tests complete without hanging
- [ ] Output shows: `Tests: XX passed, XX total`
- [ ] Coverage shows: `Lines 80%+, Branches 75%+`
- [ ] No connection errors to Supabase

---

## Phase 7: Data Connection Test

### Manual Signup Test:

1. Open [http://localhost:3000](http://localhost:3000) in browser
2. Click **"Sign Up"**
3. Fill form:
   - Email: `testuser@example.com`
   - Age: `28`
   - Password: `SecureTest123!`
4. Click **"Sign Up"** button

**Expected result:**
- [ ] Success message displays
- [ ] Redirected to dashboard/home page
- [ ] No error message in browser console (F12)

### Verify Data in Supabase:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Table Editor** → **`users`**
4. Look for your test user row:

- [ ] Row exists with email `testuser@example.com`
- [ ] Age field shows `28`
- [ ] Tier field shows `49`
- [ ] `created_at` shows recent timestamp

---

## Phase 8: Connection Diagnostics

### Test Supabase Connectivity:

```bash
# Replace YOUR_ANON_KEY and YOUR_PROJECT_ID with your values
ANON_KEY="YOUR_ANON_KEY"
PROJECT_ID="YOUR_PROJECT_ID"
URL="https://$PROJECT_ID.supabase.co/rest/v1/users?limit=1"

curl -s -H "Authorization: Bearer $ANON_KEY" "$URL" | head -20
```

**Expected output:**
- [ ] Valid JSON response (starts with `{` or `[`)
- [ ] HTTP 200 or 401 (not connection refused)
- [ ] No "forbidden" or "not found" errors

### Check Node Environment:

```bash
# In project root:
node -e "console.log('Node version:', process.version)"
```

- [ ] Node version 18.x or higher

### Check TypeScript:

```bash
pnpm tsc --version
```

- [ ] TypeScript version 5.0 or higher

---

## Phase 9: Security Verification

### Secrets Not Committed:

```bash
# Check git history for secrets:
git log --all -S "SUPABASE_SERVICE_ROLE_KEY" --source --remotes -- '*.json' '*.js' '*.ts'
```

- [ ] No matches (service role key never committed to Git)

### .env.local Not Tracked:

```bash
git status | grep ".env.local"
```

- [ ] No output (file is untracked/ignored)

### File Permissions Correct:

```bash
stat apps/web/.env.local | grep "Access:"
```

- [ ] Should show permissions like `0600` or `-rw-------`

---

## Phase 10: Final System Test

### Run Full Test Suite:

```bash
# Terminal:
pnpm test -- --coverage
```

- [ ] All tests pass
- [ ] Coverage meets minimum:
  - [ ] Lines: ≥80%
  - [ ] Branches: ≥75%
  - [ ] Functions: ≥80%

### Lint & Format Check:

```bash
pnpm lint
```

- [ ] No errors (only warnings are acceptable)

### Build Test (Dry Run):

```bash
pnpm build
```

- [ ] Build completes without critical errors
- [ ] `.next/` directory created
- [ ] Output shows: `✓ Build complete`

---

## Troubleshooting Quick Links

| Issue | See Section in SUPABASE-SETUP.md |
|-------|--------------------------------|
| Connection refused | Section 5 — Issue 1 |
| 401 Unauthorized | Section 5 — Issue 2 |
| Tables don't exist | Section 5 — Issue 3 |
| Tests fail | Section 5 — Issue 4 |
| 403 Forbidden | Section 5 — Issue 5 |
| Want to reset | Section 6 |
| Still stuck | Section 8 — Support & Resources |

---

## Sign-Off

**All items checked?** You're ready to develop!

**For each phase, ensure ALL boxes are checked before moving to the next.**

If any box cannot be checked:
1. Review that section in SUPABASE-SETUP.md
2. Check the Troubleshooting section (SUPABASE-SETUP.md Section 5)
3. Verify step-by-step that all prior phases completed

**Next steps:**
- [ ] Proceed to feature development (see CLAUDE.md)
- [ ] Verify staging deployment works (Vercel)
- [ ] Monitor Sentry for 24 hours
- [ ] Update CLAUDE.md progress section

---

**Document Version:** 1.0  
**Last Updated:** May 3, 2026  
**For Issues:** See CLAUDE.md Section 8 (Escalation Path)
