interface HeroHeadlineProps {
  headline?: string
  subHeadline?: string
}

const defaultHeadline = "Prepare for your"
const defaultSubHeadline = "ADHD evaluation"

export function HeroHeadline({ headline = defaultHeadline, subHeadline = defaultSubHeadline }: HeroHeadlineProps) {
  return (
    <h1 className="font-bold text-dark-gray tracking-tight space-y-2">
      <span className="block text-4xl md:text-5xl lg:text-6xl">{headline}</span>
      <span className="block text-sage-green text-5xl md:text-6xl lg:text-7xl">
        {subHeadline}
      </span>
    </h1>
  )
}
