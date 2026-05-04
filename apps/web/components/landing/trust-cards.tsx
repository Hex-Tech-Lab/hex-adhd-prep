import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AccentCard } from "./accent-card"

export interface TrustCard {
  icon: React.ReactNode
  label: string
  description: string
}

interface TrustCardsProps {
  cards: TrustCard[]
  important?: string
}

export function TrustCards({ cards, important }: TrustCardsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10">
        {cards.map((card, index) => (
          <Card key={index} className="border border-light-gray bg-white rounded-lg">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sage-green/10 border border-sage-green/20 flex items-center justify-center text-sage-green">
                <div className="w-6 h-6">{card.icon}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-dark-gray">{card.label}</h3>
                <p className="text-sm text-medium-gray mt-2">{card.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {important && (
        <div className="mt-12 max-w-2xl">
          <AccentCard variant="important" title="Important">
            <span className="text-sm text-dark-gray leading-relaxed">{important}</span>
          </AccentCard>
        </div>
      )}
    </>
  )
}
