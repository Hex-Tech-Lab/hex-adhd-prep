'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmitAssessment = async () => {
    setSubmitted(true);
    try {
      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to complete assessment');
      // Redirect to results or clinician directory
      router.push('/assessment/asrs/results');
    } catch (err) {
      alert('Error completing assessment. Please try again.');
      setSubmitted(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Review Your Assessment</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        You've completed all sections of your ADHD pre-assessment. Review the information below and submit when ready.
      </p>

      <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0 }}>Assessment Summary</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>✓ ASRS Screening Completed</li>
          <li>✓ Childhood History Recorded</li>
          <li>✓ Life Impact Assessment</li>
          <li>✓ Comorbidity Screening</li>
          <li>✓ Family/Friend Perspective</li>
        </ul>
      </div>

      <div style={{ background: '#f0f7ff', padding: '1rem', borderRadius: '4px', marginBottom: '2rem', borderLeft: '4px solid #0066cc' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#333' }}>
          <strong>Next Steps:</strong> Your assessment data will be compiled into a clinician-ready report.
          A licensed professional will use this to guide your diagnostic evaluation.
        </p>
      </div>

      <button
        onClick={handleSubmitAssessment}
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
          marginBottom: '1rem',
        }}
      >
        {submitted ? 'Submitting...' : 'Complete Assessment'}
      </button>

      <button
        onClick={() => router.back()}
        disabled={submitted}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#f0f0f0',
          color: '#333',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Go Back
      </button>
    </div>
  );
}
