# Integrated Flow Test Plan - Medium Priority Issues

## Test Execution Protocol

When Agent Manager worktrees complete and merge:
1. **Fetch & Build** → `git fetch origin && pnpm type-check && pnpm test`
2. **Review Code** → Check changes against acceptance criteria
3. **Integration Test** → Execute critical user flows end-to-end
4. **Report** → Log findings, flag any regressions

---

## Worktree Status Tracker

| Worktree | Issue | Status | Test Date | Result |
|----------|-------|--------|-----------|--------|
| fix/review-error-display | MEDIUM-001 | ⏳ | — | — |
| fix/interview-navigation | MEDIUM-002 | ⏳ | — | — |
| fix/asrs-score-validation | MEDIUM-003 | ⏳ | — | — |
| fix/review-navigation-params | MEDIUM-004 | ⏳ | — | — |
| fix/clinician-filtering | MEDIUM-005 | ⏳ | — | — |
| fix/family-submit-errors | MEDIUM-006 | ⏳ | — | — |
| fix/claude-variable-shadowing | MEDIUM-007 | ⏳ | — | — |
| fix/sentry-production-only | MEDIUM-008 | ⏳ | — | — |
| fix/migration-conflict-clause | DB-003 | ⏳ | — | — |

---

## Integration Test Flows

### Flow 1: Complete Assessment (Start → Results)
**Covers:** MEDIUM-001, MEDIUM-002, MEDIUM-003, MEDIUM-004
```
1. Navigate to /assessment/start
2. Complete ASRS (18 questions)
   ✓ Scores calculate correctly (MEDIUM-003)
3. View ASRS results page
   ✓ Error display shows if any errors (MEDIUM-001)
4. Navigate to History module
   ✓ Navigation params pass assessmentId (MEDIUM-004)
5. Complete History → Impact → Comorbidity → Review
6. Reach review page
   ✓ Assessment data loads (MEDIUM-004)
   ✓ Navigation back/forward works (MEDIUM-002)
7. Submit & view results
```

### Flow 2: Family Input Submission (Token → Thank you)
**Covers:** MEDIUM-005, MEDIUM-006
```
1. Request family input invite from assessment
2. Generate family token link
3. Open family/submit?token=XXX&assessmentId=YYY
   ✓ useSearchParams wrapped in Suspense works (KC-1 prerequisite)
   ✓ Form errors display properly (MEDIUM-006)
4. Submit with invalid data
   ✓ Error messages appear (MEDIUM-006)
5. Submit valid observations
   ✓ Filter clinicians by specialty (MEDIUM-005)
6. Redirect to thank you page
```

### Flow 3: Sentry Error Tracking
**Covers:** MEDIUM-008
```
1. Visit /sentry-example-page
2. Trigger test error
3. Verify error captured in production Sentry (MEDIUM-008)
   ✓ No errors in development mode
   ✓ Only production reports to Sentry
4. Check error contains proper context
```

### Flow 4: Database & Claude Integration
**Covers:** DB-003, MEDIUM-007
```
1. Complete assessment (triggers Claude follow-ups)
2. Verify interview responses saved correctly
   ✓ Migration conflict resolved (DB-003)
3. Check Claude variable scoping (MEDIUM-007)
   ✓ No variable shadowing in Claude client
4. Verify follow-up questions generate without issues
```

---

## Acceptance Criteria Checklist

### MEDIUM-001: Error Display
- [ ] ErrorDisplay component shows errors properly
- [ ] Error messages are user-friendly
- [ ] Errors dismiss correctly
- [ ] No layout shifts on error appearance

### MEDIUM-002: Interview Navigation
- [ ] Next/prev buttons work between interview questions
- [ ] Progress updates as user navigates
- [ ] Back button doesn't lose responses
- [ ] Keyboard navigation works (Tab, Enter)

### MEDIUM-003: ASRS Score Validation
- [ ] Scores calculate correctly (0-4 scale → final score)
- [ ] Risk levels (low/moderate/high) assign correctly
- [ ] Invalid responses rejected with clear feedback
- [ ] Edge cases (all 0s, all 4s) handled correctly

### MEDIUM-004: Review Navigation Params
- [ ] assessmentId properly passed in URL params
- [ ] Review page loads assessment data
- [ ] Navigation back/forward preserves state
- [ ] Params don't leak between assessments

### MEDIUM-005: Clinician Filtering
- [ ] Family input filters clinicians by relationship/region
- [ ] Search by specialty works
- [ ] Results paginate correctly
- [ ] No stale data shown

### MEDIUM-006: Family Submit Errors
- [ ] Form validation shows errors before submit
- [ ] Server errors handled gracefully
- [ ] Network errors show retry option
- [ ] Success message displays on completion

### MEDIUM-007: Claude Variable Shadowing
- [ ] No variable shadowing in claude/client.ts
- [ ] ESLint/type-check passes
- [ ] Claude API calls still work correctly
- [ ] No unexpected variable overwrites

### MEDIUM-008: Sentry Production Only
- [ ] Development: Sentry DSN not used, no error reports
- [ ] Production: Errors captured automatically
- [ ] Error context includes user/assessment info
- [ ] No sensitive data leaked to Sentry

### DB-003: Migration Conflict Clause
- [ ] Migration file has correct SQL syntax
- [ ] Database migration runs without conflicts
- [ ] Existing data preserved
- [ ] New constraints applied correctly

---

## Testing Timeline

1. **As each worktree completes** → Immediate code review
2. **After all 9 complete** → Full integrated flow test
3. **Before KC fix merges** → Ensure no conflicts
4. **After all deploy** → Production validation

---

## Regression Check

After all merges:
- [ ] All 98 tests still passing
- [ ] TypeScript strict mode clean
- [ ] ESLint clean
- [ ] No new warnings in build output
- [ ] Vercel staging deploys successfully
- [ ] No Sentry errors in staging deployment

---

## Owner: Claude (Review/Verify/Orchestrate)
## Status: Monitoring active
## Next: Await worktree completion signals
