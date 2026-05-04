# Motion & Interaction Language — ADHD-Prep Design System

## Overview

Motion in ADHD-Prep serves **one purpose: confirm state change, guide attention, reduce cognitive load.** It never decorates, never surprises, never auto-plays.

**Core Principle:** *Intentional, user-led, respectful of reduced-motion preference.*

---

## Motion Philosophy

### Three Laws

1. **No Surprise Motion**
   - All motion must be triggered by user action OR system state confirmation
   - Never auto-play, never fade in on load, never loop
   - Reduces anxiety + cognitive overload

2. **Minimal Duration**
   - 150–400ms for most transitions
   - Faster (150ms): small UI changes, focus states, input feedback
   - Slower (250–400ms): reveal large content, page transitions
   - Never >500ms (feels sluggish, breaks immersion)

3. **Respect prefers-reduced-motion**
   - Always detect `prefers-reduced-motion: reduce` OS setting
   - Remove all non-essential animation automatically
   - Provide user override toggle in settings
   - Never force motion on users who disabled it

---

## Motion Principles by Interaction Type

### 1. **Page & Section Transitions (Fade-In Reveals)**

**When:** User navigates between assessment sections (e.g., ASRS → Interview)

**Motion:**
- Content opacity: 0 → 1
- Duration: 200–250ms
- Easing: ease-in-out (smooth, not linear)
- No transforms (no slides, no scales)

**Code Example (React/Framer Motion):**
```javascript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>
```

**Rationale:**
- Opacity fades are cognitively safe (don't trigger motion sensitivity)
- 200ms is fast enough to feel responsive without feeling rushed
- Confirms content is ready without distracting animation

**Reduced Motion (prefers-reduced-motion: reduce):**
```javascript
const prefersReducedMotion = usePrefers ReducedMotion();
const duration = prefersReducedMotion ? 0 : 0.2;
```

---

### 2. **Form Input Feedback (Focus, Validation, Submit)**

#### **A. Focus State**
**What:** User tabs to or clicks on an input field

**Motion:**
- Border color: Light Gray → Dark Sage (focus color)
- Box shadow: none → subtle (2px offset, 4px blur, 10% opacity)
- Duration: 100–150ms
- No scale or translate

**Code:**
```css
input:focus {
  border-color: #3D5E4D; /* Dark Sage focus ring */
  box-shadow: 0 0 0 2px #F5F2ED, 0 0 0 4px #3D5E4D;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  outline: none; /* Accessibility: use box-shadow instead */
}
```

**Rationale:**
- Quick response (150ms) = user feels heard
- Color change + shadow = clear visual feedback
- No animation = immediate, no flicker

#### **B. Validation (Success / Error)**

**Success Validation (On Submit)**
- Green checkmark appears (opacity fade, 200ms)
- Field border turns Sage Green (150ms)
- Success message fades in below field (staggered 250ms)

**Code:**
```javascript
<motion.div
  animate={{ opacity: 1 }}
  initial={{ opacity: 0 }}
  transition={{ delay: 0.25, duration: 0.2 }}
>
  ✓ Response saved
</motion.div>
```

**Error Validation (On Submit)**
- Field border turns Soft Red (150ms)
- Error message fades in (200ms, staggered 100ms)
- NO shake, NO pulse, NO bounce (too jarring for anxiety-prone users)

```javascript
// Wrong: Too much motion, increases anxiety
<motion.div animate={{ x: [0, -5, 5, -5, 0] }} />

// Right: Color + fade
<motion.div
  animate={{ borderColor: '#D97676' }}
  transition={{ duration: 0.15 }}
>
  Input error
</motion.div>
```

**Rationale:**
- Color + fade = clear feedback without shock
- No motion (red border alone) = clinical clarity
- Staggered messages = reduces cognitive overwhelm

---

### 3. **Progress Indicators (ASRS Progress Bar, Section Completion)**

**When:** User completes question or section

**Motion:**
- Progress bar fill: previous-width → new-width
- Duration: 250–300ms
- Easing: ease-out (decelerates at end—feels complete)
- Opacity pulse (optional): slight fade-in on new width (150ms)

**Code:**
```javascript
<motion.div
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.25, ease: 'easeOut' }}
  className="progress-bar-fill"
/>
```

**Alt Pattern (Staggered Step Completion):**
- Each section in a multi-step form fades in when completed
- Stagger: 50–100ms between sections (not simultaneous)
- Creates sense of progress without overwhelming

**Code:**
```javascript
{sections.map((section, idx) => (
  <motion.div
    key={idx}
    animate={{ opacity: 1 }}
    initial={{ opacity: 0.5 }}
    transition={{ delay: idx * 0.1, duration: 0.2 }}
  >
    {section}
  </motion.div>
))}
```

**Rationale:**
- Smooth fill = visual satisfaction
- Staggered reveals = breaks cognitive load into chunks
- No surprises = reduces anxiety

---

### 4. **Loading & Pending States (Async Operations)**

**When:** AI processes interview data, generates report, etc.

**Motion:**
- Spinner: NO. Use static "Loading…" text instead.
- OR: If visual spinner used, it should be a pulsing opacity (not rotating)

**Code (Fade Pulse - PREFERRED):**
```javascript
<motion.div
  animate={{ opacity: [0.6, 1, 0.6] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
>
  ⟳ Processing your assessment...
</motion.div>
```

**Code (Spinner - If Required):**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 2s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    opacity: 0.7;
  }
  /* Show static text instead */
  .spinner::after {
    content: 'Processing...';
  }
}
```

**Rationale:**
- Pulse = less disorienting than rotate
- Static text + pulse = more accessible
- prefers-reduced-motion: remove animation, show text

---

### 5. **Modal / Overlay Appearance (Consent, Warnings, Family Input Links)**

**When:** User opens a modal dialog or overlay

**Motion:**
- Backdrop: opacity 0 → 0.5 (200ms)
- Modal content: opacity 0 → 1 (300ms, staggered 50ms after backdrop)
- NO scale, zoom, or slide (can trigger motion sensitivity)

**Code:**
```javascript
<AnimatePresence>
  <motion.div
    animate={{ opacity: 0.5 }}
    initial={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="backdrop"
  />
  <motion.dialog
    animate={{ opacity: 1 }}
    initial={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{ delay: 0.05, duration: 0.25 }}
  >
    {content}
  </motion.dialog>
</AnimatePresence>
```

**Rationale:**
- Sequential fades (backdrop first) = clear layering without shock
- No scale = safe for motion-sensitive users
- Stagger = reduces surprise

---

### 6. **Button Hover & Active States**

#### **Hover State (Desktop Only)**
- Background color: slightly darker (opacity shift)
- Duration: instant (0ms) to 100ms (no motion needed)
- Icon/text: no movement (stay in place)

**Code:**
```css
button:hover {
  background-color: rgba(91, 140, 108, 0.85); /* Sage 85% opacity */
  transition: background-color 100ms ease;
}
```

**Active/Pressed State**
- Background: darker (10% more opacity)
- Box shadow: none (optional on active)
- Duration: instant

**Rationale:**
- Hover/active = state confirmation without animation
- Instant feedback = responsive feel

#### **Disabled State**
- Opacity: 50–60%
- Cursor: not-allowed
- No hover effects
- No animation

---

### 7. **Collapse / Expand (FAQ, Card Expansion)**

**When:** User clicks to expand a collapsible section

**Motion:**
- Max-height: 0 → auto (or measured height)
- Opacity: 0 → 1
- Duration: 200–300ms
- Easing: ease-in-out

**Code:**
```javascript
<motion.div
  animate={{ height: isOpen ? 'auto' : 0 }}
  initial={{ height: 0 }}
  exit={{ height: 0 }}
  transition={{ duration: 0.25 }}
  overflow="hidden"
>
  {content}
</motion.div>
```

**Alt Code (Safer for ADHD—Opacity + Static Height Change):**
```javascript
<motion.div
  animate={{ opacity: isOpen ? 1 : 0 }}
  transition={{ duration: 0.2 }}
>
  {isOpen && <div>{content}</div>}
</motion.div>
```

**Rationale:**
- Smooth height change = satisfying reveal
- Opacity fade = reduces cognitive load
- No overflow visible = clean UI

---

## Animation Timing (Easing Curves)

| Interaction | Duration | Easing |
|---|---|---|
| Focus state | 100–150ms | ease-in-out |
| Input validation | 150–200ms | ease-out |
| Progress bar | 250–300ms | ease-out |
| Content reveal | 200–250ms | ease-in-out |
| Modal fade | 300ms | ease-in-out |
| Collapse/expand | 250–300ms | ease-in-out |
| Hover effects | instant–100ms | none (instant) or ease |

---

## Reduced Motion Specification

### Detection & Implementation

```javascript
// React Hook
import { useReducedMotion } from 'framer-motion';

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
    >
      Content
    </motion.div>
  );
}
```

```css
/* CSS Media Query */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
  }
}
```

### Fallback Behavior

When `prefers-reduced-motion: reduce` is detected:
- ❌ No animations (opacity fades, transitions disabled)
- ✅ Show static versions (loading text instead of spinner, instant state changes)
- ✅ Keep focus states visible (box-shadow outlines)
- ✅ Keep color feedback (success green, error red)

---

## Anti-Patterns (Forbidden Motion)

❌ **NO:**
- Auto-playing animations on page load
- Bouncing, wobbling, or jiggle effects
- Parallax scrolling or background movement
- Zooming transforms (scale > 1.2)
- Spinning elements (except loading spinners—and even those are optional)
- Floating or "drifting" elements
- Animations that exceed 500ms
- Multiple simultaneous animations (choreography overload)
- Looping GIFs or video (infinite motion = cognitive burden)
- Animations triggered on hover (mobile users miss them)

❌ **ESPECIALLY NOT FOR ADHD:**
- "Attention grab" animations (flashing, pulsing, wiggling)
- Micro-interactions with no purpose
- Surprise reveals (fade-in without user trigger)
- Motion on every interaction (diminishing returns, fatigue)

---

## Motion Testing Checklist

- [ ] All animations respect `prefers-reduced-motion`
- [ ] No animation >500ms
- [ ] Loading state has fallback (text, not just spinner)
- [ ] Modal/overlay uses opacity only (no scale/slide)
- [ ] Focus states visible on all interactive elements
- [ ] Hover effects instant or ≤100ms (no motion)
- [ ] Color changes + motion work together (not color-only feedback)
- [ ] Tested on slow devices (older mobile phones)
- [ ] Tested with motion sensitivity turned on (OS setting)
- [ ] All animations serve a purpose (no decoration)
- [ ] No infinite loops unless explicitly intentional (rarely)
- [ ] User can pause/stop animations if they appear

---

## Recommended Libraries

**React:**
- Framer Motion (`useReducedMotion` hook built-in)
- React Spring (physics-based; slower; avoid for healthcare)
- CSS Transitions (preferred for simple fades/color changes)

**CSS:**
- CSS Transitions (`transition: property duration easing`)
- CSS Animations (`@keyframes` + `animation` property)
- Avoid: Bounce libraries, Spring libraries, complex easing curves

---

## Implementation in Next.js + MUI

```javascript
// pages/assessment.tsx
import { motion } from 'framer-motion';
import { usePrefers ReducedMotion } from 'framer-motion';

export default function AssessmentPage() {
  const shouldReduceMotion = usePrefers ReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.25,
        ease: 'easeInOut',
      }}
    >
      {/* Assessment content */}
    </motion.div>
  );
}
```

```typescript
// styles/motion.css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Success Criteria

✓ All motion purposeful (confirms state, guides attention, reduces cognitive load)
✓ respects `prefers-reduced-motion` globally
✓ Durations 150–400ms (never >500ms)
✓ No auto-play animations
✓ Loading/pending states have static fallbacks
✓ Color + motion work together (not color-only)
✓ All interactive elements have visible focus states
✓ Tested on slow devices + motion-sensitivity settings
✓ Zero springs/bounces (clinical context, not playful)
✓ Motion never overrides accessibility (always optional)

---

**END MOTION SPECIFICATION**
