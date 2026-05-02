'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [data, setData] = useState({ onset: '', school: '', description: '' });
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const assessmentId = sessionStorage.getItem('assessmentId');
    try {
      await fetch('/api/assessment/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, ...data })
      });
      router.push('/assessment/impact');
    } catch (err) {
      console.error(err);
      alert('Error saving');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Childhood & History</h1>
      <p style={{ color: '#666' }}>Step 2 of 5</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>When did symptoms first appear?</p>
          {['Before age 7', 'Age 7-12', 'Age 12-18', 'After age 18'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="onset" value={opt} checked={data.onset === opt} onChange={(e) => setData(p => ({ ...p, onset: e.target.value }))} style={{ marginRight: '0.75rem' }} />
              {opt}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>School performance:</p>
          {['Excellent', 'Above average', 'Average', 'Below average', 'Struggled significantly'].map(opt => (
            <label key={opt} style={{ display: 'block', marginBottom: '0.5rem', cursor: 'pointer' }}>
              <input type="radio" name="school" value={opt} checked={data.school === opt} onChange={(e) => setData(p => ({ ...p, school: e.target.value }))} style={{ marginRight: '0.75rem' }} />
              {opt}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontWeight: 'bold' }}>As a child, I was often:</p>
          <textarea value={data.description} onChange={(e) => setData(p => ({ ...p, description: e.target.value }))} placeholder="e.g., restless, daydreaming, disorganized, impulsive..." style={{ width: '100%', padding: '0.75rem', minHeight: '100px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'system-ui', fontSize: '1rem' }} />
        </div>

        <button type="submit" disabled={submitted} style={{ width: '100%', padding: '0.75rem', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', opacity: submitted ? 0.7 : 1 }}>
          {submitted ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
