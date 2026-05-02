'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessmentId');
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch scores from Supabase
    setLoading(false);
  }, [assessmentId]);

  if (loading) return <p>Loading results...</p>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Your Assessment Results</h1>
      <p className="text-gray-600 mb-6">Assessment ID: {assessmentId}</p>
      
      {scores && (
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <p className="text-lg font-semibold">Risk Level: {scores.riskLevel}</p>
            <p className="text-gray-700 mt-2">{scores.explanation}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Inattention Score</p>
              <p className="text-2xl font-bold">{scores.inattentionScore.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Hyperactivity Score</p>
              <p className="text-2xl font-bold">{scores.hyperactivityScore.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
