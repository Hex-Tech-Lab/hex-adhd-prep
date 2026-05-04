import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TrustCard {
  icon: React.ReactElement
  label: string
  description: string
}

interface TrustCardsProps {
  cards: TrustCard[]
}

export function TrustCards({ cards }: TrustCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="border-light-gray bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sage-green/10 border border-sage-green/20 flex items-center justify-center text-sage-green">
              {card.icon}
            </div>
            <div>
              <h3 className="text-base font-medium text-dark-gray">{card.label}</h3>
              <p className="text-sm text-medium-gray mt-0.5">{card.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
