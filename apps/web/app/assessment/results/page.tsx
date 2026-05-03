'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

interface AssessmentResults {
  asrsScore?: number;
  riskLevel?: string;
  completedAt?: string;
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<AssessmentResults>({});

  useEffect(() => {
    const score = searchParams.get('score');
    const risk = searchParams.get('risk');

    setResults({
      asrsScore: score ? parseFloat(score) : undefined,
      riskLevel: risk || undefined,
      completedAt: new Date().toISOString(),
    });
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete</h1>
        <p className="text-lg text-gray-600">
          Your ADHD pre-assessment has been successfully completed.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Results Summary</h2>

        {results.asrsScore !== undefined && (
          <div className="mb-4">
            <p className="text-gray-600">ASRS Score</p>
            <p className="text-3xl font-bold text-gray-900">{results.asrsScore.toFixed(2)}/4</p>
            {results.riskLevel && (
              <p className={`mt-1 font-medium ${getRiskColor(results.riskLevel)}`}>
                Risk Level: {results.riskLevel}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Your responses have been saved securely</li>
            <li>• A clinician-ready report can be generated</li>
            <li>• Consider scheduling an appointment with a qualified clinician</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> This assessment is for preparation only and does not constitute
          a clinical diagnosis. Only licensed clinicians can diagnose ADHD.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Print Results
        </button>
        <button
          onClick={() => window.location.href = '/clinicians'}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Find a Clinician
        </button>
      </div>
    </div>
  );
}

function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case 'low': return 'text-green-600';
    case 'moderate': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    default: return 'text-gray-600';
  }
}