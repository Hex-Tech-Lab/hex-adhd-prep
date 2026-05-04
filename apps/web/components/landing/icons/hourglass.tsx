import * as React from "react"

export function HourglassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 3h14L17 8l-5 4-5-4L5 3z" />
      <path d="M5 21h14l-2-5-5-4-5 4-2 5z" />
    </svg>
  )
}
