'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ComorbidityPage() {
  const [data, setData] = useState({ anxiety: false, depression: false, bipolar: false, ocd: false, sleep: false, notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/comorbidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data })
      });
      router.push('/assessment/review');
    } catch (err) {
      console.error(err);
      alert('Error saving');
    }
  };

  const conditions = [
    { name: 'anxiety', label: 'Anxiety or panic attacks' },
    { name: 'depression', label: 'Depression or persistent sadness' },
    { name: 'bipolar', label: 'Mood swings (bipolar spectrum)' },
    { name: 'ocd', label: 'Obsessive thoughts or compulsions' },
    { name: 'sleep', label: 'Sleep problems' }
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Mental Health Screening</h1>
      <p style={{ color: '#666' }}>Step 4 of 5</p>

      <form onSubmit={handleSubmit}>
        {conditions.map(cond => (
          <label key={cond.name} style={{ display: 'block', padding: '0.75rem', marginBottom: '0.75rem', background: '#f9f9f9', borderRadius: '6px', cursor: 'pointer' }}>
            <input type="checkbox" checked={data[cond.name]} onChange={(e) => setData(p => ({ ...p, [cond.name]: e.target.checked }))} style={{ marginRight: '0.75rem', width: '18px', height: '18px', cursor: 'pointer' }} />
            {cond.label}
          </label>
        ))}

        <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>Additional notes:</p>
          <textarea value={data.notes} onChange={(e) => setData(p => ({ ...p, notes: e.target.value }))} placeholder="Any other mental health concerns..." style={{ width: '100%', padding: '0.75rem', minHeight: '80px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Review Assessment'}
        </button>
      </form>
    </div>
  );
}
