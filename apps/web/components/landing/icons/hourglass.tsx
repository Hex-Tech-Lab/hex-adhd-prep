import * as React from "react"

export function HourglassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 3h14l-2 7L12 13l-5-3L5 3Z" />
      <path d="M5 21h14l-2-7L12 11l-5 3L5 21Z" />
    </svg>
  )
}
