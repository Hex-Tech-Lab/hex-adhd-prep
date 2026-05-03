'use client';

import { useState, useEffect } from 'react';
// Note: framer-motion should be installed for animations
// import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Temporary motion components for when framer-motion is not available
const motion = {
  div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  header: ({ children, className, ...props }: any) => <header className={className} {...props}>{children}</header>,
  main: ({ children, className, ...props }: any) => <main className={className} {...props}>{children}</main>,
  section: ({ children, className, ...props }: any) => <section className={className} {...props}>{children}</section>,
  aside: ({ children, className, ...props }: any) => <aside className={className} {...props}>{children}</aside>,
  h1: ({ children, className, ...props }: any) => <h1 className={className} {...props}>{children}</h1>,
  p: ({ children, className, ...props }: any) => <p className={className} {...props}>{children}</p>,
};

const useReducedMotion = () => false;

// ---------- Icons (stroke style, 24px, sage) ----------
function HourglassIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-sage', className)}
      aria-hidden="true"
    >
      <path d="M9 4 H23" />
      <path d="M9 28 H23" />
      <path d="M9 4 V9 C9 13 16 14 16 16 C16 18 9 19 9 23 V28" />
      <path d="M23 4 V9 C23 13 16 14 16 16 C16 18 23 19 23 23 V28" />
    </svg>
  );
}

function DocCheckIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-sage', className)}
      aria-hidden="true"
    >
      <rect x="7" y="6" width="18" height="22" rx="1.5" fill="none" />
      <rect x="11" y="3" width="10" height="5" rx="1" fill="hsl(var(--cream))" />
      <path d="M19 4 V9 H24" />
      <path d="M12 17 L15 20 L20 14" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClipboardIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('text-sage', className)}
      aria-hidden="true"
    >
      <rect x="7" y="6" width="18" height="22" rx="1.5" fill="none" />
      <rect x="11" y="3" width="10" height="5" rx="1" fill="hsl(var(--cream))" />
      <path d="M11.5 14 H20.5" />
      <path d="M11.5 18 H20.5" />
      <path d="M11.5 22 H17" />
    </svg>
  );
}

const TRUST_ICONS = {
  hourglass: HourglassIcon,
  doc: DocCheckIcon,
  clipboard: ClipboardIcon,
};

// ---------- Trust card ----------
interface TrustCardProps {
  iconKey: keyof typeof TRUST_ICONS;
  label: string;
  subtext: string;
  layout?: 'cards' | 'list' | 'inline';
  accent?: 'coral' | 'blue';
}

function TrustCard({ iconKey, label, subtext, layout = 'cards' }: TrustCardProps) {
  const Icon = TRUST_ICONS[iconKey];

  if (layout === 'list') {
    return (
      <div className="flex items-start gap-3 py-4 px-1 border-b border-border last:border-b-0">
        <div className="flex items-center justify-center w-9 h-9 bg-sage-light rounded-md flex-shrink-0">
          <Icon size={24} />
        </div>
        <div>
          <div className="font-semibold text-sm text-primary leading-4">{label}</div>
          <div className="text-xs text-muted-foreground leading-4 mt-1">{subtext}</div>
        </div>
      </div>
    );
  }

  if (layout === 'inline') {
    return (
      <div className="inline-flex items-center gap-2 bg-cream-lighter border border-border px-3 py-2 rounded-full text-sm font-medium text-primary">
        <Icon size={20} />
        <span className="text-sm font-medium">{label}</span>
      </div>
    );
  }

  // cards (default)
  return (
    <div className="bg-white border border-border rounded-lg p-4 flex flex-col gap-1.5 transition-colors hover:border-sage">
      <div className="flex justify-between items-center mb-1">
        <div className="w-11 h-11 bg-sage-light rounded-lg flex items-center justify-center">
          <Icon size={28} />
        </div>
      </div>
      <div className="font-semibold text-sm text-primary leading-4">{label}</div>
      <div className="text-xs text-muted-foreground leading-4">{subtext}</div>
    </div>
  );
}

// ---------- Side panel: a soft, on-brand visual ----------
interface SidePanelProps {
  accent?: 'coral' | 'blue';
}

function SidePanel({ accent = 'coral' }: SidePanelProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setRevealed(true);
      return;
    }
    const timer = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  const accentColor = accent === 'blue' ? 'blue' : 'coral';

  return (
    <div
      className={cn(
        'relative w-full max-w-[460px] transition-opacity duration-500 ease-in-out',
        revealed ? 'opacity-100' : 'opacity-0'
      )}
      aria-hidden="true"
    >
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-xs text-muted-foreground font-mono tracking-wider">SESSION</span>
          <span className="text-xs text-muted-foreground font-mono">ADHD-PREP-2026</span>
        </div>

        <div>
          <div className="text-xs font-medium text-muted-foreground mb-2.5">Assessment progress</div>
          <div className="h-1.5 bg-cream rounded-full overflow-hidden">
            <div className="h-full bg-sage rounded-full transition-all duration-300" style={{ width: '62%' }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono tracking-wide">
            <span>Section 3 of 5</span>
            <span>~17 min remaining</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-[18px] h-[18px] rounded-full bg-sage flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-white">
                <path d="M2 5 L4 7 L8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-primary leading-4">ASRS screening</div>
              <div className="text-xs text-muted-foreground leading-4">18 questions · complete</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[18px] h-[18px] rounded-full bg-sage flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-white">
                <path d="M2 5 L4 7 L8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-primary leading-4">Childhood history</div>
              <div className="text-xs text-muted-foreground leading-4">Ages 5–12 · complete</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[18px] h-[18px] rounded-full border-2 border-sage flex items-center justify-center flex-shrink-0 mt-0.5 relative">
              <div className="w-2 h-2 bg-sage rounded-full" />
            </div>
            <div>
              <div className="text-sm font-semibold text-sage-dark leading-4">AI-guided interview</div>
              <div className="text-xs text-muted-foreground leading-4">Question 7 of 12 · in progress</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[18px] h-[18px] rounded-full border-1.5 border-border flex items-center justify-center flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-normal text-muted-foreground leading-4">Family observations</div>
              <div className="text-xs text-muted-foreground leading-4">Optional · skippable</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-[18px] h-[18px] rounded-full border-1.5 border-border flex items-center justify-center flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-normal text-muted-foreground leading-4">Clinician-ready report</div>
              <div className="text-xs text-muted-foreground leading-4">Generated automatically</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border gap-3">
          <div>
            <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase">PAUSE-RESUME</div>
            <div className="text-sm text-primary font-medium mt-1">Auto-saved · 12:04</div>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-sage-light text-sage-dark px-2.5 py-1.5 rounded-full text-xs font-mono tracking-wide">
            <div className="w-1.5 h-1.5 bg-sage rounded-full" />
            Encrypted
          </div>
        </div>
      </div>

      {/* small floating note */}
      <div className="absolute -left-4 -bottom-7 bg-white border border-border rounded-lg px-3 py-2.5 flex items-start gap-2.5 shadow-sm max-w-[280px]">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
          style={{ backgroundColor: `hsl(var(--${accentColor}))` }}
        >
          i
        </div>
        <div>
          <div className="text-sm font-semibold text-primary leading-4">You can pause anytime</div>
          <div className="text-xs text-muted-foreground leading-4 mt-1">Your responses save as you go.</div>
        </div>
      </div>
    </div>
  );
}

// ---------- LandingHero ----------
interface LandingHeroProps {
  className?: string;
}

export default function LandingHero({ className }: LandingHeroProps) {
  const [stage, setStage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setStage(4); // Show all elements immediately
      return;
    }
    const timeouts = [
      setTimeout(() => setStage(1), 80),
      setTimeout(() => setStage(2), 220),
      setTimeout(() => setStage(3), 360),
      setTimeout(() => setStage(4), 500),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  const trustCards = [
    { iconKey: 'hourglass' as const, label: '45-Minute Assessment', subtext: 'Quick, structured, comprehensive' },
    { iconKey: 'doc' as const, label: 'Not a Diagnosis', subtext: 'Preparation only. Clinician confirms.' },
    { iconKey: 'clipboard' as const, label: 'Clinician-Ready Report', subtext: 'Export as PDF, share with provider' },
  ];

  return (
    <motion.div
      className={cn('min-h-screen bg-cream relative overflow-x-hidden', className)}
    >
      {/* Top bar: minimal, per design system */}
      <motion.header
        className={cn(
          'border-b border-border bg-white/60 backdrop-blur-sm sticky top-0 z-20 transition-opacity duration-500 ease-in-out',
          stage >= 1 ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-6 py-3.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sage-light rounded-lg flex items-center justify-center" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="hsl(var(--sage))" strokeWidth="1.5" />
                <path d="M6 11 L9.5 14.5 L16 8" stroke="hsl(var(--sage))" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="font-semibold text-base text-primary tracking-tight">ADHD-Prep</div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#how" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1.5 px-0.5 rounded-sm">
              How it works
            </a>
            <a href="#science" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1.5 px-0.5 rounded-sm">
              The science
            </a>
            <a href="#privacy" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-1.5 px-0.5 rounded-sm">
              Privacy
            </a>
            <a href="#login" className="text-sm font-medium text-sage-dark hover:text-sage transition-colors py-1.5 px-0.5 rounded-sm">
              Sign in
            </a>
          </nav>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-8 lg:px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-16 items-start">
          {/* LEFT — copy + CTAs + trust cards */}
          <motion.section
            className="max-w-2xl flex flex-col gap-7"
          >
            <motion.div
              className={cn(
                'inline-flex items-center gap-2.5 self-start bg-sage-light text-sage-dark px-3 py-1.5 rounded-full font-mono text-xs font-medium tracking-wide uppercase transition-opacity duration-500 ease-in-out',
                stage >= 1 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <div className="w-1.5 h-1.5 bg-sage rounded-full" />
              <span className="text-xs normal-case font-medium font-sans tracking-normal">For adults considering an ADHD evaluation</span>
            </motion.div>

            <motion.h1
              className={cn(
                'font-bold text-4xl lg:text-5xl text-primary leading-tight tracking-tight transition-opacity duration-500 ease-in-out',
                stage >= 2 ? 'opacity-100' : 'opacity-0'
              )}
            >
              Prepare for your <span className="text-sage-dark relative">
                ADHD evaluation
                <span className="absolute -bottom-1 left-0 right-0 h-2 bg-sage-light -z-10 rounded-sm" />
              </span>
            </motion.h1>

            <motion.p
              className={cn(
                'text-lg text-primary leading-relaxed max-w-xl transition-opacity duration-500 ease-in-out',
                stage >= 2 ? 'opacity-100' : 'opacity-0'
              )}
            >
              Structured AI-guided assessment. Clinician-ready report.
              <br />
              <span className="text-muted-foreground text-base">Not a diagnosis. Takes 45 minutes.</span>
            </motion.p>

            <motion.div
              className={cn(
                'flex gap-3 flex-wrap items-center transition-opacity duration-500 ease-in-out',
                stage >= 3 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <Button
                size="lg"
                className="bg-sage hover:bg-sage-dark text-white border-sage hover:border-sage-dark px-6 py-3 h-auto text-base font-semibold rounded-lg focus:ring-2 focus:ring-sage-dark focus:ring-offset-2 focus:ring-offset-cream"
              >
                <span>Start $49 Assessment</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="ml-2">
                  <path d="M4 9 H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M10 6 L13 9 L10 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border hover:bg-cream-lighter text-primary px-6 py-3 h-auto text-base font-semibold rounded-lg"
              >
                Learn more
              </Button>
            </motion.div>

            <motion.div
              className={cn(
                'flex flex-wrap items-center gap-2 text-sm text-muted-foreground transition-opacity duration-500 ease-in-out',
                stage >= 3 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="text-muted-foreground">
                  <rect x="2.5" y="6" width="9" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 6 V4.5 A2.5 2.5 0 0 1 9.5 4.5 V6" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                HIPAA-aligned · encrypted
              </span>
              <span className="text-muted-foreground/60">·</span>
              <span>Pause and resume anytime</span>
              <span className="text-muted-foreground/60">·</span>
              <span>Refund within 7 days</span>
            </motion.div>

            {/* Trust signal cards */}
            <motion.div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity duration-500 ease-in-out',
                stage >= 4 ? 'opacity-100' : 'opacity-0'
              )}
            >
              {trustCards.map((card) => (
                <TrustCard
                  key={card.iconKey}
                  iconKey={card.iconKey}
                  label={card.label}
                  subtext={card.subtext}
                />
              ))}
            </motion.div>

            <motion.div
              className={cn(
                'bg-cream-lighter border border-border border-l-sage border-l-4 p-4 rounded-lg text-sm text-muted-foreground leading-relaxed transition-opacity duration-500 ease-in-out',
                stage >= 4 ? 'opacity-100' : 'opacity-0'
              )}
            >
              <strong className="text-primary font-semibold">Important:</strong> ADHD-Prep does not provide a diagnosis. This is preparation for a conversation with a licensed clinician, who confirms any diagnosis.
            </motion.div>
          </motion.section>

          {/* RIGHT — soft on-brand product visual */}
          <motion.aside
            className={cn(
              'flex justify-center lg:justify-end transition-opacity duration-500 ease-in-out',
              stage >= 3 ? 'opacity-100' : 'opacity-0'
            )}
          >
            <SidePanel />
          </motion.aside>
        </div>
      </main>
    </motion.div>
  );
}