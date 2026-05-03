'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { FormSection, TextArea, SubmitButton } from '@/lib/components/ui/FormComponents';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';
import { ComorbidityFormData } from '@/lib/types/assessment';

const COMORBIDITIES = [
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'depression', label: 'Depression' },
  { id: 'bipolar', label: 'Bipolar Disorder' },
  { id: 'ocd', label: 'OCD (Obsessive-Compulsive Disorder)' },
  { id: 'sleep', label: 'Sleep Issues' },
];

export default function ComorbidityPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('comorbidity');
  useRouter(); // Router available but not used in this phase

  const validateForm = (data: ComorbidityFormData) => {
    return Array.isArray(data.comorbidities);
  };

  const { submitted, error, submitForm, clearError } = useFormSubmission<ComorbidityFormData>(
    '/assessment/comorbidity',
    '/assessment/review',
    validateForm
  );

  const handleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentId) return;

    const formData: ComorbidityFormData = {
      assessmentId,
      comorbidities: Object.keys(checked).filter((k) => checked[k]),
      notes,
    };

    await submitForm(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressIndicator
        current={progress.number}
        total={progress.total}
        label={progress.label}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Other Conditions</h1>
        <p className="text-gray-600">
          ADHD often co-occurs with other conditions. Checking these helps clinicians understand your full picture.
        </p>
      </div>

      <ErrorDisplay error={error} onDismiss={clearError} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Mental Health Conditions">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Have you ever been diagnosed with or experienced any of these?
            </p>
            {COMORBIDITIES.map((cond) => (
              <label key={cond.id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked[cond.id] || false}
                  onChange={() => handleCheck(cond.id)}
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{cond.label}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Additional Information" className="border-b-0 pb-0">
          <TextArea
            label="Any other medical, psychiatric, or relevant history we should know about?"
            value={notes}
            onChange={setNotes}
            placeholder="Optional: medications, family history, previous evaluations, etc."
            rows={4}
          />
        </FormSection>

        <SubmitButton loading={submitted}>
          Continue to Review
        </SubmitButton>
      </form>
    </div>
  );
}
