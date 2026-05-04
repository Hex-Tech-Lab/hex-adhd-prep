"use client"

interface SidePanelProps {
  sections: Array<{
    title: string
    description?: string
    completed?: boolean
    inProgress?: boolean
  }>
}

export function SidePanel({ sections }: SidePanelProps) {
  const progress = sections.length > 0
    ? Math.round((sections.filter(s => s.completed).length / sections.length) * 100)
    : 0

  return (
    <div className="hidden lg:block">
      <div className="sticky top-8 bg-warm-cream rounded-lg border border-light-gray p-8 max-w-sm">
        {/* Session header */}
        <div className="flex justify-between items-center pb-4 border-b border-light-gray mb-6">
          <span className="text-xs font-semibold tracking-widest text-medium-gray">SESSION</span>
          <span className="text-xs font-semibold text-medium-gray">ADHD-PREP-2026</span>
        </div>

        {/* Progress section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-dark-gray mb-3">Assessment progress</h3>
          <div className="flex justify-between text-sm text-medium-gray mb-2">
            <span>Overall completion</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-light-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-green rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Sections list */}
        <ul className="space-y-4">
          {sections.map((section, index) => (
            <li
              key={index}
              className="flex items-start gap-3"
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                section.completed
                  ? "bg-sage-green border-sage-green"
                  : section.inProgress
                  ? "border-sage-green bg-sage-green/20"
                  : "border-medium-gray"
              }`}>
                {section.completed && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-dark-gray">{section.title}</p>
                {section.description && (
                  <p className="text-xs text-medium-gray mt-1">{section.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Pause info */}
        <div className="mt-8 pt-6 border-t border-light-gray">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-medium-gray flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-dark-gray">You can pause anytime</p>
              <p className="text-xs text-medium-gray mt-0.5">Your responses save as you go.</p>
            </div>
          </div>
        </div>

        {/* Encryption badge */}
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-sage-green/10 text-sage-green border border-sage-green/20">
            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L5 4v7c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3z" />
            </svg>
            Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}
