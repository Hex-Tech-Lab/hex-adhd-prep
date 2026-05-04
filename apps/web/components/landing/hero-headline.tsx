interface HeroHeadlineProps {
  headline?: string
  subHeadline?: string
}

const defaultHeadline = "Prepare for your"
const defaultSubHeadline = "ADHD evaluation"

export function HeroHeadline({ headline = defaultHeadline, subHeadline = defaultSubHeadline }: HeroHeadlineProps) {
  return (
    <h1 className="font-bold text-dark-gray tracking-tight space-y-2">
      <span className="block text-2xl md:text-3xl lg:text-4xl">{headline}</span>
      <span className="relative text-sage-dark block text-3xl md:text-4xl lg:text-5xl">
        {subHeadline}
        <span className="absolute -bottom-1 left-0 right-0 h-2 bg-sage-green-light -z-10 rounded-sm" />
      </span>
    </h1>
  )
}
