"use client"

import { motion, useReducedMotion } from "framer-motion"
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
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()

  const handlePrimaryClick = () => {
    router.push(primaryCTA.href)
  }

  const handleSecondaryClick = () => {
    router.push(secondaryCTA.href)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        delay: 0.15,
        ease: "easeOut",
      }}
      className="flex flex-col sm:flex-row gap-4"
      suppressHydrationWarning
    >
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
    </motion.div>
  )
}
