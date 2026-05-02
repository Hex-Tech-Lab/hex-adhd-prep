'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COMORBIDITIES = [
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'depression', label: 'Depression' },
  { id: 'bipolar', label: 'Bipolar Disorder' },
  { id: 'ocd', label: 'OCD (Obsessive-Compulsive Disorder)' },
  { id: 'sleep', label: 'Sleep Issues' },
];

function getOrCreateAssessmentId(): string {
  let id = sessionStorage.getItem('assessmentId');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('assessmentId', id);
  }
  return id;
}

export default function ComorbidityPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAssessmentId(getOrCreateAssessmentId());
  }, []);

  const handleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      const res = await fetch('/api/assessment/comorbidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId,
          comorbidities: Object.keys(checked).filter((k) => checked[k]),
          notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to save comorbidity');
        router.push('/assessment/family');
    } catch (err) {
      alert('Error submitting. Please try again.');
      setSubmitted(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <p style={{ color: '#0066cc', fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 4 of 5: Comorbidity</p>
      <h1>Other Conditions</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        ADHD often co-occurs with other conditions. Checking these helps clinicians understand your full picture.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Comorbidities */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            Have you ever been diagnosed with or experienced any of these?
          </p>
          <div>
            {COMORBIDITIES.map((cond) => (
              <label key={cond.id} style={{ display: 'block', marginBottom: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checked[cond.id] || false}
                  onChange={() => handleCheck(cond.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                {cond.label}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            Any other medical, psychiatric, or relevant history we should know about?
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional: medications, family history, previous evaluations, etc."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              minHeight: '100px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitted}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: submitted ? 0.5 : 1,
          }}
        >
          {submitted ? 'Saving...' : 'Continue to Review'}
        </button>
      </form>
    </div>
  );
}
