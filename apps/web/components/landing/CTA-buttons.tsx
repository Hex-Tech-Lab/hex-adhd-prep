import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CTAButtonsProps {
  primaryCTA: {
    label: string
    href: string
  }
  secondaryCTA: {
    label: string
    href: string
  }
}

export function CTAButtons({ primaryCTA, secondaryCTA }: CTAButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <Button
        asChild
        size="lg"
        className="bg-sage-green text-white hover:bg-sage-green/90 focus-visible:ring-2 focus-visible:ring-sage-green-dark flex items-center gap-2"
      >
        <Link href={primaryCTA.href}>
          {primaryCTA.label}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-2 border-soft-blue text-soft-blue hover:bg-soft-blue/5 focus-visible:ring-2 focus-visible:ring-sage-green-dark"
      >
        <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
      </Button>
    </div>
  )
}
