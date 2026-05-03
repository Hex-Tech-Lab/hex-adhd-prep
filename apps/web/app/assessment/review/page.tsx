'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';

interface AssessmentData {
  asrs_risk_level?: string;
  asrs_score?: number;
  history_data?: Record<string, any>;
  impact_data?: Record<string, any>;
  comorbidity_data?: Record<string, any>;
  family_input_provided?: boolean;
}

export default function ReviewPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('review');
  const router = useRouter();

  useEffect(() => {
    if (!assessmentId) return;

    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/assessment/get?id=${assessmentId}`);
        if (res.ok) {
          const data = await res.json();
          setAssessmentData(data.assessment || {});
        }
      } catch (err) {
        console.error('Error fetching assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const handleSubmitAssessment = async () => {
    setSubmitted(true);
    setError('');

    try {
      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete assessment');
      }

      router.push('/assessment/results');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Loading assessment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressIndicator
        current={progress.number}
        total={progress.total}
        label={progress.label}
      />

      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-600 mb-2">Final Review</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Assessment</h1>
        <p className="text-gray-600">
          You've completed all sections of your ADHD pre-assessment. Review the information below and submit when ready.
        </p>
      </div>

      <ErrorDisplay error={error} />

      <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Summary</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <span className="text-gray-900">ASRS Screening Completed
              {assessmentData.asrs_risk_level && (
                <span className="ml-2 text-sm text-gray-600">
                  (Risk: {assessmentData.asrs_risk_level})
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <span className="text-gray-900">Childhood History Recorded</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <span className="text-gray-900">Life Impact Assessment</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-600 font-bold mr-3">✓</span>
            <span className="text-gray-900">Comorbidity Screening</span>
          </div>
          <div className="flex items-center">
            <span className={assessmentData.family_input_provided ? 'text-green-600 font-bold mr-3' : 'text-gray-400 font-bold mr-3'}>
              {assessmentData.family_input_provided ? '✓' : '◯'}
            </span>
            <span className="text-gray-900">Family/Friend Perspective
              {assessmentData.family_input_provided && ' (Received)'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-600">
        <p className="text-sm text-gray-900 mb-2">
          <strong>Next Steps:</strong> Your assessment data will be compiled into a clinician-ready report.
        </p>
        <p className="text-sm text-gray-700">
          A licensed professional will use this to guide your diagnostic evaluation.
        </p>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> This assessment is for preparation only and does not constitute a clinical diagnosis.
          Only licensed clinicians can diagnose ADHD.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleSubmitAssessment}
          disabled={submitted}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitted ? 'Submitting...' : 'Complete Assessment'}
        </button>

        <button
          onClick={() => router.back()}
          disabled={submitted}
          className="w-full py-3 px-4 bg-gray-100 text-gray-900 font-semibold rounded-md hover:bg-gray-200 disabled:opacity-50 transition"
        >
          Go Back to Previous Section
        </button>
      </div>
    </div>
  );
}
