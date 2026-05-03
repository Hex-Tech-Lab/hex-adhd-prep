'use client';

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-white px-4 py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">ADHD-Prep</h1>
          <p className="text-xl sm:text-2xl text-white/90">Comprehensive ADHD Assessment & Preparation</p>
          <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto">
            Get clinically-validated screening, prepare for your diagnostic interview, and provide crucial context for your healthcare provider—all in 45 minutes.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <a
            href="/assessment/start"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
            aria-label="Start ADHD assessment"
          >
            Start Assessment
            <span className="text-xl">→</span>
          </a>
          <p className="text-sm text-white/60">Takes approximately 45 minutes</p>
        </div>

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {[
            { label: 'Clinically Validated', icon: '✓' },
            { label: 'Privacy Protected', icon: '🔒' },
            { label: 'Instant Results', icon: '⚡' },
          ].map((feature) => (
            <div key={feature.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <p>{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
