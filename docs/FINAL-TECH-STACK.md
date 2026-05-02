# TECH STACK — FINAL (MAY 2026, LTS ONLY)

## LOCKED VERSIONS

| Package | Version | LTS Status | End of Support | Why This |
|---------|---------|-----------|-----------------|----------|
| Node.js | 22.13.0 | LTS | April 2027 | Latest LTS (20.x expires April 2026) |
| React | 19.0.0 | Stable | Current | Latest stable ✅ |
| Next.js | 15.1.3 | Stable | Current | Latest stable, App Router ✅ |
| TypeScript | 5.7.3 | Latest | Current | Latest stable ✅ |
| Tailwind CSS | 4.0.0 | Stable | Current | 18 months in market, ecosystem mature ✅ |
| Zustand | 4.5.5 | Stable | Current | State management, included ✅ |
| Zod | 3.23.11 | Stable | Current | Validation library ✅ |
| ESLint | 9.16.0 | Latest | Current | Flat config (no legacy) ✅ |
| TypeScript ESLint | 7.18.0 | Latest | Current | Matches ESLint 9 ✅ |
| Prettier | 3.4.0 | Latest | Current | Code formatter ✅ |
| Jest | 29.7.0 | Stable | Current | v30 still beta ✅ |
| ts-jest | 29.1.5 | Stable | Current | TypeScript Jest transformer ✅ |
| pnpm | 9.14.0 | Latest | Current | Package manager ✅ |
| Turborepo | 2.3.3 | Latest | Current | Monorepo orchestration ✅ |
| @testing-library/react | 16.1.0 | Latest | Current | React 19 compatible ✅ |
| Supabase JS | 2.50.0 | Latest | Current | PostgreSQL client ✅ |
| Upstash Redis | 1.35.0 | Latest | Current | Redis REST client (optional Phase 2) ✅ |
| Axios | 1.6.2 | Latest | Current | HTTP client ✅ |

---

## COMPATIBILITY VERIFIED

✅ **Node.js 22 LTS → React 19 + Next.js 15:** All compatible  
✅ **TypeScript 5.7.3 → All packages:** Full support  
✅ **Tailwind 4.0.0 → Next.js 15:** Ecosystem mature (18 months)  
✅ **ESLint 9 flat config → TypeScript ESLint 7:** Works perfectly  
✅ **Jest 29 → ts-jest 29:** Matched versions  

---

## ORM DECISION

**MVP Phase (0.0.1 - 1.0.0):** NO ORM  
- Use Supabase client directly (simplest, fastest)
- Add Drizzle ORM in Phase 2 if query complexity grows

**Future Option:**
- DrizzleORM 0.36.x (lightweight, ~15KB, SQL-first)

---

## VERSION PINNING STRATEGY

All dependencies pinned exactly (no `^` or `~`):
```json
"react": "19.0.0",
"next": "15.1.3",
"tailwindcss": "4.0.0",
"typescript": "5.7.3"
```

Updates happen via conscious choice, not automatic semver.

---

## DEPLOYMENT TARGETS

- **Node.js:** 22.13.0 LTS  
- **Vercel:** Detects Next.js, auto-optimizes  
- **Build:** `pnpm build`  
- **Start:** `next start`  

---

## STATUS

✅ All versions locked  
✅ All compatibility verified  
✅ Repo pushed to GitHub  
✅ Ready for Vercel import  

