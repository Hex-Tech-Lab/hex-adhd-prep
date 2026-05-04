import * as React from "react"

export function HourglassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2h12l-1 5.5L12 12l-5-4.5L6 2Z" />
      <path d="M6 22h12l-1-5.5L12 12l-5 4.5L6 22Z" />
    </svg>
  )
}
