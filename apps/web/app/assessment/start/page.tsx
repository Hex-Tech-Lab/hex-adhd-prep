'use client';
import { useRouter } from 'next/navigation';
import { getAssessmentId } from '@/lib/session';

export default function StartPage() {
  const router = useRouter();

  const handleStart = () => {
    getAssessmentId();
    router.push('/assessment/asrs');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>ADHD Preparation Assessment</h1>
      <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
        This assessment helps you prepare for a clinical ADHD evaluation.
        It typically takes 30-45 minutes to complete all sections.
      </p>

      <div style={{ background: '#f0f7ff', padding: '1.5rem', borderRadius: '4px', marginBottom: '2rem', borderLeft: '4px solid #0066cc' }}>
        <h3 style={{ marginTop: 0 }}>What's Included</h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>ASRS Screening Questionnaire</li>
          <li>Childhood & Family History</li>
          <li>Life Impact Assessment</li>
          <li>Comorbidity Screening</li>
          <li>Family/Friend Perspective</li>
        </ul>
      </div>

      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      >
        Start Assessment
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#999', marginTop: '2rem' }}>
        This is a preparation tool only. Only licensed clinicians can diagnose ADHD.
      </p>
    </div>
  );
}
