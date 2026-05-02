# 🚀 AUTOMATED PIPELINE - EXECUTE NOW

## In your WSL terminal, run this SINGLE command:

```bash
cd ~/projects/hex-adhd-prep && \
sed -i 's/"dev": "cd apps\/web && npm run dev"/"dev": "cd apps\/web \&\& pnpm dev"/g' package.json && \
cd apps/web && \
pnpm install && \
pnpm build && \
pnpm dev &
```

## What this does (ZERO HUMAN INTERACTION):
1. Fixes npm→pnpm in scripts
2. Installs dependencies
3. Builds application
4. Starts dev server on http://localhost:3000

## Then open browser:
- http://localhost:3000 (Home)
- http://localhost:3000/assessment/asrs (Questionnaire)
- http://localhost:3000/assessment/family (Family Input)
- http://localhost:3000/assessment/review (Review)

All modules are already coded and ready. Dev server will start and stay running.
