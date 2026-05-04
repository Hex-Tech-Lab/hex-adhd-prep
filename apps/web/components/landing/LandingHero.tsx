import { HeroTagline } from "./hero-tagline"
import { HeroHeadline } from "./hero-headline"
import { HeroSubheadline } from "./hero-subheadline"
import { CTAButtons } from "./CTA-buttons"
import { TrustIndicators } from "./trust-indicators"
import { TrustCards, TrustCard } from "./trust-cards"
import { SidePanel } from "./side-panel"
import { HourglassIcon } from "./icons/hourglass"
import { DocumentCheckIcon } from "./icons/document-check"
import { ClipboardIcon } from "./icons/clipboard"

interface LandingHeroProps {
  tagline?: string
  headline?: string
  headlineSub?: string
  subheadlinePrimary?: string
  subheadlineSecondary?: string
  primaryCTA?: {
    label: string
    href: string
  }
  secondaryCTA?: {
    label: string
    href: string
  }
  trustCards?: TrustCard[]
  progressSections?: Array<{
    title: string
    description?: string
    completed?: boolean
    inProgress?: boolean
  }>
}

const defaultTagline = "For adults considering an ADHD evaluation"
const defaultHeadline = "Prepare for your"
const defaultHeadlineSub = "ADHD evaluation"
const defaultSubheadlinePrimary = "Structured AI-guided assessment. Clinician-ready report."
const defaultSubheadlineSecondary = "Not a diagnosis. Takes 45 minutes."

const defaultTrustCards = [
  {
    icon: <HourglassIcon />,
    label: "45-Minute Assessment",
    description: "Quick, structured, comprehensive",
  },
  {
    icon: <DocumentCheckIcon />,
    label: "Not a Diagnosis",
    description: "Preparation only. Clinician confirms.",
  },
  {
    icon: <ClipboardIcon />,
    label: "Clinician-Ready Report",
    description: "Export as PDF, share with provider",
  },
]

const defaultProgressSections = [
  { title: "ASRS Questionnaire", description: "18 questions", completed: true },
  { title: "Childhood History", description: "Growing up with ADHD", completed: true },
  { title: "AI Interview", description: "Conversational assessment", inProgress: true },
  { title: "Family Input", description: "Optional: invite a family member", completed: false },
  { title: "Generate Report", description: "Clinician-ready summary", completed: false },
]

export default function LandingHero({
  tagline = defaultTagline,
  headline = defaultHeadline,
  headlineSub = defaultHeadlineSub,
  subheadlinePrimary = defaultSubheadlinePrimary,
  subheadlineSecondary = defaultSubheadlineSecondary,
  primaryCTA = { label: "Start $49 Assessment", href: "/assessment" },
  secondaryCTA = { label: "Learn More", href: "/how-it-works" },
  trustCards = defaultTrustCards,
  progressSections = defaultProgressSections,
}: LandingHeroProps) {
  return (
    <section className="w-full bg-warm-cream">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left column - Main content (60% on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-10">
              <div>
                <HeroTagline text={tagline} />
                <HeroHeadline headline={headline} subHeadline={headlineSub} />
              </div>
              <HeroSubheadline primary={subheadlinePrimary} secondary={subheadlineSecondary} />

              <CTAButtons primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />

              <TrustIndicators />

              <TrustCards cards={trustCards} important="ADHD-Prep does not provide a diagnosis. This is preparation for a conversation with a licensed clinician, who confirms any diagnosis." />
            </div>
          </div>

          {/* Right column - Progress panel (40% on desktop) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <SidePanel sections={progressSections} />
          </div>
        </div>
  </div>
</section>
  )
}
