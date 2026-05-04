"use client"

import { motion, useReducedMotion } from "framer-motion"
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
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.2,
        delay: 0.2,
        ease: "easeInOut",
      }}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Button asChild size="lg" className="bg-sage-green text-white hover:bg-sage-green/90 focus-visible:ring-2 focus-visible:ring-dark-sage">
        <a href={primaryCTA.href}>{primaryCTA.label}</a>
      </Button>
      <Button asChild size="lg" variant="outline" className="border-soft-blue text-soft-blue hover:bg-soft-blue/10 focus-visible:ring-2 focus-visible:ring-dark-sage">
        <a href={secondaryCTA.href}>{secondaryCTA.label}</a>
      </Button>
    </motion.div>
  )
}
