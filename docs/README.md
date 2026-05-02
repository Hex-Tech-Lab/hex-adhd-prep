# ADHD DIAGNOSTIC SAAS — PRD SUITE README
**Version:** 1.0  
**Date:** May 2, 2026  
**Status:** Ready for Phase 0-1 Development  

---

## 📋 What is This?

This is a **complete, production-ready PRD (Product Requirements Document) suite** for the ADHD Diagnostic SaaS MVP.

It contains **everything an LLM or development team needs** to build the product immediately, with zero additional questions.

All documents are:
- ✅ **LLM-ready** (structured, unambiguous, code-ready)
- ✅ **Executable** (week-by-week breakdown with gates)
- ✅ **Frozen** (tech stack, architecture, constraints are locked)
- ✅ **Comprehensive** (product, technical, database, UI/UX, launch specs)

---

## 📁 Document Index

### **CORE DOCUMENTS (Read in This Order)**

| File | Purpose | Audience | Length |
|------|---------|----------|--------|
| **CLAUDE.md** | Master control doc — start here | All engineers | 20 min read |
| **01-ADHD-SAAS-PRD.md** | Product spec (features, flows, acceptance criteria) | Product, Design, QA | 30 min read |
| **02-TECHNICAL-ARCHITECTURE.md** | System design (API routes, Claude integration, deployment) | Backend, DevOps | 45 min read |
| **03-DATABASE-SCHEMA.md** | SQL migrations (tables, RLS, indexes, pgvector) | Backend, DBA | 30 min read |
| **04-UI-UX-SPECIFICATION.md** | Wireframes, components, Tailwind patterns | Frontend, Design | 40 min read |
| **05-LAUNCH-CHECKLIST.md** | Week-by-week gates, validation metrics, rollback | Project Manager, QA | 25 min read |

**Total read time:** ~2.5 hours for full context. **15 min for just CLAUDE.md + your domain doc.**

---

## 🚀 How to Use This Suite

### **Scenario 1: I'm a Backend Engineer (Node.js)**

1. Read: **CLAUDE.md** (master context)
2. Read: **02-TECHNICAL-ARCHITECTURE.md** (API routes, Claude integration)
3. Read: **03-DATABASE-SCHEMA.md** (SQL migrations, RLS)
4. Refer to: **05-LAUNCH-CHECKLIST.md** (week 1-2 tasks for you)
5. Start: `git checkout -b [your-name]/asrs-module` (week 1)

**Time to productive:** 1 hour

---

### **Scenario 2: I'm a Frontend Engineer (React/Next.js)**

1. Read: **CLAUDE.md** (master context)
2. Read: **01-ADHD-SAAS-PRD.md** (user flows, pages)
3. Read: **04-UI-UX-SPECIFICATION.md** (wireframes, components, Tailwind)
4. Skim: **02-TECHNICAL-ARCHITECTURE.md** (API routes you'll call)
5. Refer to: **05-LAUNCH-CHECKLIST.md** (week 1-2 frontend tasks)
6. Start: `git checkout -b [your-name]/landing-page` (week 1)

**Time to productive:** 1.5 hours

---

### **Scenario 3: I'm a QA/Test Engineer**

1. Read: **CLAUDE.md** (master context)
2. Read: **01-ADHD-SAAS-PRD.md** (acceptance criteria, test scenarios)
3. Read: **05-LAUNCH-CHECKLIST.md** (validation gates, metrics)
4. Skim: **04-UI-UX-SPECIFICATION.md** (wireframes for test plans)
5. Start: Build test matrix for week 1-2

**Time to productive:** 1 hour

---

### **Scenario 4: I'm a Product Manager**

1. Read: **CLAUDE.md** (overview)
2. Read: **01-ADHD-SAAS-PRD.md** (product vision, features, market)
3. Read: **05-LAUNCH-CHECKLIST.md** (timeline, gates, metrics)
4. Refer to: **02-TECHNICAL-ARCHITECTURE.md** (for feasibility discussions)

**Time to productive:** 1 hour

---

### **Scenario 5: I'm an LLM (Claude/GPT) Being Asked to Code Something**

1. **Start in CLAUDE.md** — this tells you what we're building and constraints
2. **Jump to relevant doc:**
   - Feature request? → **01-ADHD-SAAS-PRD.md**
   - API design? → **02-TECHNICAL-ARCHITECTURE.md**
   - Database question? → **03-DATABASE-SCHEMA.md**
   - UI component? → **04-UI-UX-SPECIFICATION.md**
   - Deployment? → **05-LAUNCH-CHECKLIST.md**
3. **Execute immediately** — no clarifying questions needed (we've answered them all)
4. **Follow the workflow** in CLAUDE.md section 2.3 (branch → test → PR → deploy)

---

## 🎯 Quick Start (For Impatient Builders)

**If you have 30 minutes:**

```bash
# 1. Read CLAUDE.md (15 min)
# 2. Read your domain doc (15 min)
# 3. git clone [repo]
# 4. pnpm install
# 5. pnpm dev
# 6. Start coding
```

**If you have 5 minutes:**

```
Read CLAUDE.md section 2 (Architecture) and section 3 (Database).
Then look at 05-LAUNCH-CHECKLIST.md.
Find your week's task.
Go.
```

---

## 🔒 What's Frozen?

These cannot change without approval from K. (product owner):

```
✓ Tech stack (Next.js 15, Tailwind, shadcn, Supabase, Claude API)
✓ Business model ($49/$199 pricing tiers)
✓ Market (North America first, English)
✓ Core features (ASRS, interview, family input, report, directory)
✓ Safety boundaries ("Preparation only", not diagnosis)
✓ Database schema (tables, RLS policies)
✓ API endpoints (routes, method signatures)
```

**What CAN change:**
- UI polish (colors, spacing, fonts — within Tailwind)
- Question wording (ASRS, interview — within DSM-5 bounds)
- Interview logic (vagueness detection threshold, follow-up triggers)
- Additional validation rules (age checks, etc.)
- Performance optimizations (caching, indexing)

---

## 📊 Architecture at a Glance

```
┌─ Next.js 15 (Frontend + API Routes)
│  ├─ Tailwind CSS + shadcn/ui
│  ├─ TypeScript strict mode
│  └─ Client: SPA, Server: Node.js serverless
│
├─ Supabase PostgreSQL (Data)
│  ├─ Users, Assessments, Responses, Reports
│  ├─ RLS policies (per-user data isolation)
│  └─ pgvector (for future embeddings)
│
├─ Upstash Redis (Cache)
│  └─ Session storage, query cache
│
├─ Anthropic Claude (AI)
│  ├─ Sonnet (interviews, $0.002 per session)
│  └─ Opus (Council v3.2, $0.15 per review)
│
└─ Vercel (Deployment)
   ├─ Edge functions, auto-scaling
   ├─ GitHub Actions CI/CD
   └─ CodeRabbit, Snyk, Sentry monitoring
```

---

## 🎬 MVP Timeline

```
WEEK 1: Foundation + ASRS
  ├─ Repo setup, auth API, ASRS module
  └─ Gate: ASRS works, <2 sec load time

WEEK 2: Interview + Family Input
  ├─ AI interview engine, family module, report generation
  └─ Gate: 5 full interviews, no crashes

WEEK 3: Clinical Validation
  ├─ 10 closed-loop cases (patient → clinician)
  ├─ Code review, security scan
  └─ Gate: ≥80% diagnostic concordance

WEEK 4: Beta Launch
  ├─ Clinician directory, final QA
  ├─ Deploy to production
  └─ Gate: Public beta live
```

---

## ✅ Success Criteria

**Phase 0-1 Validation Gates:**

| Gate | Metric | Target |
|------|--------|--------|
| **Week 1** | ASRS load time | <2 sec FCP |
| **Week 1** | Code coverage | ≥80% |
| **Week 2** | Interview completion | 45 ± 10 min |
| **Week 2** | NPS | ≥50 |
| **Week 3** | Diagnostic concordance | ≥80% match |
| **Week 3** | Security scan | 0 high-severity issues |
| **Week 4** | Uptime | 99.5%+ |

**All must pass. If any fail: fix + re-test before proceeding.**

---

## 🛠 Tech Stack Reference

| Layer | Tech | Version |
|-------|------|---------|
| **Frontend** | Next.js | 15.x |
| **CSS** | Tailwind CSS | 3.4+ |
| **Components** | shadcn/ui | latest |
| **Language** | TypeScript | 5.x |
| **Runtime** | Node.js | 20+ |
| **Database** | Supabase PostgreSQL | 15+ |
| **Cache** | Upstash Redis | managed |
| **AI** | Anthropic Claude | API (Sonnet 4, Opus 4.5) |
| **Deployment** | Vercel | managed |
| **Package Manager** | pnpm | 9.x (locked) |

**No exceptions. No substitutions.**

---

## 🚫 Common Mistakes (Don't Do These)

```
❌ "I'll use npm instead of pnpm"
   → Git blame me if you do. pnpm is locked in package.json.

❌ "Let me use Material-UI for components"
   → No. Only shadcn/ui. It's simpler, cheaper, faster.

❌ "I'll skip unit tests for this feature"
   → No. ≥80% coverage required. CodeRabbit will fail your PR.

❌ "Let me add Stripe payment processing"
   → No. That's Phase 2. MVP is free tier only.

❌ "I'll store passwords in plaintext"
   → No. Supabase Auth handles this. Use auth.uid() context.

❌ "I'll commit my .env file"
   → No. Use GitHub Secrets. .env is in .gitignore.

❌ "I'll claim this diagnoses ADHD"
   → No. This is preparation-only. Every page must say so.

❌ "I'll skip the security scan"
   → No. Snyk must pass before merge. Non-negotiable.
```

---

## 📞 Support & Questions

**If you get stuck:**

1. **Check CLAUDE.md** (section 7 has escalation path)
2. **Check the relevant PRD doc** (might be covered already)
3. **Ask in daily standup** (we discuss blockers)
4. **Open a GitHub issue** with tag `[question]`
5. **DM K.** for urgent issues only

**Don't:**
- Invent solutions not in the PRD
- Skip sections because they seem obvious
- Assume decisions that aren't explicit

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-05-02 | Initial PRD suite, Phase 0-1 complete |

---

## 🔐 Confidentiality

This PRD suite contains:
- Product strategy
- Technical architecture
- Market positioning
- Financial modeling
- Clinical validation plans

**Share only with:**
- Core development team
- Investors/stakeholders (with NDA)
- Clinical advisors (relevant sections only)

**Do not share:**
- Publicly (until launch)
- With competitors
- On unencrypted channels

---

## 📧 Ownership & Contact

| Role | Person | Contact |
|------|--------|---------|
| **Product Owner** | K. (CCW) | — |
| **Lead Architect** | CCW | — |
| **Tech Lead** | [TBD] | — |
| **Repository** | GitHub org | [link] |

---

## 🎓 Training Resources

**New to the project? Start here:**

1. Read **CLAUDE.md** (30 min)
2. Read your domain's **PRD doc** (1 hr)
3. Clone repo, run locally (30 min)
4. Pick a Week 1 task from **LAUNCH-CHECKLIST.md** (start here)
5. Ask in standup if unclear

**New to tech stack?**

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase Getting Started](https://supabase.com/docs/guides/getting-started)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

**New to Anthropic Claude?**

- [Claude API Docs](https://docs.anthropic.com/)
- [Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Vision Capabilities](https://docs.anthropic.com/en/docs/build-with-claude/vision)

---

## ✨ Final Thoughts

This PRD is **comprehensive, frozen, and executable.**

It's designed so that **any engineer or LLM can pick it up and start building immediately** without additional meetings, clarifications, or approval cycles.

**Every decision is documented. Every edge case is covered. Every tech choice is justified.**

If something feels missing, it's intentional (Phase 2). If something feels ambiguous, check the document table of contents.

**You have everything you need. Go build.**

---

**README END**

**Next step: Start with CLAUDE.md. Then pick your domain doc. Then code.**
