import { HeroHeadline } from "./hero-headline"
import { HeroSubheadline } from "./hero-subheadline"
import { CTAButtons } from "./CTA-buttons"
import { TrustCards } from "./trust-cards"
import { SidePanel } from "./side-panel"
import { HourglassIcon } from "./icons/hourglass"
import { DocumentCheckIcon } from "./icons/document-check"
import { ClipboardIcon } from "./icons/clipboard"

interface LandingHeroProps {
  headline?: string
  subheadline?: string
  primaryCTA?: {
    label: string
    href: string
  }
  secondaryCTA?: {
    label: string
    href: string
  }
  trustCards?: Array<{
    icon: React.ReactNode
    label: string
    description: string
  }>
  progressSections?: Array<{
    title: string
    description?: string
    completed?: boolean
    inProgress?: boolean
  }>
}

const defaultHeadline = "Prepare for your ADHD assessment with confidence"
const defaultSubheadline = "Our structured tool helps you gather the necessary information, track symptoms, and receive a clinician-ready report — all in about 45 minutes."

const defaultTrustCards = [
  {
    icon: <HourglassIcon />,
    label: "45-minute assessment",
    description: "Complete in about 45 minutes",
  },
  {
    icon: <DocumentCheckIcon />,
    label: "Not a diagnosis",
    description: "This is not a substitute for professional medical advice",
  },
  {
    icon: <ClipboardIcon />,
    label: "Clinician-ready report",
    description: "Share your results with your healthcare provider",
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
  headline = defaultHeadline,
  subheadline = defaultSubheadline,
  primaryCTA = { label: "Start Assessment", href: "/assessment" },
  secondaryCTA = { label: "Learn More", href: "/how-it-works" },
  trustCards = defaultTrustCards,
  progressSections = defaultProgressSections,
}: LandingHeroProps) {
  return (
    <section className="w-full bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left column - Main content (60% on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-6">
              <HeroHeadline headline={headline} />
              <HeroSubheadline subheadline={subheadline} />

              <CTAButtons primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />

              <div className="text-sm text-medium-gray font-medium">
                45 min • Not a diagnosis • Clinician confirmed
              </div>

              <TrustCards cards={trustCards} />

              <p className="text-xs text-medium-gray max-w-2xl leading-relaxed">
                This tool is designed to help you prepare for a professional ADHD assessment. It is not a diagnostic tool and does not replace the expertise of a qualified healthcare provider.
              </p>
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
