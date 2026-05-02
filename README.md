# hex-adhd-prep

**ADHD Diagnostic SaaS MVP** — Spec-driven development with Turborepo, Next.js, Supabase, and Claude AI.

🚀 **Status:** Foundation phase (Week 1 of MVP)  
📦 **Tech Stack:** Turborepo, Next.js 15, TypeScript, Tailwind CSS, Supabase, Claude API  
🎯 **Product Name:** ADHD-Prep (adhd-prep.com)  

---

## 📋 Quick Start

### Prerequisites
- Node.js >= 20
- pnpm >= 8
- Git

### Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Run linting
pnpm lint

# Code generation (specs → types → logic)
pnpm codegen
```

### Deploy to Vercel

```bash
# Link to Vercel (first time)
vercel

# Deploy on push to main (automatic via GitHub Actions)
```

---

## 🏗️ Repository Structure

```
hex-adhd-prep/
├── apps/
│   ├── web/              # Next.js MVP (frontend + API routes)
│   ├── mobile/           # Expo (added in Phase 2)
│   └── api/              # Supabase Edge Functions (future)
│
├── packages/
│   ├── ui/               # Shared React components (Tailwind + shadcn)
│   ├── types/            # Generated TypeScript types (from specs)
│   ├── logic/            # Scoring engine (from specs)
│   ├── specs/            # YAML specs (SINGLE SOURCE OF TRUTH)
│   ├── hooks/            # Shared React hooks
│   ├── config/           # Constants + Zod schemas
│   ├── api-client/       # Shared API client
│   ├── cache/            # Redis wrapper (Upstash)
│   ├── database/         # Migrations + RLS
│   └── agent/            # Unified Dev Agent (CEK + Caveman + SDD)
│
├── docs/                 # Architecture, API, schema docs
├── scripts/              # Codegen pipeline, validation
├── .github/workflows/    # CI/CD (test, lint, deploy)
│
├── CLAUDE.md             # Master control document (READ FIRST)
├── tsconfig.json         # Root TypeScript config (with path mappings)
├── turbo.json            # Turborepo build orchestration
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root workspace definition
```

---

## 🔧 Development Workflow

### 1. **Read CLAUDE.md First**
Always start here. It contains:
- Product vision
- Tech stack decisions
- Development guardrails
- Escalation paths

### 2. **Specs → Code Pipeline**

Everything starts with specs:
```
/packages/specs/adhd/questionnaire.yaml
  ↓ (pnpm codegen)
/packages/types/questionnaire.ts
/packages/logic/scoring.ts
/apps/web/app/assessment/*
```

### 3. **Test-First Development**

```bash
# Write test first (RED)
pnpm test -- --watch

# Write code to pass test (GREEN)

# Refactor + lint (REFACTOR)
pnpm lint:fix

# Commit + push
git push origin [feature-branch]
```

### 4. **Code Review Gates**

All PRs must pass:
- ✅ Jest tests (≥80% coverage)
- ✅ ESLint
- ✅ TypeScript strict mode
- ✅ Snyk security scan (automated)
- ✅ CodeRabbit AI review (automated)

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Master control (read first always)
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System design
- **[API-SPEC.md](./docs/API-SPEC.md)** — API endpoints
- **[DATABASE-SCHEMA.md](./docs/DATABASE-SCHEMA.md)** — Data model
- **[10X-ARCHITECTURE-CRITIQUE.md](./docs/10X-ARCHITECTURE-CRITIQUE.md)** — Optimizations applied

---

## 🎯 Week 1 Tasks (MVP Phase 0-1)

- [ ] ASRS module (10 questions, scoring, risk classification)
- [ ] API routes for ASRS submission
- [ ] Type-safe frontend forms
- [ ] Basic styling (Tailwind)
- [ ] Unit tests (≥80% coverage)
- [ ] Deploy skeleton to Vercel
- [ ] Health check endpoint

### Success Metrics
- FCP (First Contentful Paint) < 2 seconds
- Test coverage ≥ 80%
- Zero linting errors
- Zero security vulnerabilities

---

## 🚀 Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server (all apps parallel) |
| `pnpm build` | Build all packages + apps |
| `pnpm test` | Run all tests |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Lint all code |
| `pnpm lint:fix` | Fix linting errors |
| `pnpm type-check` | TypeScript type check |
| `pnpm format` | Format with Prettier |
| `pnpm codegen` | Generate types + logic from specs |
| `pnpm specs:validate` | Validate YAML specs |
| `pnpm clean` | Clean build artifacts |

---

## 📦 Key Dependencies

- **Framework:** Next.js 15, React 18
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Database:** Supabase (PostgreSQL + RLS)
- **Cache:** Upstash Redis
- **Validation:** Zod
- **Testing:** Jest, React Testing Library
- **AI:** Claude API (Anthropic)
- **Build:** Turborepo
- **Package Manager:** pnpm

---

## 🔐 Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in Supabase credentials (create account + project)
3. Fill in Anthropic API key
4. Fill in Upstash Redis credentials (optional, for Phase 2)

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b [your-name]/[feature]`
2. Implement feature (test-first)
3. Pass all checks: `pnpm test && pnpm lint && pnpm type-check`
4. Push: `git push origin [feature-branch]`
5. Create PR on GitHub
6. Wait for CodeRabbit + Snyk approval
7. Merge when green

See [CLAUDE.md](./CLAUDE.md) for guardrails + escalation.

---

## 📞 Support

- **Questions?** Check [CLAUDE.md](./CLAUDE.md) (answers 90% of questions)
- **Architecture issues?** See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Database questions?** See [DATABASE-SCHEMA.md](./docs/DATABASE-SCHEMA.md)
- **Blocker?** Open GitHub issue with `[blocker]` tag

---

## 📄 License

MIT — Hex-Tech-Lab

---

**Last Updated:** 2026-05-02  
**Repo:** https://github.com/Hex-Tech-Lab/hex-adhd-prep  
**Vercel:** https://vercel.com/techhypexps-projects
