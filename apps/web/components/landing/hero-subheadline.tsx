interface HeroSubheadlineProps {
  subheadline?: string
}

const defaultSubheadline = "Our structured tool helps you gather the necessary information, track symptoms, and receive a clinician-ready report — all in about 45 minutes."

export function HeroSubheadline({ subheadline = defaultSubheadline }: HeroSubheadlineProps) {
  return (
    <p className="text-base md:text-lg text-medium-gray leading-relaxed max-w-2xl">
      {subheadline}
    </p>
  )
}
