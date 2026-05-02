'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function getOrCreateAssessmentId(): string {
  let id = sessionStorage.getItem('assessmentId');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('assessmentId', id);
  }
  return id;
}

export default function ImpactPage() {
  const [workImpact, setWorkImpact] = useState('');
  const [relationshipImpact, setRelationshipImpact] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAssessmentId(getOrCreateAssessmentId());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workImpact.trim() || !relationshipImpact.trim() || !biggestChallenge.trim()) {
      alert('Please answer all questions');
      return;
    }
    setSubmitted(true);

    try {
      const res = await fetch('/api/assessment/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, workImpact, relationshipImpact, biggestChallenge }),
      });
      if (!res.ok) throw new Error('Failed to save impact');
      router.push('/assessment/comorbidity');
    } catch (err) {
      alert('Error submitting. Please try again.');
      setSubmitted(false);
    }
  };

  const isComplete = workImpact.trim() && relationshipImpact.trim() && biggestChallenge.trim();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <p style={{ color: '#0066cc', fontWeight: 'bold', marginBottom: '0.5rem' }}>Step 3 of 5: Impact</p>
      <h1>Life Impact & Challenges</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Understanding how ADHD symptoms affect your daily life helps clinicians make accurate assessments.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Q1: Work Impact */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            How have attention or organization challenges affected your work or career?
          </p>
          <textarea
            value={workImpact}
            onChange={(e) => setWorkImpact(e.target.value)}
            placeholder="e.g., missed deadlines, trouble staying focused in meetings, difficulty organizing tasks..."
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

        {/* Q2: Relationship Impact */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            How have these challenges affected your relationships or social connections?
          </p>
          <textarea
            value={relationshipImpact}
            onChange={(e) => setRelationshipImpact(e.target.value)}
            placeholder="e.g., losing track of social commitments, difficulty listening, interrupting others, relationship conflicts..."
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

        {/* Q3: Biggest Challenge */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            What is your biggest challenge or struggle right now?
          </p>
          <textarea
            value={biggestChallenge}
            onChange={(e) => setBiggestChallenge(e.target.value)}
            placeholder="Describe your most pressing challenge..."
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
