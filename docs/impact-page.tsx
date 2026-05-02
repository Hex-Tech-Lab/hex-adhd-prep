'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImpactPage() {
  const [data, setData] = useState({ workImpact: '', socialImpact: '', mainChallenge: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data })
      });
      router.push('/assessment/comorbidity');
    } catch (err) {
      console.error(err);
      alert('Error saving');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Life Impact</h1>
      <p style={{ color: '#666' }}>Step 3 of 5</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>Work/Career Impact:</p>
          <textarea value={data.workImpact} onChange={(e) => setData(p => ({ ...p, workImpact: e.target.value }))} placeholder="Describe challenges at work, job changes, performance issues..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>Relationships & Social Impact:</p>
          <textarea value={data.socialImpact} onChange={(e) => setData(p => ({ ...p, socialImpact: e.target.value }))} placeholder="Describe impacts on relationships, family, friendships..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>What's your biggest challenge?</p>
          <textarea value={data.mainChallenge} onChange={(e) => setData(p => ({ ...p, mainChallenge: e.target.value }))} placeholder="e.g., procrastination, disorganization, forgetfulness, impulsivity..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
