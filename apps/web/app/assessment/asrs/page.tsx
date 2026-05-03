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

  const progress = responses.filter(r => r !== -1).length;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>ASRS Assessment</h1>
      <p>Adult ADHD Self-Report Scale</p>
      
      <div style={{ background: '#ddd', borderRadius: '4px', height: '8px', marginBottom: '1rem' }}>
        <div style={{ background: '#0066cc', height: '8px', borderRadius: '4px', width: (progress / 6) * 100 + '%', transition: 'all 0.3s' }} />
      </div>
      <p>Answered: {progress}/6</p>

      <form onSubmit={handleSubmit}>
        {QUESTIONS.map((q, i) => (
          <div key={i} style={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{i+1}. {q}</p>
            <div>
              {OPTIONS.map((opt, j) => (
                <label key={j} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name={'q' + i}
                    value={j}
                    checked={responses[i] === j}
                    onChange={() => handleChange(i, j)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <button
          type="submit"
          disabled={responses.includes(-1) || submitted}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: responses.includes(-1) || submitted ? 0.5 : 1,
          }}
        >
          {submitted ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
