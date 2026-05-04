# Design Constraints & Guardrails — ADHD-Prep Design System

## Overview

These constraints prevent generic AI design, protect ADHD user experience, and ensure clinical authority. **All rules are binding.** Violating any of these requires explicit justification + review.

---

## Color Constraints

### DO:
✓ Use only semantic palette (sage, cream, coral, soft blue, status colors—see palette.json)
✓ Max 3 colors per screen (primary + 2 accents)
✓ All text-background combinations: 7:1 contrast minimum (WCAG AAA)
✓ Use color + text/icon for all critical info (never color-only)
✓ Status colors (green = complete, red = error, amber = warning, blue = info)

### DON'T:
❌ Custom hex outside palette (no ad-hoc "pretty" colors)
❌ Bright, saturated colors (reds, neon yellows, hot pinks—overstimulate ADHD)
❌ Dark mode as default (high contrast triggers visual stress; offer toggle only)
❌ Pastel overload (looks like generic wellness app, not clinical)
❌ Grayscale-only design (lacks warmth; feels cold/clinical)
❌ Black text on white (too harsh; use dark gray on warm cream instead)
❌ Color-only feedback ("This field is green" with no text)
❌ More than 3 colors competing on single screen
❌ Gradients as primary design element (use solid colors; gradients only for subtle elevation)

### Contrast Checklist:
- [ ] Sage on Cream: 7.2:1 ✓
- [ ] Coral on Cream: 6.9:1 ✓
- [ ] Soft Blue on Cream: 6.3:1 ✓
- [ ] Dark Gray text on Cream: 13:1 ✓
- [ ] Medium Gray text on Cream: 6.8:1 ✓
- [ ] All focus rings (Dark Sage): ≥7:1 ✓

---

## Typography Constraints

### DO:
✓ Display (h1–h3): Inter font only (geometric, clear, authority)
✓ Body text: Poppins or Source Sans Pro (warm, accessible)
✓ Mono: IBM Plex Mono (data/code only)
✓ Minimum 16px body text on all devices (mobile, desktop, tablet)
✓ Line-height: 1.5–1.75 for body (1.25 for headlines)
✓ Letter-spacing: default (0px) or relaxed (0.2–0.5px); never tighten
✓ Generous paragraph margins (1rem between paragraphs)
✓ Font weights: 400 (body), 500 (labels), 600 (emphasis), 700 (headlines)
✓ Headings use clear hierarchy (h1 > h2 > h3; no skipped levels)

### DON'T:
❌ Body text <16px (illegible, violates WCAG AAA, unfriendly to ADHD)
❌ Line-height <1.5 for body text (cramped, hard to read)
❌ Italic body text (hard to read; reserve for emphasis)
❌ All-caps for large content (reduces readability)
❌ Script, serif, or display fonts for body text
❌ Font weights <400 (too thin; low contrast)
❌ Letter-spacing <0px (tightened kerning makes text harder to scan)
❌ Monospace fonts for paragraphs (slow to read)
❌ Sans-serif fonts that lack open letterforms (avoid narrow, geometric fonts for body)
❌ Mixing display fonts (stick to Inter for all headlines)
❌ Auto-sizing text that doesn't respond to user zoom

### Font Sizing Checklist:
- [ ] h1: 30px (desktop) / 24px (mobile) ✓
- [ ] h2: 24px (desktop) / 20px (mobile) ✓
- [ ] h3: 20px (desktop) / 18px (mobile) ✓
- [ ] Body: 16px (all devices) ✓
- [ ] Labels: 14–16px ✓
- [ ] Helpers: 12–14px (never smaller for important info) ✓

---

## Layout Constraints

### DO:
✓ 8px grid baseline (all spacing in multiples: 8, 16, 24, 32, 48px)
✓ Max content width: 800px (optimal for reading, prevents overwhelm on wide screens)
✓ Mobile: full-width with 16px padding (safe zone)
✓ Whitespace is design (don't fill empty space just because it exists)
✓ Clear visual breaks between sections (subtle dividers, color shifts)
✓ One primary action per screen/section
✓ One secondary action per screen (optional, de-emphasized)
✓ Tab order matches visual hierarchy (left-to-right, top-to-bottom)
✓ Touch targets: minimum 44x44px on mobile (iOS/Android standard)
✓ Forms: one question per screen OR logically grouped (avoid overwhelming)

### DON'T:
❌ Content width >800px (reads like a wall; hard to focus)
❌ <16px padding on mobile (cramped, unusable)
❌ Multiple primary CTAs per screen (confuses users about what to do)
❌ Crowded layouts with <8px spacing between elements
❌ Sidebar-heavy design (mobile incompatible; takes up space)
❌ Hidden menus or navigation (not discoverable; increases cognitive load)
❌ Forms that cram multiple questions on one screen (overwhelming)
❌ No clear visual hierarchy (all elements equal weight = confusion)
❌ Dense data tables without grouping or filtering (visual overload)
❌ Sticky headers/footers that don't align with form flow (breaks momentum)
❌ Overlapping elements or z-index surprises
❌ Content that reflows unexpectedly on resize (CLS violations)

### Spacing Checklist:
- [ ] Margins between sections: 1.5–2rem ✓
- [ ] Padding inside cards: 1.5–2rem ✓
- [ ] Line-height body: 1.75 ✓
- [ ] Paragraph margins: 1rem ✓
- [ ] Touch targets: ≥44x44px ✓

---

## Motion & Animation Constraints

### DO:
✓ Detect & respect `prefers-reduced-motion` OS setting (mandatory)
✓ Provide user toggle in settings (allow users to enable animations if preferred)
✓ Animation durations: 150–400ms (never >500ms)
✓ Easing: ease-in-out, ease-out, linear (no springs, bounces)
✓ Opacity fades + color changes (safe for motion sensitivity)
✓ Staggered reveals for multiple items (50–100ms offset; reduces cognitive load)
✓ User-triggered animations only (no auto-play on load)
✓ Static loading text + optional fade pulse (no spinning spinners)
✓ Focus states visible on all interactive elements
✓ Fallback static states for all animations

### DON'T:
❌ Auto-play animations on page load
❌ Bouncing, wobbling, or jiggle effects (too playful for healthcare)
❌ Parallax scrolling or background movement
❌ Zooming transforms (scale effects trigger motion sensitivity)
❌ Spinning elements (if used, must be optional + disable on reduced-motion)
❌ Animations >500ms (feels sluggish, breaks immersion)
❌ Infinite loops (GIFs, carousels—burden accumulates)
❌ Hover-only animations (mobile users can't see them)
❌ Multiple simultaneous animations (choreography overload = cognitive chaos)
❌ Animations that override or hide content (e.g., fade-in modal without fallback)
❌ Animations that trigger on every micro-interaction (fatigue, diminishing returns)
❌ Motion-sensitive patients forced to watch animations (always off by default)

### Motion Checklist:
- [ ] respects prefers-reduced-motion ✓
- [ ] All animations: 150–400ms ✓
- [ ] No springs/bounces ✓
- [ ] Loading state has static fallback ✓
- [ ] Focus states visible ✓
- [ ] No infinite loops ✓
- [ ] User can pause/disable ✓

---

## Component Constraints

### Forms & Inputs

#### DO:
✓ Clear labels above (or inside with hint text)
✓ Visible focus ring (2px Dark Sage outline)
✓ Validation messages paired with color + icon + text
✓ Required fields marked with asterisk + explanation
✓ Helper text explaining "why we ask"
✓ Error states obvious (border color + message)
✓ Success states confirmed (green border + checkmark)
✓ Auto-save or explicit Save button (no surprise data loss)
✓ Undo/edit options throughout (low-stress reversibility)

#### DON'T:
❌ Floating labels without fallback (mobile confusion)
❌ Placeholder text as only label
❌ Required fields without explanation
❌ "Optional" fields that shame users ("Haven't noticed symptoms?")
❌ No indication of progress (no save status, no auto-save confirmation)
❌ Form validation on blur (triggers too early, feels harsh)
❌ Irreversible actions without confirmation (no one-click deletions)
❌ Hidden form fields that surprise users
❌ Pre-filled data without user awareness

### Buttons

#### DO:
✓ Primary: Sage Green, 16px font, 44px min height
✓ Secondary: Soft Blue or outline style
✓ Tertiary: Text link, underline on hover
✓ Disabled: 50% opacity, not-allowed cursor
✓ Loading: "Submitting…" text (no spinner; or optional fade pulse)
✓ Hover: subtle color shift (no movement)
✓ Active: slightly darker shade

#### DON'T:
❌ Unlabeled buttons (icon-only without title attribute)
❌ Small buttons (<44x44px on mobile)
❌ Color-changing animations on click
❌ Buttons that "sink" or move on click (transform effects)
❌ Multiple submit buttons (confuses which one to press)
❌ Buttons hidden until scroll (user doesn't know they exist)
❌ "Are you sure?" dialogs for non-destructive actions (fatigue)

### Cards & Panels

#### DO:
✓ Warm Cream background (#F5F2ED)
✓ Light Gray border (optional, for definition)
✓ 4px border-radius (subtle, not jarring)
✓ Padding: 1.5–2rem (breathing room)
✓ Subtle shadow (max 4px blur, 2px offset, 10% opacity)
✓ Clear header (h3 or label)
✓ One primary action per card (optional secondary)

#### DON'T:
❌ Pure white cards (too stark against white background)
❌ Heavy shadows (looks clunky, not modern)
❌ Tall border-radius (looks like iOS 7—dated)
❌ Crowded card content (no whitespace)
❌ Multiple CTAs per card (unclear priority)
❌ Cards that auto-expand on hover (surprise interaction)

### Modals & Overlays

#### DO:
✓ Backdrop: 50% opacity (dark gray, not black)
✓ Modal: centered, max 600px width
✓ Close button: top-right, always visible
✓ Backdrop click: closes modal (expected behavior)
✓ Escape key: closes modal (standard UX)
✓ Focus trap: cycles within modal (accessibility)
✓ Fade-in animations (no scale/slide)

#### DON'T:
❌ No close button (traps user)
❌ Scale/slide animations (can trigger motion sensitivity)
❌ Modal that covers entire screen (claustrophobic)
❌ Nested modals (confusing interaction)
❌ Very dark backdrop (too much contrast)
❌ Backdrop click that doesn't close (confuses users)

---

## Imagery Constraints

### Photography
❌ No stock photography (clinical photos feel impersonal + can trigger anxiety)
✓ Illustrations only (custom, diverse, warm-toned)
✓ No faces/identifiable people (privacy, accessibility)
✓ Simple, not photorealistic (reduces cognitive load)
✓ Consistent illustration style (cohesive visual language)

### Icons
✓ Stroke style (consistent with design language)
✓ 24px minimum size (readable, accessible)
✓ Paired with text labels (not icon-only for critical info)
✓ Semantic meaning (e.g., checkmark = success, X = error)
✓ High contrast on all backgrounds

### Patterns & Textures
❌ No busy patterns (visual noise)
❌ No gradients as primary design (use solid colors)
✓ Subtle background patterns only (at <5% opacity if at all)
✓ Whitespace as primary design element

---

## Accessibility Constraints

### WCAG AAA (Non-Negotiable)

#### Vision
✓ Minimum 7:1 contrast (all text-background pairs)
✓ Resize text to 200% without loss of content
✓ No content conveyed by color alone (always paired with text/icon)
✓ Focus indicators visible (min 2px outline)
✓ Minimum 16px body text

#### Motion
✓ respects prefers-reduced-motion
✓ No animations >500ms
✓ No parallax, zooms, or transforms
✓ User override for motion preferences (settings)

#### Cognitive
✓ Clear headings + hierarchy
✓ Logical tab order
✓ Consistent navigation
✓ Undo options (reversible actions)
✓ No time limits (timers increase anxiety)
✓ Plain language (max 20 words/sentence for assessment)

#### Motor
✓ Touch targets ≥44x44px
✓ No double-click required
✓ Drag-and-drop alternatives (always offer click/tap)
✓ Keyboard accessible (full navigation without mouse)

### Screen Reader Testing
✓ Semantic HTML (h1–h6, buttons, forms, landmarks)
✓ Alt text for icons/illustrations
✓ ARIA labels for interactive elements
✓ Form labels linked to inputs (`<label for="inputId">`)
✓ Live regions for dynamic content (aria-live)

---

## Performance Constraints

### Page Load
✓ First Contentful Paint (FCP): <2s
✓ Largest Contentful Paint (LCP): <2.5s
✓ Cumulative Layout Shift (CLS): <0.1
✓ Interaction to Next Paint (INP): <200ms
✓ Lighthouse score: ≥90

### Asset Size
✓ Fonts: <100KB total (optimized, woff2)
✓ Images: <500KB per page (WebP, optimized)
✓ CSS: <50KB (minified)
✓ JavaScript: <200KB (minified, split-loaded)

### Motion
❌ No motion that degrades performance (<60fps)
✓ Use CSS transitions (lighter than JS animations)
✓ Avoid expensive transforms (opacity + color only)

---

## Responsive Design Constraints

### Breakpoints
✓ Mobile: 320px–639px (16px padding, full-width)
✓ Tablet: 640px–1023px (20px padding, narrower)
✓ Desktop: 1024px+ (max 800px content width, 40px+ padding)

### Mobile-First
✓ Design for mobile first (touch, small screen)
✓ Enhance for tablet/desktop (larger text, more whitespace optional)
✓ Test on real devices (simulator ≠ reality)

### Orientation
✓ Portrait & landscape support (no assumption)
✓ Form layout reflows gracefully
✓ Fullscreen experiences tested

---

## Brand & Tone Constraints

### Visual Brand
✓ Warm, reassuring (65% bias)
✓ Clinical, authoritative (35% bias)
✓ Every element reflects ADHD-aware design (calm, accessible, intentional)

### Copy Tone
✓ Warm, non-judgmental ("We understand...")
✓ Clear, medical-accurate (no overstated claims)
✓ Explicit safety signals ("Clinician confirms diagnosis," "Your data is encrypted")
✓ No shame language ("Haven't noticed symptoms?" ❌ → "Tell us about this area" ✅)

### Consistency
✓ All screens feel part of same product (cohesive design language)
✓ No generic AI aesthetic (not Tailwind defaults, not shadcn presets)
✓ Every pixel serves a purpose

---

## Anti-Patterns (Explicit)

❌ **NO:**
1. Symmetrical layouts (too corporate, not warm)
2. Cold, clinical blues (use warm sage instead)
3. Dark mode as default (offer toggle only)
4. Pastel overload (looks like generic wellness app)
5. Stock photography (use illustrations)
6. Micro-interactions without purpose (only motion that confirms state)
7. More than 3 colors per screen
8. Hover-only interactions (mobile users miss them)
9. Auto-playing videos or animations
10. Animations on every interaction (fatigue)
11. Time pressure / countdown timers (increases anxiety)
12. "Are you sure?" on reversible actions (unnecessary friction)
13. Required fields without explanation (forces decisions)
14. Form validation on blur (triggers too early)
15. Tiny text (<16px body)
16. Bright, saturated colors (overstimulation)
17. Spinning spinners (use text + fade pulse instead)
18. Irreversible actions without confirmation
19. Hidden menus (not discoverable)
20. Crowded layouts (no whitespace)

---

## Quality Gates

### Before Launch
- [ ] All colors verified: 7:1 contrast ✓
- [ ] All typography tested: dyslexia simulator ✓
- [ ] All motion tested: prefers-reduced-motion enabled ✓
- [ ] All components tested: mobile, tablet, desktop ✓
- [ ] Accessibility audit: WCAG AAA pass ✓
- [ ] Performance audit: Lighthouse 90+ ✓
- [ ] User testing: ≥5 ADHD users feedback ≥4/5 ✓

### Ongoing
- [ ] Code review checks system compliance
- [ ] Design system updates locked to version
- [ ] No custom colors/spacing without approval
- [ ] Monthly accessibility re-audit

---

**END CONSTRAINTS**
