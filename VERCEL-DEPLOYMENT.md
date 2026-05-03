# Vercel Deployment Guide - ADHD-Prep

## Quick Start (5 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select `hex-adhd-prep` repository
5. Click "Deploy" (uses defaults)
6. Wait for deployment to complete
7. Add environment variables (see below)

---

## Detailed Setup

### Step 1: Connect GitHub to Vercel

```
1. Go to https://vercel.com/new
2. Choose GitHub as source
3. Authorize Vercel to access your GitHub
4. Select repository: hex-adhd-prep
5. Click "Import"
```

### Step 2: Configure Project Settings

**Framework Preset:** Next.js  
**Build Command:** `pnpm build`  
**Install Command:** `pnpm install`  
**Output Directory:** `.next`  
**Root Directory:** `apps/web`  

### Step 3: Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxx...
```

Get these from Supabase dashboard:
- Go to Project Settings → API → URL
- Copy Service Role Key (not public key!)

### Step 4: Deploy

Click "Deploy" button. Wait 2-3 minutes.

---

## Production Setup

### Step 1: Update Environment Variables

Go to **Settings → Environment Variables**

Add these for production:

```
NEXT_PUBLIC_SUPABASE_URL=<production-url>
SUPABASE_SERVICE_ROLE_KEY=<production-key>
NODE_ENV=production
```

### Step 2: Configure Production Domain

**Settings → Domains:**
- Add your custom domain (e.g., adhd-prep.com)
- Follow DNS configuration steps
- Wait for SSL certificate (auto)

### Step 3: Enable Analytics

**Settings → Analytics:**
- Enable Web Analytics
- View performance metrics

---

## After Deployment

### Verify Everything Works

```bash
# Test the deployed site
curl https://your-domain.vercel.app/

# Expected: HTML response from homepage

# Check API
curl https://your-domain.vercel.app/api/health

# Expected: 200 OK
```

### Test Assessment Flow

1. Visit https://your-domain.vercel.app
2. Click "Start Assessment"
3. Sign up with demo@test.com / demo12345
4. Complete ASRS questionnaire
5. Verify scores display correctly

### Monitor Performance

Visit **Analytics** dashboard to check:
- First Contentful Paint (FCP) - target <1.5s
- Largest Contentful Paint (LCP) - target <2.5s
- Cumulative Layout Shift (CLS) - target <0.1
- Request rate and errors

---

## Troubleshooting

### "Build Failed" Error

**Check build logs:**
1. Go to Deployments
2. Click failed deployment
3. View Build tab
4. Look for error messages

**Common causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Fix:**
```bash
# Test locally first
pnpm build

# Check for TypeScript errors
pnpm type-check

# Install missing deps
pnpm install
```

### Supabase Connection Failed

1. Verify environment variables are set (exact copy/paste, no spaces)
2. Check Supabase project is active
3. Verify service role key is correct (not public key)
4. Test connection with curl:

```bash
curl -H "Authorization: Bearer YOUR_SERVICE_KEY" \
  https://your-project.supabase.co/rest/v1/users?select=count=eq.true
```

### Site Shows "404 Not Found"

1. Verify correct domain
2. Check Root Directory setting (should be `apps/web`)
3. Redeploy: Settings → Git → Redeploy

---

## Auto-Deployment from Git

**Enabled by default.** Every `git push` to main triggers deploy:

```bash
# Deploy automatically
git push origin main

# View deployment status
# Go to Deployments tab on Vercel
```

---

## Preview Deployments

**Automatic for all PRs:**

1. Create PR against main
2. Vercel auto-deploys to preview URL
3. Click preview URL in PR
4. Test before merging

---

## Rollback a Deployment

If something breaks:

1. Go to **Deployments**
2. Find the last good deployment
3. Click "..." menu
4. Select "Promote to Production"

Done! Site reverts to previous version.

---

## Performance Optimization

### Images
- Use WebP format
- Lazy load below-fold images
- Set width/height attributes

### Code
- Use dynamic imports for large components
- Enable compression (automatic)
- Enable caching (automatic)

### Database
- Add Supabase indexes on hot paths
- Use connection pooling
- Cache responses with Redis

---

## Monitoring

### Errors (Sentry)

1. Sign up at [sentry.io](https://sentry.io)
2. Create project for Next.js
3. Add SENTRY_AUTH_TOKEN to env vars
4. Errors auto-captured

### Logs

View real-time logs:
```bash
# Using Vercel CLI
vercel logs --follow
```

---

## Deployment Checklist

Before launching to production:

- [ ] Environment variables set (test them!)
- [ ] Database migrations run (Supabase)
- [ ] All 48 tests passing (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No security issues (`snyk test`)
- [ ] Performance acceptable (<2.5s FCP)
- [ ] Assessment flow works end-to-end
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Analytics visible

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Estimated time:** 10 minutes total  
**Cost:** Free (or $20/month for hobby plan)  
**Status:** Production-ready deployment
