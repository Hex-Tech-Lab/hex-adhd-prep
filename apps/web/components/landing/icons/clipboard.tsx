import * as React from "react"

export function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 4h2v2h-2V4z" />
      <path d="M9 3h6M6 3h2v2H6V3z" />
      <path d="M4 7h16v13H4V7z" />
    </svg>
  )
}
