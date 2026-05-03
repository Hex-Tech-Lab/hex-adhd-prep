# Supabase Quick Reference Card

**Use this one-page cheat sheet after setup is complete.**

---

## Before You Start

1. **Sign up:** [supabase.com](https://supabase.com)
2. **Create project:** Frankfurt region recommended
3. **Collect credentials:** URL + Anon Key + Service Role Key
4. **Configure:** Add to `apps/web/.env.local`

---

## Essential Commands

### Development

```bash
# Start dev server
pnpm dev                      # http://localhost:3000

# Run tests
pnpm test                     # All tests
pnpm test -- --watch         # Watch mode
pnpm test -- --coverage      # With coverage report

# Lint & format
pnpm lint                     # Check formatting
pnpm format                   # Auto-fix formatting

# Build for production
pnpm build
pnpm start                    # Run production build
```

### Database

```bash
# Access Supabase CLI
supabase --version            # Check CLI version

# Local development (if using local Postgres)
supabase start                # Start local services
supabase stop                 # Stop local services
supabase db push              # Push migrations to production
supabase db pull              # Pull schema from production
```

### Git Workflow

```bash
# Feature branch
git checkout -b [agent]/[feature]

# After making changes
git add .
git commit -m "[agent] description"
git push origin [agent]/[feature]

# Create PR (triggers CodeRabbit + Snyk)
# Merge when approved
```

---

## Environment Variables Template

**File:** `apps/web/.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Where to find:**
- URL: Supabase → Settings → API → Project URL
- Anon Key: Supabase → Settings → API → "anon" key
- Service Role: Supabase → Settings → API → "service_role" key

---

## Database Tables

| Table | Purpose | Rows/Day |
|-------|---------|----------|
| `users` | User accounts, auth, tier | 5-50 |
| `assessments` | Assessment sessions | 10-100 |
| `interview_responses` | Q&A responses | 100-1000 |
| `family_inputs` | Family feedback | 5-50 |
| `reports` | Generated reports | 10-100 |

**Access:** Supabase → Table Editor → Select table

---

## Common Operations

### View Data

```sql
-- Count users
SELECT count(*) FROM users;

-- See recent assessments
SELECT id, user_id, status, created_at FROM assessments 
ORDER BY created_at DESC LIMIT 10;

-- Find user's assessments
SELECT * FROM assessments 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;
```

### Add Test Data

```sql
-- Manually insert test user (for admin testing)
INSERT INTO users (email, password_hash, age, tier, email_verified)
VALUES (
  'admin@test.com',
  'test-hash-here',
  35,
  '199',
  true
);
```

### Clear Data

```sql
-- Delete all non-production data
DELETE FROM reports;
DELETE FROM family_inputs;
DELETE FROM interview_responses;
DELETE FROM assessments;
-- Keep users for reference

-- Or completely reset:
-- Go to Supabase Dashboard → Settings → Danger Zone → Reset Database
```

---

## Deployment Checklist

- [ ] Feature branch created: `git checkout -b [agent]/[feature]`
- [ ] Code written & tested: `pnpm test`
- [ ] Linting passed: `pnpm lint`
- [ ] Committed: `git commit -m "[agent] message"`
- [ ] Pushed: `git push origin [agent]/[feature]`
- [ ] PR created (auto-triggers CodeRabbit + Snyk)
- [ ] CodeRabbit approved (fix issues if needed)
- [ ] Snyk approved (no high-severity vulns)
- [ ] PR merged to main
- [ ] Vercel preview auto-deploys
- [ ] Vercel production auto-deploys
- [ ] Monitor Sentry for 24hrs: [sentry.io](https://sentry.io)

---

## Troubleshooting Quick Fixes

### "Connection Refused"
```bash
# 1. Check env file
cat apps/web/.env.local | grep SUPABASE

# 2. Verify URL format
# Should be: https://[something].supabase.co

# 3. Restart dev server
# Ctrl+C, then pnpm dev
```

### "401 Unauthorized"
```bash
# 1. Check API key format (should start with eyJhbGc)
grep SUPABASE_ANON_KEY apps/web/.env.local

# 2. Verify keys aren't swapped:
# - NEXT_PUBLIC_SUPABASE_ANON_KEY = public key
# - SUPABASE_SERVICE_ROLE_KEY = private key (secret)

# 3. Re-copy keys from Supabase dashboard
```

### "Tables Don't Exist"
```bash
# 1. Run migration in Supabase SQL Editor
# File: supabase/migrations/20250503_001_init_core.sql

# 2. Verify migration executed without errors
# Should show: "Successfully executed 50+ commands"

# 3. Check Table Editor in Supabase dashboard
# Should see: users, assessments, interview_responses, family_inputs, reports
```

### Tests Failing
```bash
# 1. Restart dev server
Ctrl+C
pnpm dev

# 2. Clear cache
rm -rf .next/
pnpm install

# 3. Re-run tests
pnpm test
```

---

## Key URLs

| Service | URL |
|---------|-----|
| Supabase Dashboard | [app.supabase.com](https://app.supabase.com) |
| Dev Server | [http://localhost:3000](http://localhost:3000) |
| GitHub Repo | [github.com/.../hex-adhd-prep](https://github.com) |
| Vercel Deployments | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Sentry Errors | [sentry.io](https://sentry.io) |

---

## Documentation Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Master control document, progress tracking |
| `SUPABASE-SETUP.md` | Detailed setup instructions |
| `SUPABASE-VERIFICATION-CHECKLIST.md` | Post-setup verification |
| `TECHNICAL-ARCHITECTURE.md` | API routes, system design |
| `DATABASE-SCHEMA.md` | SQL schema reference |

---

## Support

**Before asking for help:**
1. Check SUPABASE-SETUP.md Section 5 (Troubleshooting)
2. Review error message in console
3. Verify all 10 phases in SUPABASE-VERIFICATION-CHECKLIST.md

**Escalation:**
- See CLAUDE.md Section 8 (Communication & Escalation)
- Open GitHub issue with tag `[supabase]`

---

## Important Rules

✅ **DO:**
- Use `pnpm` only (not npm or yarn)
- Verify `.env.local` is in `.gitignore`
- Run tests before committing
- Keep `SUPABASE_SERVICE_ROLE_KEY` private
- Monitor Sentry after deploy

❌ **DON'T:**
- Commit `.env.local` to Git
- Use public API for sensitive operations
- Force-push to main
- Skip security scans (Snyk)
- Modify frozen tech stack without approval

---

**Version:** 1.0 | **Updated:** May 3, 2026 | **For Issues:** CLAUDE.md Section 8
