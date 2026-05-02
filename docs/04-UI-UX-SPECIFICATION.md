# UI/UX COMPONENT SPECIFICATION
**Version:** 1.0  
**Design System:** Tailwind CSS + shadcn/ui  
**Target Devices:** Desktop (1920px), Tablet (768px), Mobile (375px)  
**Status:** MVP Phase 0-1

---

## 1. DESIGN SYSTEM TOKENS

### **1.1 Color Palette**

```css
/* Primary Colors */
--primary: #3B82F6;           /* Blue */
--primary-light: #DBEAFE;
--primary-dark: #1E40AF;

/* Semantic Colors */
--success: #10B981;           /* Green */
--warning: #F59E0B;           /* Amber */
--danger: #EF4444;            /* Red */
--info: #0EA5E9;              /* Cyan */

/* Neutral Colors */
--background: #FFFFFF;
--surface: #F9FAFB;
--border: #E5E7EB;
--text-primary: #1F2937;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
--gradient-subtle: linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%);
```

### **1.2 Typography**

```css
/* Font Stack */
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */

/* Line Heights */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;

/* Font Weights */
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

### **1.3 Spacing Scale**

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### **1.4 Border Radius**

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-full: 9999px;
```

---

## 2. WIREFRAMES & PAGE LAYOUTS

### **2.1 Landing Page**

```
┌──────────────────────────────────────────────────────┐
│  NAVBAR: Logo | [blank] | Sign In | Get Started    │
├──────────────────────────────────────────────────────┤
│                                                       │
│  HERO SECTION (Center aligned)                      │
│  ───────────────────────────────────────────────────│
│                                                       │
│  Headline (h1):                                      │
│  "Prepare for your ADHD evaluation"                 │
│                                                       │
│  Subheadline:                                        │
│  "Structured AI-guided assessment. Clinician-ready  │
│   report. Not a diagnosis."                          │
│                                                       │
│  CTA Buttons (2 column):                             │
│  ┌────────────────┬────────────────┐                │
│  │ Start $49      │ Start $199     │                │
│  │ (Primary Blue) │ (Secondary)    │                │
│  └────────────────┴────────────────┘                │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  TRUST SIGNALS (3 cards, horizontal grid)            │
│  ┌──────────┬──────────┬──────────┐                 │
│  │ 45-min   │ Not a    │ Clinician│                 │
│  │ Assessment│ Diagnosis│ Confirmed│                │
│  └──────────┴──────────┴──────────┘                 │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  VALUE PROPS (4 sections)                            │
│  • Memory scaffolding                                │
│  • Family input module                               │
│  • AI-powered clarity                                │
│  • Clinician directory integration                   │
│                                                       │
├──────────────────────────────────────────────────────┤
│                                                       │
│  PRICING COMPARISON                                 │
│  ┌──────────────┬──────────────┐                    │
│  │ $49 TIER     │ $199 TIER    │                    │
│  │ • ASRS test  │ • All $49    │                    │
│  │ • AI interview
│  │ • Family input
│  │ • PDF report │ • Council v3.2 review             │
│  │              │ • Confidence scoring              │
│  │              │ • Comorbidity flags               │
│  └──────────────┴──────────────┘                    │
│                                                       │
├──────────────────────────────────────────────────────┤
│  FAQ Accordion (6 items)                            │
├──────────────────────────────────────────────────────┤
│  FOOTER: Links | Social | Copyright                 │
└──────────────────────────────────────────────────────┘
```

**Component Breakdown:**

```tsx
// src/components/landing/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
        Prepare for your ADHD evaluation
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl mb-8">
        Structured AI-guided assessment. Clinician-ready report. Not a diagnosis.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Start $49 Assessment
        </Button>
        <Button size="lg" variant="outline">
          Start $199 Premium
        </Button>
      </div>
    </section>
  );
}

// src/components/landing/TrustSignals.tsx
export function TrustSignals() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {signals.map(signal => (
          <Card key={signal.id} className="text-center p-6">
            <signal.Icon className="w-8 h-8 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900 mb-2">{signal.title}</h3>
            <p className="text-sm text-gray-600">{signal.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

---

### **2.2 Assessment Onboarding**

```
┌──────────────────────────────────────────────────────┐
│ Assessment Onboarding                                │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Step 1/5: Create Your Account                      │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │ Email Address                                  │ │
│  │ [_________________________________]            │ │
│  │                                                 │ │
│  │ Age                                            │ │
│  │ [__]  (required: 18+)                         │ │
│  │                                                 │ │
│  │ Timezone                                       │ │
│  │ [Dropdown: America/New_York ▼]                 │ │
│  │                                                 │ │
│  │ Language                                       │ │
│  │ [Dropdown: English ▼]                         │ │
│  └────────────────────────────────────────────────┘ │
│                                                       │
│  ┌────────────────────────────────────────────────┐ │
│  │ ☑ I understand this is NOT a diagnosis.       │ │
│  │   Only a clinician can diagnose ADHD.         │ │
│  │                                                 │ │
│  │ ☑ I understand this tool helps me prepare for │ │
│  │   my evaluation.                               │ │
│  │                                                 │ │
│  │ Emergency Resources:                           │ │
│  │ If you're having thoughts of self-harm,       │ │
│  │ please contact [local helpline].              │ │
│  └────────────────────────────────────────────────┘ │
│                                                       │
│  [Continue] or [Already have an account? Sign in]  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// src/components/assessment/OnboardingForm.tsx
export function OnboardingForm() {
  const [formData, setFormData] = useState({ email: '', age: '', timezone: '', language: 'en' });
  const [consents, setConsents] = useState({ understand: false, privacy: false });

  return (
    <form className="space-y-6">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age"
            type="number"
            min="18"
            max="120"
            placeholder="25"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={formData.timezone} onValueChange={(v) => setFormData({...formData, timezone: v})}>
            <SelectTrigger id="timezone">America/New_York</SelectTrigger>
            <SelectContent>
              {timezones.map(tz => (
                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200 p-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox 
              id="understand"
              checked={consents.understand}
              onCheckedChange={(checked) => setConsents({...consents, understand: checked})}
            />
            <Label htmlFor="understand" className="text-sm cursor-pointer">
              I understand this is NOT a diagnosis. Only a clinician can diagnose ADHD.
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox 
              id="privacy"
              checked={consents.privacy}
              onCheckedChange={(checked) => setConsents({...consents, privacy: checked})}
            />
            <Label htmlFor="privacy" className="text-sm cursor-pointer">
              I understand my data will be securely stored and only shared with my permission.
            </Label>
          </div>
        </div>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <strong>Emergency Resources:</strong> If you're having thoughts of self-harm, please contact:
        </p>
        <ul className="mt-2 text-sm text-amber-900 space-y-1">
          <li>• 988 Suicide & Crisis Lifeline (US)</li>
          <li>• Crisis Text Line: Text HOME to 741741</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={!consents.understand || !consents.privacy}>
          Continue to Assessment
        </Button>
      </div>
    </form>
  );
}
```

---

### **2.3 ASRS Screening Module**

```
┌──────────────────────────────────────────────────────┐
│ Step 2/5: ADHD Screening                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Progress: ████████░░ 40% Complete                   │
│                                                       │
│ ASRS Screening (v1.1)                               │
│                                                       │
│ Question 1 of 18:                                    │
│ "How often do you have trouble wrapping up the      │
│  final details of a project, once the challenging   │
│  parts have been done?"                              │
│                                                       │
│ Response Options:                                    │
│ ○ Never     ○ Rarely   ○ Sometimes   ○ Often   ○ Very Often
│                                                       │
│ Question 2 of 18:                                    │
│ ...                                                   │
│                                                       │
│ [< Back] [Continue →]                               │
│                                                       │
│ ⏱ Estimated time: 10 minutes                        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// src/components/assessment/ASRSForm.tsx
export function ASRSForm({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const questions = asrsQuestions(); // 18 questions

  const handleResponse = (value) => {
    setResponses({
      ...responses,
      [questions[currentIndex].id]: value
    });
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const progress = Math.round((Object.keys(responses).length / questions.length) * 100);

  return (
    <div className="space-y-6">
      <ProgressBar value={progress} />

      <Card className="p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Question {currentIndex + 1} of {questions.length}
        </h3>

        <p className="text-base text-gray-700 mb-6">
          {questions[currentIndex].text}
        </p>

        <RadioGroup value={responses[questions[currentIndex].id] || ''} onValueChange={handleResponse}>
          <div className="space-y-3">
            {['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'].map((label, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </Card>

      <div className="flex justify-between gap-4 pt-6">
        <Button variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}>
          ← Back
        </Button>
        <div className="text-sm text-gray-600">
          ⏱ Estimated: 10 minutes
        </div>
        <Button 
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              onComplete(responses);
            } else {
              setCurrentIndex(currentIndex + 1);
            }
          }}
          disabled={!responses[questions[currentIndex].id]}
        >
          {currentIndex === questions.length - 1 ? 'Complete' : 'Next'} →
        </Button>
      </div>
    </div>
  );
}
```

---

### **2.4 AI Interview Chat Interface**

```
┌──────────────────────────────────────────────────────┐
│ Step 3/5: Detailed Interview                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Progress: ████████████░░ 65% Complete               │
│ Section: Childhood Symptoms (9 of 18 questions)    │
│                                                       │
│ ┌────────────────────────────────────────────────┐ │
│ │ Message History:                               │ │
│ │                                                 │ │
│ │ AI: "Let's explore your ADHD symptoms. First, │ │
│ │ as a child (age 5-12), did you often lose    │ │
│ │ things like toys, books, or homework?"        │ │
│ │                                                 │ │
│ │ You: "Yeah, all the time. My parents would    │ │
│ │ say I was always losing things."              │ │
│ │                                                 │ │
│ │ AI: "That's helpful. Can you give me a        │ │
│ │ specific example from school or home?"        │ │
│ │                                                 │ │
│ │ ⟳ Thinking...                                  │ │
│ └────────────────────────────────────────────────┘ │
│                                                       │
│ Your Response:                                       │
│ ┌────────────────────────────────────────────────┐ │
│ │ I'd lose my backpack every week. Teachers     │ │
│ │ complained I wasn't organized.                 │ │
│ │                                                 │ │
│ │ [Type here...                               ]  │ │
│ │                                                 │ │
│ │ [Send] or [Skip & Save] or [Back]            │ │
│ └────────────────────────────────────────────────┘ │
│                                                       │
│ ⏱ Estimated remaining: 40 minutes                  │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Implementation:**

```tsx
// src/components/assessment/InterviewChat.tsx
export function InterviewChat({ assessmentId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [section, setSection] = useState('childhood');
  
  async function handleSend() {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Save response to DB
      const response = await fetch('/api/assessment/interview/save-response', {
        method: 'POST',
        body: JSON.stringify({
          assessment_id: assessmentId,
          response: input,
          follow_up_trigger: input.length < 20 // vague answer detection
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      // Get next AI question
      const nextResponse = await fetch('/api/interview/next-question', {
        method: 'POST',
        body: JSON.stringify({
          assessment_id: assessmentId,
          section,
          current_question_index: messages.length / 2
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const nextQ = await nextResponse.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: nextQ.question_text, context: nextQ.context }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <ProgressBar value={65} />
        <p className="text-sm text-gray-600 mt-2">
          Section: {section} ({(messages.length / 2)} of 18 questions)
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-2xl">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-lg max-w-xs ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.content}</p>
                {msg.context && (
                  <p className="text-xs opacity-75 mt-2">💡 {msg.context}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg rounded-bl-none">
                <div className="animate-pulse">⟳ Thinking...</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t bg-gray-50">
        <Textarea
          placeholder="Type your response here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="mb-4"
          rows={3}
        />
        <div className="flex gap-3">
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
          <Button variant="outline" onClick={() => {/* skip */}}>
            Skip & Save
          </Button>
          <Button variant="ghost">← Back</Button>
        </div>
        <p className="text-xs text-gray-600 mt-2">⏱ Estimated remaining: 40 minutes</p>
      </div>
    </div>
  );
}
```

---

### **2.5 Report Preview & PDF Download**

```
┌──────────────────────────────────────────────────────┐
│ Step 5/5: Your Report                                │
├──────────────────────────────────────────────────────┤
│                                                       │
│ Your ADHD Pre-Assessment Report is Ready!           │
│                                                       │
│ ┌────────────────────────────────────────────────┐ │
│ │ EXECUTIVE SUMMARY                              │ │
│ │                                                 │ │
│ │ • Pattern: Predominantly inattentive symptoms  │ │
│ │ • Childhood: Strong consistency (7/9 symptoms)│ │
│ │ • Adulthood: High severity (8/9 symptoms)     │ │
│ │ • Functional impact: Work & organization      │ │
│ │ • Family input: Spouse confirms childhood     │ │
│ │   disorganization                              │ │
│ │ • Areas to clarify: Sleep patterns, anxiety   │ │
│ │                                                 │ │
│ │ ⚠️ This is preparation only.                  │ │
│ │ Clinician confirmation required.              │ │
│ └────────────────────────────────────────────────┘ │
│                                                       │
│ [📥 Download PDF] [📧 Email Report] [🔗 Share Link] │
│                                                       │
│ ┌────────────────────────────────────────────────┐ │
│ │ NEXT STEP: Find a Clinician                    │ │
│ │                                                 │ │
│ │ [Search for ADHD Specialists →]                │ │
│ └────────────────────────────────────────────────┘ │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 3. RESPONSIVE DESIGN BREAKPOINTS

```css
/* Mobile-first approach */
/* Base (mobile): 375px+ */
/* Tablet: 768px+ */
/* Desktop: 1024px+ */
/* Wide: 1280px+ */

.container {
  @apply px-4;
  max-width: 100%;
}

@media (min-width: 768px) {
  .container {
    @apply px-6;
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## 4. SHADCN/UI COMPONENTS INVENTORY

**Used in MVP:**

```
✓ Button (variants: default, outline, ghost, destructive)
✓ Input (text, email, number, textarea)
✓ Label
✓ Card
✓ Dialog (modals)
✓ RadioGroup
✓ Checkbox
✓ Select (dropdown)
✓ Progress (progress bar)
✓ ScrollArea
✓ Tabs (report sections)
✓ Badge (risk levels, tags)
✓ Alert (warnings, info)
✓ Skeleton (loading state)
✓ Toast (notifications)
```

**Installation:**

```bash
pnpm dlx shadcn-ui@latest init

# Add components
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add card
# ... etc
```

---

## 5. TAILWIND CONFIGURATION

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

---

## 6. ANIMATION & TRANSITIONS

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

/* Slide up */
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

/* Loading pulse */
.animate-pulse {
  opacity: 1;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 7. ACCESSIBILITY STANDARDS

**WCAG 2.1 Level AA Compliance:**

```
✓ Semantic HTML (button, form, label, etc.)
✓ Alt text on all images
✓ ARIA labels on form inputs
✓ Keyboard navigation (Tab, Enter, Escape)
✓ Focus indicators (visible on all interactive elements)
✓ Color contrast ≥4.5:1 for text
✓ Touch targets ≥44×44px on mobile
✓ Screen reader announcements for async updates
✓ No flashing/blinking (no seizure triggers)
```

**Testing Tools:**
- axe DevTools
- WAVE browser extension
- Lighthouse (Chrome DevTools)
- Screen reader: NVDA (Windows), VoiceOver (macOS)

---

**END UI/UX SPECIFICATION**
