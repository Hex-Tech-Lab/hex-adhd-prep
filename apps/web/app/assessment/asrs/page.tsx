'use client';

import { useState } from 'react';
import { ASRS_QUESTIONS, ANSWER_OPTIONS, ASRSResponse } from '@hex/types';
import { useRouter } from 'next/navigation';

export default function ASRSPage() {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleChange = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const assessmentId = 'temp-assessment-id'; // TODO: get from DB
      const formattedResponses = Object.entries(responses).map(([questionId, responseValue]) => ({
        assessmentId,
        questionId,
        responseValue: responseValue as 0 | 1 | 2 | 3 | 4,
      }));

      const response = await fetch('/api/assessment/asrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, responses: formattedResponses }),
      });

      if (!response.ok) throw new Error('Submission failed');

      const scores = await response.json();
      setSubmitted(true);

      // Redirect to results
      router.push(`/assessment/asrs/results?assessmentId=${assessmentId}`);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / ASRS_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">ASRS Assessment</h1>
      <p className="text-gray-600 mb-6">Adult ADHD Self-Report Scale (v1.1)</p>

      <div className="mb-6 bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="text-sm text-gray-600 mb-6">Progress: {answeredCount}/{ASRS_QUESTIONS.length}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {ASRS_QUESTIONS.map((question, idx) => (
          <div key={question.id} className="border-b pb-6">
            <p className="font-semibold mb-4">
              {idx + 1}. {question.text}
            </p>
            <div className="space-y-2">
              {ANSWER_OPTIONS.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={responses[question.id] === option.value}
                    onChange={() => handleChange(question.id, option.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={answeredCount < ASRS_QUESTIONS.length || loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </form>
    </div>
  );
}
