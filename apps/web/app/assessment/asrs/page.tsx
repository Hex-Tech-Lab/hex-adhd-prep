'use client';
import { useState, useCallback, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
  'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
  'How often do you have problems remembering appointments or obligations?',
  'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
  'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
  'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
];

const OPTIONS = ['Never or Rarely', 'Sometimes', 'Often', 'Very Often', 'Constantly'];

export default function ASRSPage(): JSX.Element {
  const [responses, setResponses] = useState<number[]>(Array(6).fill(-1));
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((idx: number, val: number): void => {
    setResponses((prev) => {
      const newResponses = [...prev];
      newResponses[idx] = val;
      return newResponses;
    });
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (responses.includes(-1)) {
      setError('Please answer all questions before proceeding');
      return;
    }

    setSubmitted(true);

    try {
      const res = await fetch('/api/assessment/asrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit assessment');
      }

      const data = await res.json();
      if (data.overallScore !== undefined && data.riskLevel) {
        router.push(`/assessment/asrs/results?score=${data.overallScore}&risk=${data.riskLevel}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(message);
      setSubmitted(false);
    }
  }, [responses, router]);

  const progress = responses.filter((r) => r !== -1).length;
  const isComplete = !responses.includes(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              ASRS Assessment
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Adult ADHD Self-Report Scale (ASRS-v1.1)
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {progress}/6 answered
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(progress / 6) * 100}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={6}
                aria-label="Assessment completion progress"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {QUESTIONS.map((question, index) => (
              <div
                key={index}
                className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
              >
                <label htmlFor={`q${index}`} className="block mb-4">
                  <p className="font-semibold text-slate-900 dark:text-white mb-3 text-sm md:text-base leading-relaxed">
                    {index + 1}. {question}
                  </p>
                </label>

                <fieldset className="space-y-2" aria-label={`Question ${index + 1}`}>
                  {OPTIONS.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={optionIndex}
                        checked={responses[index] === optionIndex}
                        onChange={() => handleChange(index, optionIndex)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        aria-label={`${option} - Question ${index + 1}`}
                      />
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                        {option}
                      </span>
                    </label>
                  ))}
                </fieldset>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isComplete || submitted}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                isComplete && !submitted
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-95 cursor-pointer'
                  : 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed opacity-50'
              }`}
              aria-busy={submitted}
            >
              {submitted ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin">⏳</span>
                  Submitting Assessment...
                </span>
              ) : (
                'Submit Assessment'
              )}
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              This takes approximately 2-3 minutes to complete
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
