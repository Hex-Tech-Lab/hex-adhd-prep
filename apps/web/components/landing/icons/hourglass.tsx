import * as React from "react"

export function HourglassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2h12v6l-6 3 6 3v6H6v-6l6-3-6-3V2z" />
    </svg>
  )
}
