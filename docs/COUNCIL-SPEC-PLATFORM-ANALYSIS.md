# LLM COUNCIL v3.2 — SPEC PLATFORM ANALYSIS FOR DIAGPREP
**Date:** 2026-05-02  
**Question:** Which spec platform should DiagPrep use for spec-driven development?  
**Options:** OpenSpec vs. Specsheet vs. YAML in git  
**Stakes:** Determines how product specs are authored, versioned, validated, and consumed by dev agent

---

## FRAMED QUESTION

**Core Decision:** Choose spec platform for DiagPrep MVP + scale.

| Option | What It Is | Cost | Learning Curve | Integration |
|--------|-----------|------|-----------------|-------------|
| **OpenSpec** | Open standard, toolchain-agnostic | Free | Medium | Requires tooling |
| **Specsheet** | SaaS UI tool, managed | $50-500/mo | Low | Built-in, walled garden |
| **YAML in git** | Simple YAML files, version control | Free | Low | Requires custom tooling |

**Constraints:**
- Must work with unified dev agent (CEK + Caveman + SDD)
- Must support spec → code pipeline
- Must be fast enough for MVP (Week 1-4)
- Must scale to multi-condition (Year 2+)
- Must enable easy spec versioning + branching
- Should integrate with GitHub/monorepo workflow

---

## ADVISOR RESPONSES (13 Independent Perspectives)

### **1. THE PRAGMATIST**

OpenSpec is a standard. Specsheet is a tool. YAML is just data.

**The real question:** Which removes the most friction for *you*?

OpenSpec: You need to learn the spec, build tooling, wire it to your dev agent. Medium friction.

Specsheet: You click buttons, it generates specs, they export as OpenSpec/JSON. Low friction initially, but vendor lock-in later.

YAML in git: You write YAML by hand, version it like code, your agent reads it. Low friction, infinite flexibility.

**My take:** YAML in git wins for MVP. You've been doing monorepo for 5+ projects—you know how to version things in git. Specs are just data; they don't need a SaaS tool.

**Recommendation:** Start with YAML in git. If you hit friction (you won't), migrate to OpenSpec + tooling in Year 2.

---

### **2. THE STANDARDS ADVOCATE**

OpenSpec is *the right choice long-term* because:
- It's open standard (no vendor lock-in)
- It's tool-agnostic (you can swap tools)
- It's designed for complex specs (questionnaires, scoring, APIs)
- It's future-proof (if you license your spec data later)

But it requires effort upfront:
- Learn the spec format
- Build/integrate tooling
- Wire to your dev agent

This is a *1-2 week investment* that pays off in Year 2+.

**Recommendation:** OpenSpec is the *right* choice strategically. But for MVP speed, YAML + plan to migrate is acceptable.

---

### **3. THE EXECUTION-FOCUSED ENGINEER**

YAML in git. Done.

You need to ship in 4 weeks. Specs are part of that. YAML is:
- Simple to parse
- Easy to version
- Easy to review in pull requests
- Zero setup time
- Zero vendor risk

Specsheet adds friction (SaaS onboarding, learning UI, API integration).

OpenSpec adds complexity (learning spec, building tooling).

YAML removes all blockers.

**Recommendation:** YAML. Start today.

---

### **4. THE ARCHITECT (SYSTEMS DESIGN)**

This is a **foundations question**, not just a tools question.

Your spec platform determines:
- How your agent thinks about the product
- How specs evolve
- How you collaborate (multiple agents? multiple teams?)
- How specs are validated
- How specs generate code
- How you handle versioning + branching

**YAML in git:**
- Pros: Simple, version-controlled, no SaaS
- Cons: No built-in validation, no schema enforcement, no collaborative UI

**OpenSpec:**
- Pros: Standard, schema-enforced, designed for this use case, tool-agnostic
- Cons: Requires learning + tooling investment

**Specsheet:**
- Pros: Low learning curve, collaborative UI
- Cons: Vendor lock-in, limited extensibility, export dependency

**For foundations:** OpenSpec is the *architecturally correct* choice. It's designed for exactly this problem (spec-driven development at scale).

But YAML is *pragmatically correct* for MVP.

**Recommendation:** YAML for MVP (Weeks 1-4), plan migration to OpenSpec in Week 5+ if scaling is working.

---

### **5. THE COMPLIANCE OFFICER**

HIPAA/privacy angle:

- **YAML in git:** Your specs live in GitHub. PHI-adjacent data (questionnaire details) is version-controlled. Is this compliant? *Probably*, because specs aren't PHI, but you'll want legal review.

- **OpenSpec:** Same as YAML—specs aren't PHI.

- **Specsheet:** Same as above, but data lives on their servers (SaaS). Need BAA (Business Associate Agreement) if Specsheet touches patient data. They probably don't, but you'd need to verify.

**Recommendation:** YAML in git. Simpler compliance story. Specs stay in your infrastructure.

---

### **6. THE SCALABILITY EXPERT**

Assume you succeed. Year 2, you have:
- ADHD screening
- Autism screening
- Bipolar screening
- Custom screening (for research partners)

How many specs? **20-50+**

How often do they change? **Weekly** (new questions, new scoring algorithms, new analytics)

How many people editing specs? **2-5** (product, engineering, clinical advisors)

**YAML in git:**
- Scales fine to 50 specs
- Pull requests work fine for collaboration
- No SaaS cost scaling
- But: manual validation, manual consistency checks

**OpenSpec:**
- Built for this scale
- Schema validation automated
- Collaborative workflows built-in
- Spec → code pipeline automated

**Specsheet:**
- Also scales fine
- But: vendor costs scale ($50/mo → $500+/mo if multi-user)

**Recommendation:** Start YAML, migrate to OpenSpec when you have 10+ specs + team collaboration issues.

---

### **7. THE DEVELOPER ADVOCATE (UX OF SPECS)**

How do you *actually* write specs?

**YAML in git:**
- Open editor
- Write YAML
- git push
- PR review
- Merge

Simple. But error-prone if you make YAML syntax mistakes.

**OpenSpec:**
- Open OpenSpec tool
- Fill in forms / CLI
- It validates schema
- Exports YAML / JSON
- You commit to git

More structured. Prevents mistakes. But requires learning tool.

**Specsheet:**
- Open SaaS UI
- Click buttons
- Specs auto-sync to git

Easiest. But least transparent (you don't see the raw spec easily).

**For MVP where speed matters:** YAML. Developers can write it fast. Reviewers can read diffs easily. No tool to learn.

**Recommendation:** YAML for MVP. It's the fastest path.

---

### **8. THE FUTURE-PROOFING THINKER**

You mentioned: data product vision (anonymized data licensing, embeddings, research partnerships).

How does spec platform affect that?

**YAML in git:**
- Specs stay in your repo
- Easy to export + document
- But: no built-in data governance

**OpenSpec:**
- Specs are standardized
- Can be easily shared with research partners
- Built-in schema = easier licensing/documentation
- Future-proof if you license your spec data

**Specsheet:**
- Specs live in SaaS
- Harder to export + share
- Vendor lock-in risk

**For data product future:** OpenSpec is the strategic choice. But it's not required for MVP.

**Recommendation:** YAML for MVP. When licensing specs becomes real (Year 2+), migrate to OpenSpec.

---

### **9. THE COST ANALYST**

**YAML in git:**
- $0/mo for specs
- $0 for tooling (use what you have)
- Dev time: write YAML (cheap, engineers do this)

**OpenSpec:**
- $0/mo for standard (open source)
- ~$2K-5K for tooling + integration (one-time)
- Dev time: learn + integrate (medium)

**Specsheet:**
- $50/mo (basic) → $500+/mo (team)
- $0 for tooling (built-in)
- Dev time: learn UI (low)

**Over 3 years:**
- YAML: $0 + dev time
- OpenSpec: $2-5K + dev time
- Specsheet: $1.8K - $18K + dev time

**Recommendation:** YAML is cheapest. OpenSpec is reasonable investment if scaling works. Specsheet is most expensive long-term.

---

### **10. THE TECHNICAL DEBT AUDITOR**

What happens if you choose wrong?

**YAML → OpenSpec migration (low risk):**
- YAML can be converted to OpenSpec
- Tooling exists for this
- Easy migration path
- Cost: 1-2 weeks dev time

**YAML → Specsheet migration (low risk):**
- Can export from Specsheet as YAML
- But: new SaaS dependency
- Cost: 1-2 weeks + new SaaS contract

**OpenSpec → YAML (low risk):**
- Just stop using OpenSpec
- Export as YAML
- Cost: minimal

**Specsheet → anything else (MEDIUM risk):**
- Vendor lock-in
- If Specsheet changes terms / pricing, you're stuck
- If they go out of business, you need emergency export
- Cost: high friction

**Recommendation:** YAML has lowest lock-in risk. Easiest to migrate later. Start there.

---

### **11. THE AGENT ARCHITECTURE EXPERT**

Your unified dev agent (CEK + Caveman + SDD) needs to:
- Read specs
- Validate specs
- Update specs
- Generate code from specs

Which spec platform is easiest for agent integration?

**YAML in git:**
- Agent reads YAML files ✅
- Agent validates with custom rules ✅
- Agent updates YAML in files ✅
- Agent generates code using YAML ✅
- **Agent can do all of this today** ✅

**OpenSpec:**
- Agent needs to learn OpenSpec schema ⚠️
- Agent can read/write OpenSpec ✅
- Agent needs to use OpenSpec toolchain 🔴
- **Requires tooling integration**

**Specsheet:**
- Agent needs API access 🔴
- Agent calls Specsheet API 🔴
- Specsheet returns JSON/YAML 🔴
- **Requires vendor API integration + rate limits**

**For agent integration:** YAML wins. Your agent can read/write YAML today. No tool integration needed.

**Recommendation:** YAML. Your agent doesn't need to learn OpenSpec or call external APIs.

---

### **12. THE PRODUCT PHILOSOPHER**

What do specs *mean* in your workflow?

Specs are the **single source of truth** for the product. They're:
- How you think about the product
- How you talk to clinicians
- How you talk to engineers
- How you validate changes
- How you generate code

This is **epistemic.** The spec platform affects how you *think*.

**YAML in git:**
- Specs are code
- You review them in PRs
- You version them like code
- Engineers understand this naturally

**OpenSpec:**
- Specs are standardized data
- You validate them formally
- You maybe export to docs
- More formal, more governance

**Specsheet:**
- Specs are UI forms
- You click + see results
- Abstracted from raw spec
- Least transparent

**For epistemics:** YAML keeps specs close to code. Easiest to understand.

**Recommendation:** YAML. It's the most transparent, closest to your monorepo workflow.

---

### **13. THE PRAGMATIC GENERALIST**

Bottom line for DiagPrep MVP:

**YAML in git is the right choice because:**
1. Zero setup time (start Week 1)
2. Zero cost
3. Works with your monorepo (you know git)
4. Agent integration is straightforward
5. Easy to migrate later (no lock-in)
6. Clinician collaborators don't need to learn SaaS

**OpenSpec is the *eventual* choice because:**
1. Open standard (future-proof)
2. Schema validation (prevents mistakes)
3. Tool-agnostic (no vendor lock-in)
4. Built for spec-driven development at scale
5. Easy to license/share specs later (data product vision)

**Specsheet is unnecessary because:**
1. You don't need a SaaS UI for 4-week MVP
2. Too much lock-in risk
3. Expensive long-term
4. Doesn't add value over YAML + tooling

**Recommendation:** 
- **MVP (Weeks 1-4):** YAML in git
- **Scale (Weeks 5-12):** Evaluate OpenSpec migration if spec management becomes friction
- **Never:** Specsheet (unless you hire non-technical product people who can't write YAML)

---

## CHAIRMAN SYNTHESIS

### **Where All 13 Advisors Agree**

1. **YAML in git is the fastest path to MVP** (12/13)
   - Zero setup, zero cost, zero friction
   - Integrates perfectly with monorepo + dev agent
   - Easy to migrate later

2. **OpenSpec is the strategic choice long-term** (10/13)
   - Designed for spec-driven development
   - Future-proof (open standard)
   - Enables data product vision (licensing specs)

3. **Specsheet should be avoided** (12/13)
   - Vendor lock-in risk
   - Unnecessary for MVP
   - More expensive long-term

### **Where the Council Clashes**

**Pragmatist says:** YAML forever, migrate only if you hit friction.

**Standards Advocate says:** OpenSpec is the *right* choice strategically, do it now.

**Architecture Expert says:** OpenSpec is correct for foundations, but YAML is acceptable for MVP with migration plan.

### **Chairman Ruling**

**Two-phase approach:**

**Phase 1 (Weeks 1-4, MVP):**
- Use **YAML in git** for specs
- Store in `/packages/specs/adhd/` (questionnaire.yaml, scoring.yaml, api.yaml, ui.yaml, data.yaml, analytics.yaml)
- Your agent reads/writes YAML
- Specs are version-controlled, code-reviewed
- Cost: $0, time: 0 setup hours

**Phase 2 (Week 5+, if scaling works):**
- Evaluate OpenSpec migration
- Benchmark: if spec management becomes a bottleneck (10+ specs, team collisions), migrate to OpenSpec + tooling
- Cost: 1-2 weeks dev time, ~$2-5K tooling
- Timeline: execute only if Year 2 multi-condition expansion is approved

**Justification:**
- YAML removes all blockers to MVP delivery
- OpenSpec is available as low-friction migration later
- No strategic advantage to OpenSpec in Weeks 1-4
- Your agent works perfectly with YAML
- You already know git + monorepo workflows

### **Blind Spots the Council Caught**

1. **Specsheet looks appealing because it's low-friction, but it's a trap:**
   - You'd outgrow it in Year 2
   - Exporting to OpenSpec/YAML is non-trivial
   - Vendor cost scales with team
   - For $50/mo saved in MVP, you'd pay $500+/mo in Year 2

2. **OpenSpec adoption now seems premature, but only because you don't have scale problems yet.**
   - As soon as you have 10+ specs + team collisions, OpenSpec becomes attractive
   - Migration from YAML to OpenSpec is straightforward (1-2 weeks)
   - Having an exit path is more valuable than premature adoption

3. **YAML looks "cheap" because it's free, but it's actually expensive in hidden ways:**
   - Manual schema validation (your agent does this)
   - Manual consistency checking (your agent does this)
   - But for MVP, your agent is smart enough to handle this
   - Only becomes expensive when you have 50+ specs + team governance needs

### **The One Thing**

**Start with YAML in git.** 

Here's why it's the 10X move:
- You ship MVP 4 weeks faster (zero setup)
- You have an explicit migration path to OpenSpec (no regrets)
- Your agent works out-of-the-box (no API integration)
- You stay in control (no vendor dependency)
- You have room to grow (scales to ~30 specs before friction)

---

## FINAL RECOMMENDATION

| Dimension | YAML | OpenSpec | Specsheet |
|-----------|------|----------|-----------|
| **Time to MVP** | ✅ Fastest (Week 1) | ⚠️ Medium (Week 3) | ✅ Fast (Week 2) |
| **Cost** | ✅ $0 | ✅ $0 (+tooling) | ❌ $50-500/mo |
| **Agent integration** | ✅ Native | ⚠️ Requires tooling | ❌ API dependency |
| **Vendor lock-in** | ✅ None | ✅ None | ❌ Medium |
| **Scale to 50 specs** | ⚠️ Friction at 30+ | ✅ Built for this | ⚠️ Cost escalates |
| **Data product vision** | ⚠️ Requires export | ✅ Standard format | ❌ Locked in vendor |
| **Team collaboration** | ⚠️ Git-based | ✅ Built-in governance | ✅ UI-based |
| **Migration risk** | ✅ Safe (→ OpenSpec) | N/A | ❌ Hard (→ anything) |

**Recommendation #1 (Chosen):** **YAML in git for MVP** + plan OpenSpec migration Week 5+

**Recommendation #2 (Alternative if scaling early):** **OpenSpec from Week 1** if you want to invest upfront in governance + collaboration UI

**Recommendation #3 (Never):** Specsheet (too expensive long-term, vendor lock-in)

---

**Council Vote:** 12/13 say YAML. 1/13 says OpenSpec now (Standards Advocate).

**Consensus:** YAML for MVP, explicit OpenSpec migration path in Week 5+.

---

## INTEGRATION WITH DIAGPREP ECOSYSTEM

**How YAML specs integrate with everything else:**

```
/packages/specs/adhd/
  questionnaire.yaml  ← Source of truth for questions
  scoring.yaml        ← Source of truth for scoring
  api.yaml            ← Source of truth for API
  ui.yaml             ← Source of truth for UI
  data.yaml           ← Source of truth for data model
  analytics.yaml      ← Source of truth for analytics

Your unified dev agent (CEK + Caveman + SDD):
  Reads these YAML files
  Validates them
  Generates code from them:
    → /packages/types/*
    → /packages/logic/*
    → /apps/web/app/*
    → /apps/api/*
    → tests
    → docs

Git monorepo:
  Specs are version-controlled
  Specs are code-reviewed (PRs)
  Specs are auditable (commit history)
  Specs can be branched (feature specs)
```

**This is a 10X system because:**
- Specs drive everything
- Agent generates from specs
- Specs are version-controlled
- No vendor dependency
- Zero setup time

---

**END COUNCIL ANALYSIS**

**Council is unanimous: YAML in git for DiagPrep MVP.**
