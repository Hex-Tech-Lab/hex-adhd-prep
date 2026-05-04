import { HeroHeadline } from "./hero-headline"
import { HeroSubheadline } from "./hero-subheadline"
import { CTAButtons } from "./CTA-buttons"
import { TrustCards, TrustCard } from "./trust-cards"
import { SidePanel } from "./side-panel"
import { HourglassIcon } from "./icons/hourglass"
import { DocumentCheckIcon } from "./icons/document-check"
import { ClipboardIcon } from "./icons/clipboard"

interface LandingHeroProps {
  headline?: string
  headlineSub?: string
  subheadline?: string
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

const defaultHeadline = "Prepare for your"
const defaultHeadlineSub = "ADHD evaluation"
const defaultSubheadline = "Our structured tool helps you gather the necessary information, track symptoms, and receive a clinician-ready report — all in about 45 minutes."

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
  headline = defaultHeadline,
  headlineSub = defaultHeadlineSub,
  subheadline = defaultSubheadline,
  primaryCTA = { label: "Start Assessment", href: "/assessment" },
  secondaryCTA = { label: "Learn More", href: "/how-it-works" },
  trustCards = defaultTrustCards,
  progressSections = defaultProgressSections,
}: LandingHeroProps) {
  return (
    <section className="w-full bg-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* Left column - Main content (60% on desktop) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="space-y-10">
              <HeroHeadline headline={headline} subHeadline={headlineSub} />
              <HeroSubheadline subheadline={subheadline} />

              <CTAButtons primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />

              <div className="text-sm text-medium-gray font-medium">
                45 min • Not a diagnosis • Clinician confirmed
              </div>

              <TrustCards cards={trustCards} />

              <div className="bg-cream-lighter border border-light-gray border-l-sage-green-dark border-l-4 p-4 rounded-lg text-sm text-medium-gray leading-relaxed max-w-2xl">
                <strong className="text-dark-gray font-semibold">Important:</strong> ADHD-Prep does not provide a diagnosis. This is preparation for a conversation with a licensed clinician, who confirms any diagnosis.
              </div>
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
