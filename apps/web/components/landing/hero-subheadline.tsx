interface HeroSubheadlineProps {
  primary?: string
  secondary?: string
}

const defaultPrimary = "Structured AI-guided assessment. Clinician-ready report."
const defaultSecondary = "Not a diagnosis. Takes 45 minutes."

export function HeroSubheadline({ primary = defaultPrimary, secondary = defaultSecondary }: HeroSubheadlineProps) {
  return (
    <div className="space-y-2">
      <p className="text-lg md:text-xl font-medium text-dark-gray leading-relaxed max-w-2xl">
        {primary}
      </p>
      <p className="text-base text-medium-gray leading-relaxed max-w-2xl">
        {secondary}
      </p>
    </div>
  )
}
