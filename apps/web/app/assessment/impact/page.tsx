'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { FormSection, TextArea, SubmitButton } from '@/lib/components/ui/FormComponents';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';
import { ImpactFormData } from '@/lib/types/assessment';

export default function ImpactPage() {
  const [workImpact, setWorkImpact] = useState('');
  const [relationshipImpact, setRelationshipImpact] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('impact');
  const router = useRouter();

  const validateForm = (data: ImpactFormData) => {
    return !!(data.workImpact?.trim() && data.relationshipImpact?.trim() && data.biggestChallenge?.trim());
  };

  const { submitted, error, submitForm, clearError } = useFormSubmission<ImpactFormData>(
    '/assessment/impact',
    '/assessment/comorbidity',
    validateForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentId) return;

    const formData: ImpactFormData = {
      assessmentId,
      workImpact,
      relationshipImpact,
      biggestChallenge,
    };

    await submitForm(formData);
  };

  const isComplete = workImpact.trim() && relationshipImpact.trim() && biggestChallenge.trim();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ProgressIndicator
        current={progress.number}
        total={progress.total}
        label={progress.label}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Life Impact & Challenges</h1>
        <p className="text-gray-600">
          Understanding how ADHD symptoms affect your daily life helps clinicians make accurate assessments.
        </p>
      </div>

      <ErrorDisplay error={error} onDismiss={clearError} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Work & Career Impact">
          <TextArea
            label="How have attention or organization challenges affected your work or career?"
            value={workImpact}
            onChange={setWorkImpact}
            placeholder="e.g., missed deadlines, trouble staying focused in meetings, difficulty organizing tasks..."
            required
          />
        </FormSection>

        <FormSection title="Relationships & Social Impact">
          <TextArea
            label="How have these challenges affected your relationships or social connections?"
            value={relationshipImpact}
            onChange={setRelationshipImpact}
            placeholder="e.g., losing track of social commitments, difficulty listening, interrupting others, relationship conflicts..."
            required
          />
        </FormSection>

        <FormSection title="Biggest Challenge" className="border-b-0 pb-0">
          <TextArea
            label="What is your biggest challenge or struggle right now?"
            value={biggestChallenge}
            onChange={setBiggestChallenge}
            placeholder="Describe your most pressing challenge..."
            required
          />
        </FormSection>

        <SubmitButton disabled={!isComplete} loading={submitted}>
          Continue to Next Section
        </SubmitButton>
      </form>
    </div>
  );
}
