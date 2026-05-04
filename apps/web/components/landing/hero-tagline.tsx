interface HeroTaglineProps {
  text?: string
}

const defaultText = "For adults considering an ADHD evaluation"

export function HeroTagline({ text = defaultText }: HeroTaglineProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <svg className="w-5 h-5 text-sage-green flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-sm font-medium text-sage-green">{text}</span>
    </div>
  )
}
