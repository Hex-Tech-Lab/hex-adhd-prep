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
  const progress = Math.round((sections.filter(s => s.completed).length / sections.length) * 100)

  return (
    <div className="hidden lg:block">
      <div className="sticky top-8 bg-warm-cream rounded-lg border border-light-gray p-6 max-w-sm">
        <h3 className="text-lg font-semibold text-dark-gray mb-4">Assessment Progress</h3>

        <div className="mb-6">
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

        <ul className="space-y-3">
          {sections.map((section, index) => (
            <li
              key={index}
              className="flex items-start gap-3"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
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
                <p className="text-sm font-medium text-dark-gray">{section.title}</p>
                {section.description && (
                  <p className="text-xs text-medium-gray mt-0.5">{section.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-light-gray">
          <p className="text-xs text-medium-gray italic">Pause anytime — your progress is saved</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sage-green/10 text-sage-green border border-sage-green/20">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Encrypted
          </span>
        </div>
      </div>
    </div>
  )
}
