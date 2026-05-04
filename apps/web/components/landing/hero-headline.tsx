interface HeroHeadlineProps {
  headline?: string
}

const defaultHeadline = "Prepare for your ADHD assessment with confidence"

export function HeroHeadline({ headline = defaultHeadline }: HeroHeadlineProps) {
  return (
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-gray leading-tight tracking-tight">
      {headline}
    </h1>
  )
}
