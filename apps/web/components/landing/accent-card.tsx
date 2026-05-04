import * as React from "react"

interface AccentCardProps {
  variant?: "important" | "info" | "warning"
  title?: string
  children: React.ReactNode
  className?: string
}

export function AccentCard({ variant = "important", title, children, className = "" }: AccentCardProps) {
  const borderColors = {
    important: "border-l-sage-green-dark",
    info: "border-sage-green",
    warning: "border-sage-green-dark",
  }

  return (
    <div className={`border border-light-gray ${borderColors[variant]} border-l-4 p-6 rounded-lg bg-white ${className}`}>
      {title && (
        <strong className="text-dark-gray font-semibold">{title}: </strong>
      )}
      {children}
    </div>
  )
}
