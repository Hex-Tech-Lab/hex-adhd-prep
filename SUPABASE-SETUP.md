# Supabase Setup Guide for ADHD-Prep

**Last Updated:** May 3, 2026  
**Project:** hex-adhd-prep (ADHD Diagnostic SaaS)  
**Status:** Phase 0-1 MVP  

---

## Table of Contents

1. [Supabase Project Setup](#1-supabase-project-setup)
2. [Database Configuration](#2-database-configuration)
3. [Environment Variables](#3-environment-variables)
4. [Testing Your Setup](#4-testing-your-setup)
5. [Troubleshooting](#5-troubleshooting)
6. [Resetting the Database](#6-resetting-the-database)

---

## 1. Supabase Project Setup

### Step 1.1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Sign Up"** (top right)
3. Choose authentication method:
   - **GitHub** (recommended for developers)
   - **Email** (create new account)
4. Complete the verification process

### Step 1.2: Create a New Project

1. After signing in, click **"New Project"** or go to [app.supabase.com](https://app.supabase.com)
2. Fill in the project details:
   - **Project name:** `hex-adhd-prep` (or your preferred name)
   - **Database password:** Create a strong password (save it securely!)
   - **Region:** Choose **Frankfurt (eu-central-1)** for optimal performance
     - _Alternative regions: US East (N. Virginia), US West (Oregon)_
   - **Pricing:** Free tier is sufficient for development and MVP testing
3. Click **"Create New Project"**
4. Wait 2-3 minutes for the project to initialize (you'll see a progress indicator)

### Step 1.3: Retrieve Your Credentials

Once your project is ready, you'll land on the dashboard. Collect these three credentials:

#### **A. Project URL**

1. In the left sidebar, click **"Settings"** (gear icon)
2. Click **"API"**
3. Under "Project URL", copy the full URL
   - Format: `https://[project-id].supabase.co`
   - **Save this value**

#### **B. Anon Key (Public Anon Key)**

1. Still in Settings → API
2. Under "Project API keys", find **"anon"**
3. Copy the key (starts with `eyJhbGc...`)
   - **Save this value**

#### **C. Service Role Key**

1. Still in Settings → API
2. Under "Project API keys", find **"service_role"**
3. Copy the key (starts with `eyJhbGc...`)
   - ⚠️ **This is SENSITIVE** — keep it private, never commit to Git
   - **Save this value**

---

## 2. Database Configuration

### Step 2.1: Enable Required Extensions

1. In Supabase dashboard, go to **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Paste the following SQL:

```sql
-- Enable extensions needed for hex-adhd-prep
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see: `Successfully executed 3 commands`

### Step 2.2: Run the Core Migration

1. In the SQL Editor, click **"New Query"** again
2. Open the migration file:
   - **File path:** `/apps/web/supabase/migrations/20250503_001_init_core.sql`
3. Copy the entire contents of this file
4. Paste into the SQL Editor
5. Click **"Run"**

#### Expected Output:
```
Successfully executed 50+ commands
```

This creates the following tables:

| Table | Purpose |
|-------|---------|
| `users` | User accounts, email, password, tier, timezone |
| `assessments` | ADHD assessment sessions, scoring, progress |
| `interview_responses` | Individual question responses, AI follow-ups |
| `family_inputs` | Family member feedback (via invite links) |
| `reports` | Generated assessment reports |

### Step 2.3: Verify Table Creation

1. In the left sidebar, go to **"Table Editor"**
2. Verify you can see these tables:
   - `users`
   - `assessments`
   - `interview_responses`
   - `family_inputs`
   - `reports`

**If tables are missing:** Re-run the migration from Step 2.2

### Step 2.4: Verify RLS Policies

1. Click on each table in Table Editor
2. Navigate to the **"RLS"** tab (top right of the table view)
3. Verify policies are enabled:
   - **Green toggle** = RLS is ON for this table
   - **Red toggle** = RLS is OFF (problematic)

**All 5 tables should have RLS enabled (green).**

---

## 3. Environment Variables

### Step 3.1: Copy Example File

1. Navigate to project root:
   ```bash
   cd /home/kellyb_dev/projects/hex-adhd-prep
   ```

2. Copy the example file:
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   ```

### Step 3.2: Fill in Credentials

Edit `apps/web/.env.local` with the credentials from Step 1.3:

```bash
# Edit the file
nano apps/web/.env.local
# or use your preferred editor
```

Replace with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Example (filled):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234efgh5678.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3.3: Verify File Permissions

```bash
# Ensure .env.local is not readable by others
chmod 600 apps/web/.env.local

# Verify it's in .gitignore
cat .gitignore | grep ".env.local"
# Should show: .env.local
```

---

## 4. Testing Your Setup

### Step 4.1: Install Dependencies

```bash
cd /home/kellyb_dev/projects/hex-adhd-prep
pnpm install
```

### Step 4.2: Start Development Server

```bash
# Terminal 1: Start the dev server
pnpm dev

# Expected output:
# ▲ Next.js 15.1.2
#   Local:        http://localhost:3000
#   Requirement:  Next.js 15+
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4.3: Run API Tests

```bash
# Terminal 2 (leave Terminal 1 running)
cd /home/kellyb_dev/projects/hex-adhd-prep

# Run all tests
pnpm test

# Expected output:
# PASS  apps/web/app/api/tests/auth.test.ts
# PASS  apps/web/app/api/tests/assessment.test.ts
# Tests:       47 passed, 47 total
# Coverage:    Lines 85%, Branches 80%, Functions 82%
```

### Step 4.4: Verify Supabase Connection

In your browser at http://localhost:3000, try the **Sign Up** flow:

1. Click **"Sign Up"**
2. Enter:
   - Email: `test@example.com`
   - Age: `30`
   - Password: `TestPassword123!`
3. Click **"Sign Up"**
4. You should see:
   - A success message
   - Redirect to the home page
   - Session info visible in browser console (F12 → Console)

### Step 4.5: Expected Behavior Changes

#### **Before Supabase Setup (Demo Mode)**
- ✅ Tests pass (mock data)
- ✅ API routes respond (no data persistence)
- ❌ No user data saved to database
- ❌ Reload page → data is lost

#### **After Supabase Setup (Production Mode)**
- ✅ Tests pass (real Supabase)
- ✅ API routes respond (data persists)
- ✅ User data saved to `users` table
- ✅ Reload page → user is still logged in
- ✅ Check Supabase dashboard → see your test user

### Step 4.6: Verify Data in Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **"Table Editor"** (left sidebar)
4. Click the **`users`** table
5. You should see your test user:
   ```
   id: [UUID]
   email: test@example.com
   full_name: null
   age: 30
   tier: 49
   created_at: [timestamp]
   ```

**If you see the user → Supabase is connected! 🎉**

---

## 5. Troubleshooting

### Issue 1: "Connection Refused" or "ECONNREFUSED"

**Symptoms:**
```
Error: ECONNREFUSED 127.0.0.1:5432
Error: Failed to connect to Supabase
```

**Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Wrong Project URL | Verify URL in `NEXT_PUBLIC_SUPABASE_URL` — copy from Settings → API → Project URL |
| Typo in credentials | Ensure no extra spaces. Compare exact values from Supabase dashboard |
| Project not initialized | Wait 3-5 more minutes. Check Supabase dashboard — is project running (green status)? |
| `.env.local` not loaded | Restart dev server: `Ctrl+C` then `pnpm dev` |
| `.env.local` in wrong location | Verify file is at: `apps/web/.env.local` (not root `.env.local`) |

**Diagnostic Commands:**
```bash
# Check if .env.local is readable
cat apps/web/.env.local | head -3

# Verify Project URL format
echo $NEXT_PUBLIC_SUPABASE_URL
# Should output: https://[something].supabase.co

# Test network connection (replace with your URL)
curl https://your-project-id.supabase.co/rest/v1/
# Should return 401 (unauthorized) — this is normal
```

### Issue 2: "Invalid API Key" or 401 Unauthorized

**Symptoms:**
```
Error: Invalid API key
Error: 401 Unauthorized
```

**Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Anon key copied wrong | Copy `NEXT_PUBLIC_SUPABASE_ANON_KEY` again from Settings → API → "anon" |
| Service Role key wrong | Copy `SUPABASE_SERVICE_ROLE_KEY` again from Settings → API → "service_role" |
| Keys swapped | Ensure: Anon goes to `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Service Role goes to `SUPABASE_SERVICE_ROLE_KEY` |
| Key expired | Delete project and create a new one (free tier) |

**Diagnostic Command:**
```bash
# Check if keys are present
grep "SUPABASE_" apps/web/.env.local | head -2
# Should show non-empty values
```

### Issue 3: Tables Don't Exist or RLS Errors

**Symptoms:**
```
Error: relation "public.users" does not exist
Error: permission denied for schema public
```

**Causes & Fixes:**

1. **Re-run migration from Step 2.2:**
   ```bash
   # Open Supabase SQL Editor
   # Re-paste the contents of: supabase/migrations/20250503_001_init_core.sql
   # Click "Run"
   ```

2. **Check for migration errors:**
   - Look for red error messages in SQL Editor
   - Common issues:
     - `ERROR: extension "vector" does not exist` → Run Step 2.1 again
     - `ERROR: syntax error` → Copy migration file again (fresh copy)

3. **Verify RLS is enabled:**
   ```bash
   # In Supabase SQL Editor, run:
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   # Should list: users, assessments, interview_responses, family_inputs, reports
   ```

### Issue 4: Test Failures After Setup

**Symptoms:**
```
FAIL  apps/web/app/api/tests/assessment.test.ts
     ● Tests › assessment.test › should create assessment
       Error: Expected database call but got demo response
```

**Causes & Fixes:**

1. **Restart dev server:**
   ```bash
   # Stop: Ctrl+C
   # Start: pnpm dev
   # Wait 10 seconds for Supabase client to initialize
   ```

2. **Clear Node cache:**
   ```bash
   rm -rf .next/
   pnpm dev
   ```

3. **Verify env variables are loaded:**
   ```bash
   # Add this to a test file temporarily:
   console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log("Has service role key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)
   ```

### Issue 5: 403 Forbidden on User Operations

**Symptoms:**
```
Error: new row violates row-level security policy "users_insert"
Error: 403 Forbidden
```

**Causes & Fixes:**

1. **RLS Policy Issue:**
   - This usually means auth context is missing
   - Ensure you're using Supabase Auth properly
   - Check that user is authenticated before database calls

2. **Fix (in API route):**
   ```typescript
   // apps/web/app/api/[route]/route.ts
   
   import { createClient } from '@supabase/supabase-js';
   
   export async function POST(req: Request) {
     // Use anon key for client-side auth flow
     const supabase = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
     );
     
     // Or use service role key for backend operations
     const supabaseAdmin = createClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL,
       process.env.SUPABASE_SERVICE_ROLE_KEY
     );
     
     // Use the appropriate client
   }
   ```

---

## 6. Resetting the Database

### Scenario 1: Clear All Test Data (Keep Schema)

Use this if you want to start fresh but keep the table structure:

1. Go to Supabase dashboard → **SQL Editor**
2. Click **"New Query"**
3. Paste:
   ```sql
   -- Disable RLS temporarily
   ALTER TABLE interview_responses DISABLE ROW LEVEL SECURITY;
   ALTER TABLE family_inputs DISABLE ROW LEVEL SECURITY;
   ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
   ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   
   -- Delete all data (reverse order due to foreign keys)
   DELETE FROM reports;
   DELETE FROM family_inputs;
   DELETE FROM interview_responses;
   DELETE FROM assessments;
   DELETE FROM users;
   
   -- Re-enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
   ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
   ALTER TABLE family_inputs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
   
   -- Verify
   SELECT count(*) as total_users FROM users;
   SELECT count(*) as total_assessments FROM assessments;
   ```
4. Click **"Run"**
5. You should see output: `total_users: 0, total_assessments: 0`

### Scenario 2: Complete Reset (Delete & Recreate Schema)

⚠️ **This deletes EVERYTHING. Use with caution.**

1. Go to Supabase dashboard → **Settings** (left sidebar)
2. Click **"Danger Zone"** (bottom)
3. Click **"Reset Database"**
4. Type the project name to confirm
5. Wait 1-2 minutes for reset to complete
6. Re-run migration from Step 2.2

### Scenario 3: Delete Project (Complete Cleanup)

If you want to start completely fresh:

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click **Settings** → **"Danger Zone"**
4. Click **"Delete Project"**
5. Type project name to confirm
6. Create a new project (go back to Step 1.2)

---

## 7. Next Steps After Setup

### Verify Everything Works

- [ ] Supabase project created and running
- [ ] Credentials added to `apps/web/.env.local`
- [ ] Development server running (`pnpm dev`)
- [ ] Tests passing (`pnpm test`)
- [ ] Test user created and visible in Supabase dashboard
- [ ] No connection errors in browser console (F12)

### Check Project Status

Run this to verify setup:

```bash
# From project root
cd /home/kellyb_dev/projects/hex-adhd-prep

# 1. Verify environment variables
echo "=== Environment Variables ==="
grep "NEXT_PUBLIC_SUPABASE" apps/web/.env.local

# 2. Run tests
echo "=== Running Tests ==="
pnpm test -- --testPathPattern="assessment|auth"

# 3. Check database connectivity
echo "=== Database Status ==="
curl -s -H "Authorization: Bearer $(grep NEXT_PUBLIC_SUPABASE_ANON_KEY apps/web/.env.local | cut -d= -f2)" \
  "$(grep NEXT_PUBLIC_SUPABASE_URL apps/web/.env.local | cut -d= -f2)/rest/v1/users?limit=1" \
  | head -20
```

### Ready to Develop

Once setup is complete, you can:

1. **Start the dev server:**
   ```bash
   pnpm dev
   ```

2. **Run tests:**
   ```bash
   pnpm test
   ```

3. **Deploy to staging:**
   ```bash
   git push origin [your-branch]
   # Vercel preview automatically deploys
   ```

4. **Monitor in production:**
   - Supabase dashboard: [app.supabase.com](https://app.supabase.com)
   - Vercel dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
   - Sentry errors: Check project settings

---

## 8. Support & Resources

### Getting Help

| Issue | Resource |
|-------|----------|
| Supabase docs | [supabase.com/docs](https://supabase.com/docs) |
| PostgreSQL questions | [postgresql.org/docs](https://postgresql.org/docs) |
| Next.js integration | [supabase.com/docs/guides/auth/auth-helpers/nextjs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs) |
| RLS policies | [supabase.com/docs/guides/database/postgres/row-level-security](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| Project issues | See CLAUDE.md `[BLOCKER]` section or GitHub issues |

### Key Documentation Files

- **CLAUDE.md** — Project master control document, progress tracking
- **02-TECHNICAL-ARCHITECTURE.md** — API routes, database design
- **03-DATABASE-SCHEMA.md** — Full SQL schema documentation
- **supabase/migrations/** — All migrations (DDL)

---

## 9. Checklist

**Before opening an issue or escalating:**

- [ ] Credentials triple-checked (no typos, correct format)
- [ ] `.env.local` is in the right location (`apps/web/.env.local`)
- [ ] Dev server restarted after `.env.local` changes
- [ ] Supabase project status is "Running" (not "Paused")
- [ ] Migration SQL was fully executed (no red errors)
- [ ] RLS is enabled on all 5 tables (green toggles)
- [ ] PostgreSQL extensions created (uuid-ossp, pgcrypto, vector)
- [ ] Tests run locally (`pnpm test`)
- [ ] Browser console checked for errors (F12)
- [ ] Cache cleared (`.next/` deleted, `pnpm install` re-run)

**If all items above pass and you still have issues:**

1. Document the exact error message
2. Note which step it occurred at
3. Check CLAUDE.md for known blockers
4. Open GitHub issue with tag `[supabase]`

---

## 10. FAQ

### Q: Can I use a different region?
**A:** Yes. Frankfurt is recommended for Europe. For North America, use **US East (N. Virginia)** or **US West (Oregon)**. Choose the region closest to your users. You can change it in Supabase Settings → General.

### Q: Is the free tier enough?
**A:** Yes, for MVP Phase 0-1. Free tier includes:
- 500MB database storage
- 2 GB bandwidth/month
- Unlimited auth users
- Suitable for ~100 concurrent users
- Upgrade anytime to paid plan

### Q: How do I backup my database?
**A:** Supabase auto-backs up daily on free tier. For manual backups:
1. Settings → Backups
2. Click "Request Backup"
3. Download as CSV from Table Editor (for individual tables)

### Q: What if I accidentally delete a user?
**A:** See Section 6 (Resetting the Database). You can:
- Delete specific rows via Table Editor
- Bulk delete all data (keep schema)
- Full reset (delete & recreate schema)

### Q: Can I use Supabase locally during development?
**A:** Yes, use `supabase start` for local development:
```bash
# Install CLI: https://supabase.com/docs/guides/cli
# In project root:
supabase start    # Starts local Postgres + Redis
supabase stop     # Stops services
```

### Q: How do I monitor database performance?
**A:** Go to Supabase dashboard:
1. Click your project
2. **Inspect** → View query performance
3. **Database** → Monitor connections, memory
4. **SQL Editor** → Run `EXPLAIN ANALYZE` on slow queries

### Q: What if my anon key is compromised?
**A:** 
1. Go to Settings → API
2. Click the "Rotate" button next to the anon key
3. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
4. Redeploy

### Q: Can I use Supabase Auth instead of custom auth?
**A:** Yes, and it's recommended for Phase 2. For MVP Phase 0-1, we use custom auth for simplicity. See CLAUDE.md for upgrade path.

---

**Setup complete! You're ready to develop.** 🚀

For questions or issues, refer to CLAUDE.md or contact K. in standup.
