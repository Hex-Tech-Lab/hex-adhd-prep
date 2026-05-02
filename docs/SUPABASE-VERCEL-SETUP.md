# SUPABASE + VERCEL SETUP (AUTOMATED)

**Status:** Network restrictions in dev environment prevent auto-deploy. Manual steps below.

---

## STEP 1: CREATE SUPABASE PROJECT (Frankfurt)

1. Go to: https://supabase.com/dashboard
2. **New Project**
3. **Name:** `hex-adhd-prep`
4. **Database Password:** Generate strong password
5. **Region:** `Frankfurt (eu-central-1)` — EU compliance
6. Click **Create**
7. Wait 2-3 minutes for database to initialize

---

## STEP 2: INITIALIZE DATABASE SCHEMA

Once project is created:

1. Go to **SQL Editor**
2. Click **New Query**
3. Copy entire contents of `/supabase/migrations/20250502_001_init_schema.sql`
4. Paste into query editor
5. Click **Run**
6. ✅ Tables created + RLS policies enabled

---

## STEP 3: GET CREDENTIALS

In **Settings** → **API**:

- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

Store safely.

---

## STEP 4: DEPLOY TO VERCEL

### Option A: Manual Import (2 min)

1. Go to: https://vercel.com/techhypexps-projects
2. **Add New** → **Project**
3. **Import Git Repository** → Select `hex-adhd-prep`
4. **Framework:** Next.js (auto-detected)
5. **Build Command:** `pnpm build`
6. **Output Directory:** `.next`
7. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=[PASTE_PROJECT_URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[PASTE_ANON_KEY]
   SUPABASE_SERVICE_ROLE_KEY=[PASTE_SERVICE_KEY]
   NODE_ENV=production
   LOG_LEVEL=info
   ```
8. Click **Deploy**
9. Wait 3-5 minutes
10. You'll get: `https://hex-adhd-prep-xxxxx.vercel.app`

### Option B: Vercel CLI (if available)

```bash
cd /root/projects/hex-adhd-prep
vercel deploy --prod \
  --name hex-adhd-prep \
  --env NEXT_PUBLIC_SUPABASE_URL=[URL] \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY=[KEY] \
  --env SUPABASE_SERVICE_ROLE_KEY=[KEY]
```

---

## STEP 5: TEST DEPLOYMENT

Once Vercel deployment is live:

1. Visit: `https://hex-adhd-prep-xxxxx.vercel.app`
2. You should see landing page
3. Visit: `https://hex-adhd-prep-xxxxx.vercel.app/api/health`
4. You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-05-02T...",
     "environment": "production",
     "version": "0.0.1"
   }
   ```

✅ Deployment working!

---

## STEP 6: ENABLE SUPABASE AUTH (Optional for Phase 2)

If you want user auth:

1. In Supabase: **Authentication** → **Providers**
2. Enable **Email** (default enabled)
3. Configure redirect URLs:
   - Production: `https://hex-adhd-prep-xxxxx.vercel.app/auth/callback`
   - Local: `http://localhost:3000/auth/callback`

---

## STEP 7: START LOCAL DEVELOPMENT

```bash
cd /root/projects/hex-adhd-prep

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=[PROJECT_URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_KEY]
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=debug
EOF

# Install dependencies
pnpm install

# Start dev server
pnpm dev
# Opens http://localhost:3000
```

---

## SUMMARY

| Step | Status | Time |
|------|--------|------|
| Create Supabase (Frankfurt) | Manual | 5 min |
| Initialize schema | Manual | 2 min |
| Get credentials | Manual | 1 min |
| Deploy to Vercel | Manual | 5 min |
| Test health check | Automated | 1 min |
| Start local dev | Automated | 2 min |
| **TOTAL** | - | **16 min** |

---

## WHAT'S READY

✅ GitHub repo: https://github.com/Hex-Tech-Lab/hex-adhd-prep  
✅ Supabase schema: `supabase/migrations/20250502_001_init_schema.sql`  
✅ Vercel config: Ready to import  
✅ TypeScript aliases: Configured  
✅ CI/CD: GitHub Actions ready  
✅ Tech stack: Node 22 LTS, React 19, Next.js 15, Tailwind 4, TypeScript 5.7  

---

**Next action:** Create Supabase project in Frankfurt, deploy to Vercel, start Week 1 ASRS development.

