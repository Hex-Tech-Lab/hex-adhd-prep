'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ONSET_OPTIONS = ['Before age 7', 'Ages 7-12', 'Ages 12-18', 'After age 18', 'Unsure'];
const SCHOOL_PERFORMANCE = ['Excellent', 'Good', 'Average', 'Below average', 'Struggled'];

export default function HistoryPage() {
  const [onset, setOnset] = useState('');
  const [schoolPerformance, setSchoolPerformance] = useState('');
  const [childTraits, setChildTraits] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onset || !schoolPerformance || !childTraits.trim()) {
      alert('Please answer all questions');
      return;
    }
    setSubmitted(true);

    try {
      const res = await fetch('/api/assessment/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onset, schoolPerformance, childTraits }),
      });
      if (!res.ok) throw new Error('Failed to save history');
      router.push('/assessment/impact');
    } catch (err) {
      alert('Error submitting. Please try again.');
      setSubmitted(false);
    }
  };

  const isComplete = onset && schoolPerformance && childTraits.trim();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Childhood & Early History</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Understanding your childhood can help identify patterns of ADHD symptoms.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Q1: Symptom Onset */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            When do you first remember struggling with attention or impulse control?
          </p>
          <div>
            {ONSET_OPTIONS.map((opt) => (
              <label key={opt} style={{ display: 'block', marginBottom: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="onset"
                  value={opt}
                  checked={onset === opt}
                  onChange={(e) => setOnset(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Q2: School Performance */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            How would you describe your school performance overall?
          </p>
          <div>
            {SCHOOL_PERFORMANCE.map((opt) => (
              <label key={opt} style={{ display: 'block', marginBottom: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="school"
                  value={opt}
                  checked={schoolPerformance === opt}
                  onChange={(e) => setSchoolPerformance(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Q3: Childhood Traits */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            How would you describe yourself as a child? (e.g., daydreamer, restless, forgetful, impulsive, creative, lost in thought)
          </p>
          <textarea
            value={childTraits}
            onChange={(e) => setChildTraits(e.target.value)}
            placeholder="Describe how teachers, parents, or family described you..."
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
          disabled={!isComplete || submitted}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: !isComplete || submitted ? 0.5 : 1,
          }}
        >
          {submitted ? 'Saving...' : 'Continue to Next Section'}
        </button>
      </form>
    </div>
  );
}
