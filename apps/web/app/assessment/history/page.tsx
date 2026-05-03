'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { FormSection, TextArea, RadioGroup, SubmitButton } from '@/lib/components/ui/FormComponents';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';
import { HistoryFormData } from '@/lib/types/assessment';

const ONSET_OPTIONS = [
  { value: 'before-7', label: 'Before age 7' },
  { value: '7-12', label: 'Ages 7-12' },
  { value: '12-18', label: 'Ages 12-18' },
  { value: 'after-18', label: 'After age 18' },
  { value: 'unsure', label: 'Unsure' },
];

const SCHOOL_PERFORMANCE_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'average', label: 'Average' },
  { value: 'below-average', label: 'Below average' },
  { value: 'struggled', label: 'Struggled' },
];

export default function HistoryPage() {
  const [onset, setOnset] = useState('');
  const [schoolPerformance, setSchoolPerformance] = useState('');
  const [childTraits, setChildTraits] = useState('');
  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('history');
  useRouter(); // Router available but not used in this phase

  const validateForm = (data: HistoryFormData) => {
    return !!(data.onset && data.schoolPerformance && data.childTraits?.trim());
  };

  const { submitted, error, submitForm, clearError } = useFormSubmission<HistoryFormData>(
    '/assessment/history',
    '/assessment/impact',
    validateForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentId) return;

    const formData: HistoryFormData = {
      assessmentId,
      onset,
      schoolPerformance,
      childTraits,
    };

    await submitForm(formData);
  };

  const isComplete = onset && schoolPerformance && childTraits.trim();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressIndicator
        current={progress.number}
        total={progress.total}
        label={progress.label}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Childhood & Early History</h1>
        <p className="text-gray-600">
          Understanding your childhood can help identify patterns of ADHD symptoms.
        </p>
      </div>

      <ErrorDisplay error={error} onDismiss={clearError} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Symptom Onset">
          <RadioGroup
            label="When do you first remember struggling with attention or impulse control?"
            options={ONSET_OPTIONS}
            value={onset}
            onChange={setOnset}
            required
          />
        </FormSection>

        <FormSection title="School Performance">
          <RadioGroup
            label="How would you describe your school performance overall?"
            options={SCHOOL_PERFORMANCE_OPTIONS}
            value={schoolPerformance}
            onChange={setSchoolPerformance}
            required
          />
        </FormSection>

        <FormSection title="Childhood Traits" className="border-b-0 pb-0">
          <TextArea
            label="How would you describe yourself as a child? (e.g., daydreamer, restless, forgetful, impulsive, creative, lost in thought)"
            value={childTraits}
            onChange={setChildTraits}
            placeholder="Describe how teachers, parents, or family described you..."
            required
            rows={4}
          />
        </FormSection>

        <SubmitButton disabled={!isComplete} loading={submitted}>
          Continue to Next Section
        </SubmitButton>
      </form>
    </div>
  );
}
