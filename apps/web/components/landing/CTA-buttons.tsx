"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

  const handlePrimaryClick = () => {
    router.push(primaryCTA.href)
  }

  const handleSecondaryClick = () => {
    router.push(secondaryCTA.href)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        size="lg"
        onClick={handlePrimaryClick}
        className="bg-sage-green text-white hover:bg-sage-green/90 focus-visible:ring-2 focus-visible:ring-sage-green-dark"
      >
        {primaryCTA.label}
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={handleSecondaryClick}
        className="border-soft-blue text-soft-blue hover:bg-soft-blue/10 focus-visible:ring-2 focus-visible:ring-sage-green-dark"
      >
        {secondaryCTA.label}
      </Button>
    </div>
  )
}
