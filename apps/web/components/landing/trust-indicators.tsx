export function TrustIndicators() {
  return (
    <div className="flex items-center gap-1 text-sm text-medium-gray font-medium mt-6">
      <span>HIPAA-aligned</span>
      <span>·</span>
      <span className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L5 4v7c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3z" />
        </svg>
        encrypted
      </span>
      <span>·</span>
      <span>Pause and resume anytime</span>
      <span>·</span>
      <span>Refund within 7 days</span>
    </div>
  )
}
