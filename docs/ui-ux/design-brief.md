# ADHD-Prep Design System Brief

## Product Context

- **Name:** ADHD-Prep (SaaS diagnostic prep assessment)
- **Category:** Healthcare (clinical decision support, patient intake)
- **Primary Users:** Adults 18+ seeking ADHD evaluation; high anxiety, rejection-sensitive, neurodivergent
- **Core Problem:** Unstructured patient narratives → diagnostic loss; patient anxiety during intake; clinician time waste

---

## User Research Summary

### Pain Points
- **Cognitive load:** ADHD users struggle with multi-step forms, executive function, sustained attention
- **Anxiety:** Rejection sensitivity, fear of being "wrong" or not ADHD enough
- **Information loss:** Vague memories of childhood; difficulty articulating symptoms under pressure
- **Clinician friction:** Manual intake is 45+ min; requires follow-up clarifications

### Key Moments of Truth
1. **Landing:** "Is this for me? Will this be safe and not stigmatizing?"
2. **Onboarding:** "I need to understand what data I'm sharing, why, and how it's used"
3. **ASRS screening:** "Quick win; confidence builder; low friction"
4. **AI interview:** "Can this system understand me? Will it judge me?"
5. **Report review:** "Does this make sense? Can I use this with my clinician?"
6. **Clinician directory:** "Where do I go next? Is it private/safe?"

### Device & Context
- **Primary:** Desktop/tablet (40+ min assessments; quiet, private environment)
- **Secondary:** Mobile (research phase, referral access, follow-up)
- **Context:** High-anxiety, low-distraction-tolerance environment; may resume across sessions

---

## Design Philosophy

### Three Pillars

1. **Calm by Default**
   - Soft, muted palette (greens + warm creams) reduce sensory overload
   - Generous whitespace, breathing room—never crowded
   - No surprise animations; motion is earned, never auto-play

2. **Clear Authority Without Coldness**
   - Clinical rigor (structured data, labeled sections, professional typography) builds trust
   - Warm color + open letterforms soften the clinical distance
   - Explicit safety signals ("This is prep only," "Your data is encrypted," "Clinician confirms diagnosis")

3. **Cognitive Kindness**
   - Progress bars, section breaks, pause/resume everywhere
   - No cognitive tricks (dark patterns, forced decisions)
   - Undo, edit, clarify options throughout
   - Dyslexia-friendly font + 1.5+ line-height for reading ease

---

## Visual Strategy

### Color Logic

**Primary: Sage Green (#5B8C6C)**
- Research: Soft green improves focus, reduces anxiety in ADHD users
- Usage: Progress bars, confirmations, primary CTAs, focus states
- Psychology: Nature-grounded, calming without being clinical

**Secondary: Warm Cream (#F5F2ED)**
- Usage: Backgrounds, cards, surface elevation
- Psychology: Approachable, human-centered; avoids sterile white

**Accent: Muted Coral (#D4876A)**
- Usage: Secondary actions, gentle urgency (e.g., "Add family input"), warmth
- Psychology: Approachable without overstimulation; avoids red's aggression

**Neutrals: Cool Gray (#374151 text, #E5E7EB borders)**
- Usage: Text hierarchy, borders, dividers
- Psychology: Authority, clarity; cooler grays maintain clinical tone

**Status Colors:**
- Success: Sage Green (reinforces calm + progress)
- Warning: Warm amber (#D4A574—muted, not bright)
- Error: Soft red (#D97676—clear but not alarming)
- Info: Soft blue (#6B9BC5—secondary info, not primary action)

---

### Typography Logic

**Display Font: Inter**
- Role: Headlines (h1–h3), section titles
- Why: Geometric, modern, highly legible; signals clarity + authority
- Sizes: 30px (h1), 24px (h2), 20px (h3) at 1.25 line-height

**Body Font: Poppins or Source Sans Pro**
- Role: Body text, form labels, descriptions
- Why: Open letterforms, warm personality; friendly + accessible
- Sizes: 16px desktop / 16px mobile (never smaller); 1.5–1.75 line-height
- Weight: 400 (regular), 500 (medium for labels), 600 (emphasis)

**Mono Font: IBM Plex Mono**
- Role: Data values, timestamps, codes (e.g., session IDs)
- Why: Clinical precision, monospace clarity
- Size: 14px

---

### Motion Logic

**Principle: Intentional, User-Led, Never Surprising**

- **Staggered Content Reveal:** 150–200ms per section (reduces cognitive overwhelm)
- **Confirmation Motion:** Opacity fades + color shifts (safe, no transforms)
- **Status Indicators:** Pulse/fade for "loading" → replaced with static text if prefers-reduced-motion
- **Transitions:** All animations 150–400ms (no springs, no bounces)
- **Auto-Play Rule:** NONE. All motion must be user-triggered or system-confirmation

**Accessibility Mandate:**
- Respects `prefers-reduced-motion` OS setting
- User override toggle in settings (users can enable animations if they want them)
- No loops (GIFs, carousels)—static alternatives always available

---

### Layout Logic

**Grid & Spacing:**
- 8px baseline grid (all spacing in multiples: 8, 16, 24, 32, 48px)
- Max content width: 800px (optimal for reading; not cramped on desktop)
- Mobile: Full-width with 16px padding

**Functional Density:**
- **Per Screen Rule:** 1–2 primary actions, 1 secondary action max
- **Section Pattern:** Clear visual breaks (subtle dividers, color shifts) between sections
- **Form Pattern:** One question per "screen" or logically grouped (not overwhelming)

**Navigation:**
- Top nav: Minimal (logo, progress, settings)
- Progress: Always visible (bar or step indicator—context matters)
- No hidden menus; all options discoverable

---

## Accessibility Requirements

### WCAG Level
**AAA compliance** (not AA; ADHD users often have co-occurring visual/cognitive needs)

### Specific Accessibility Needs

1. **Dyslexia-Friendly Typography**
   - Poppins/Source Sans Pro + generous spacing
   - Atkinson Hyperlegible as optional system-wide override
   - Min 16px body text, 1.5+ line-height

2. **Motion Sensitivity**
   - Respects `prefers-reduced-motion`
   - No parallax, zooms, large transforms
   - Fade/opacity only for motion

3. **Color Contrast**
   - All text: 7:1 contrast (AAA standard)
   - Test: Sage on Cream, Coral on Cream, Gray text on all backgrounds
   - No color-only information (always paired with text/icons)

4. **Cognitive Load**
   - Clear section breaks + progress tracking
   - Undo/edit options throughout (no irreversible actions)
   - Familiar, predictable interactions

5. **Focus Management**
   - Visible 2px outline on all interactive elements
   - Tab order matches visual hierarchy
   - Focus retained after actions (no surprise jumps)

---

## Competitive Differentiation

### What Others Do
- **Clinical platforms (e.g., Ginger, Cerebral):** Cold blues, data-dense, clinical-first
- **Wellness apps (e.g., Headspace):** Pastel overload, generic typography, slow/bouncy motion
- **Traditional intake forms:** Gray form fields, no personality, anxiety-inducing

### Our Approach
- **Hybrid warmth:** Calm authority, not cold clinical or saccharine wellness
- **Respects neurodivergence:** Spacing, motion controls, dyslexia-friendly fonts *built-in*
- **Transparent data:** Every question explains "why we ask," all sections skippable
- **Undo-everything:** Rare in healthcare UX; reduces anxiety ("I can change my mind")

### Forbidden Patterns (Explicit)

1. **No bright, saturated colors** (reds, yellows, hot pinks—overstimulate ADHD users)
2. **No auto-play animations** (breaks anxiety safety)
3. **No dark mode as default** (high contrast can trigger visual stress; offer toggle instead)
4. **No required fields without explanation** (forces decisions, increases anxiety)
5. **No "optional" form sections that shame users** (e.g., "Haven't noticed symptoms?" tone)
6. **No stock photography** (clinical photos feel impersonal; illustrations only)
7. **No micro-interactions without purpose** (bounce, spin, drift—no decoration)
8. **No more than 3 colors per screen** (visual clutter = cognitive load)
9. **No hover-only information** (mobile users miss it; always show on focus/tap)
10. **No time pressure** (countdown timers, session limits increase anxiety)

---

## Success Criteria

✓ **Non-boilerplate:** Visually distinct from Ginger, Cerebral, Headspace, Psychology Today clinician directories

✓ **Branded:** Every element reflects ADHD-aware design (calm colors, accessible typography, intentional motion)

✓ **Accessible:** WCAG AAA, tested with ADHD users + dyslexia simulators

✓ **Production-ready:** Code, not mockups; live components ready for Next.js + MUI

✓ **Intentional:** No generic filler; every pixel serves cognitive or emotional purpose

---

## Success Metrics

- **Page load time (Lighthouse):** 90+ (motion should not impact performance)
- **Accessibility audit:** 100% WCAG AAA pass (including prefers-reduced-motion)
- **User testing:** ≥80% of ADHD users report "felt understood, not judged"
- **Clinician feedback:** ≥80% say "report format is clear and actionable"
- **Conversion:** ≥60% ASRS → interview completion (low friction = low drop-off)

---

**END DESIGN BRIEF**
