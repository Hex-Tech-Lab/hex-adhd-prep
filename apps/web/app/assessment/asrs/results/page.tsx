'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResultsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const score = parseFloat(params.get('score') || '0');
  const risk = (params.get('risk') || 'unknown') as 'low' | 'moderate' | 'high' | string;

  const riskColors: Record<string, string> = { low: 'green', moderate: 'orange', high: 'red' };
  const explanation: Record<string, string> = {
    low: 'Your responses suggest minimal ADHD symptoms. Only a clinician can diagnose.',
    moderate: 'Your responses suggest moderate ADHD symptoms. Consider clinical evaluation.',
    high: 'Your responses suggest significant ADHD symptoms. We recommend clinical evaluation.',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Your ASRS Results</h1>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '2rem' }}>
        <p><strong>Overall Score: {score.toFixed(2)}/4</strong></p>
        <p><strong>Risk Level: </strong><span style={{ color: riskColors[risk] || 'black' }}>{risk}</span></p>
        <p>{explanation[risk] || ''}</p>
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginBottom: '2rem' }}>
        This tool prepares you for clinical evaluation. Only licensed clinicians can diagnose ADHD.
      </p>

      <button
        onClick={() => router.push('/assessment/history')}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
      >
        Continue Assessment
      </button>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
