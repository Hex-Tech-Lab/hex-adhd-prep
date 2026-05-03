'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResultsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const score = parseFloat(params.get('score') || '0');
  const risk = (params.get('risk') || 'unknown') as 'low' | 'moderate' | 'high' | string;

  const explanation: Record<string, string> = {
    low: 'Your responses suggest minimal ADHD symptoms. Only a clinician can diagnose.',
    moderate: 'Your responses suggest moderate ADHD symptoms. Consider clinical evaluation.',
    high: 'Your responses suggest significant ADHD symptoms. We recommend clinical evaluation.',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your ASRS Results</h1>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
        <p className="text-lg font-semibold mb-4">Overall Score: <span className="text-blue-600">{score.toFixed(2)}/4</span></p>
        <p className="mb-4">
          <span className="font-semibold">Risk Level: </span>
          <span className={`font-bold ${
            risk === 'low' ? 'text-green-600' :
            risk === 'moderate' ? 'text-yellow-600' :
            risk === 'high' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {risk.charAt(0).toUpperCase() + risk.slice(1)}
          </span>
        </p>
        <p className="text-gray-700 leading-relaxed">{explanation[risk] || ''}</p>
      </div>

      <p className="text-center text-sm text-gray-600 mb-8">
        This tool prepares you for clinical evaluation. Only licensed clinicians can diagnose ADHD.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => router.push('/assessment/history')}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue Assessment
        </button>

        <button
          onClick={() => router.push('/clinicians')}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Find a Clinician
        </button>
      </div>
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
