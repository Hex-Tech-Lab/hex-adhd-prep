'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { FormSection, TextArea, SubmitButton } from '@/lib/components/ui/FormComponents';
import { Input } from '@/lib/components/ui/Input';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';
import { FamilyFormData } from '@/lib/types/assessment';

const RELATIONSHIPS = [
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'spouse', label: 'Spouse/Partner' },
  { value: 'friend', label: 'Close Friend' },
  { value: 'other', label: 'Other' },
];

export default function FamilyPage() {
  const [familyMemberName, setFamilyMemberName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [observations, setObservations] = useState('');
  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('family');
  const router = useRouter();

  const validateForm = (data: FamilyFormData) => {
    return !!(data.familyMemberName?.trim() && data.relationship && data.observations?.trim());
  };

  const { submitted, error, submitForm, clearError } = useFormSubmission<FamilyFormData>(
    '/assessment/family',
    '/assessment/history',
    validateForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentId) return;

    const formData: FamilyFormData = {
      assessmentId,
      familyMemberName,
      relationship,
      observations,
    };

    await submitForm(formData);
  };

  const isComplete = familyMemberName.trim() && relationship && observations.trim();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressIndicator
        current={progress.number}
        total={progress.total}
        label={progress.label}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Family & Friend Perspective</h1>
        <p className="text-gray-600">
          People who know you well often notice patterns you might miss. This helps clinicians get a complete picture.
        </p>
      </div>

      <ErrorDisplay error={error} onDismiss={clearError} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Family Member Information">
          <Input
            label="Who is providing this perspective?"
            value={familyMemberName}
            onChange={setFamilyMemberName}
            placeholder="e.g., Mom, John, Sarah"
            required
          />
        </FormSection>

        <FormSection title="Relationship">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">
              What is your relationship to them?
            </p>
            {RELATIONSHIPS.map((rel) => (
              <label key={rel.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value={rel.value}
                  checked={relationship === rel.value}
                  onChange={(e) => setRelationship(e.target.value)}
                  required
                  className="mr-3 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">{rel.label}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Observations" className="border-b-0 pb-0">
          <TextArea
            label="What have you noticed about their attention, focus, or organizational patterns?"
            value={observations}
            onChange={setObservations}
            placeholder="e.g., difficulty staying focused, forgetfulness, procrastination, restlessness, interrupts often, disorganized..."
            required
            rows={5}
          />
        </FormSection>

        <SubmitButton disabled={!isComplete} loading={submitted}>
          Submit Family Perspective
        </SubmitButton>
      </form>
    </div>
  );
}
