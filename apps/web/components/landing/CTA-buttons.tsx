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
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        asChild
        size="lg"
        className="bg-sage-green text-white hover:bg-sage-green/90 focus-visible:ring-2 focus-visible:ring-sage-green-dark"
      >
        <Link href={primaryCTA.href}>{primaryCTA.label}</Link>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="border-soft-blue text-soft-blue hover:bg-soft-blue/10 focus-visible:ring-2 focus-visible:ring-sage-green-dark"
      >
        <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
      </Button>
    </div>
  )
}
