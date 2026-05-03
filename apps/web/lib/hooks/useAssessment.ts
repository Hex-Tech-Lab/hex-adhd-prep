// src/hooks/useAssessment.ts
import { useState, useEffect, useCallback } from 'react';
import { AssessmentStep } from '@/lib/types/assessment';

export function useAssessmentId() {
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  useEffect(() => {
    // Get or create assessment ID
    let id = sessionStorage.getItem('assessmentId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('assessmentId', id);
    }
    setAssessmentId(id);
  }, []);

  const clearAssessmentId = useCallback(() => {
    sessionStorage.removeItem('assessmentId');
    setAssessmentId(null);
  }, []);

  return { assessmentId, clearAssessmentId };
}

export function useAssessmentProgress(currentStep: AssessmentStep) {
  const steps: Record<AssessmentStep, { number: number; total: number; label: string }> = {
    start: { number: 0, total: 6, label: 'Start' },
    asrs: { number: 1, total: 6, label: 'Screening' },
    history: { number: 2, total: 6, label: 'History' },
    impact: { number: 3, total: 6, label: 'Impact' },
    comorbidity: { number: 4, total: 6, label: 'Comorbidity' },
    interview: { number: 5, total: 6, label: 'Interview' },
    family: { number: 6, total: 6, label: 'Family' },
    review: { number: 6, total: 6, label: 'Review' },
    complete: { number: 6, total: 6, label: 'Complete' },
  };

  return steps[currentStep] || steps.start;
}