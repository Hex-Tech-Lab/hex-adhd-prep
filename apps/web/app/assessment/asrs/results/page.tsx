'use client';
import { useSearchParams } from 'next/navigation';

export default function ResultsPage() {
  const params = useSearchParams();
  const score = parseFloat(params.get('score') || '0');
  const risk = params.get('risk') || 'unknown';

  const riskColors = { low: 'green', moderate: 'orange', high: 'red' };
  const explanation = {
    low: 'Your responses suggest minimal ADHD symptoms. Only a clinician can diagnose.',
    moderate: 'Your responses suggest moderate ADHD symptoms. Consider clinical evaluation.',
    high: 'Your responses suggest significant ADHD symptoms. We recommend clinical evaluation.',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Your Results</h1>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
        <p><strong>Overall Score: {score.toFixed(2)}/4</strong></p>
        <p><strong>Risk Level: </strong><span style={{ color: riskColors[risk] }}>{risk}</span></p>
        <p>{explanation[risk] || ''}</p>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
        This tool prepares you for clinical evaluation. Only licensed clinicians can diagnose ADHD.
      </p>
    </div>
  );
}
