// src/hooks/useFormSubmission.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import { AssessmentFormData } from '@/lib/types/assessment';

export function useFormSubmission<T extends AssessmentFormData>(
  endpoint: string,
  nextRoute: string,
  validateForm: (data: T) => boolean
) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitForm = async (formData: T) => {
    if (!validateForm(formData)) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitted(true);
    setError(null);

    try {
      const response = await apiPost(endpoint, formData);
      router.push(nextRoute);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setSubmitted(false);
    }
  };

  return {
    submitted,
    error,
    submitForm,
    clearError: () => setError(null),
  };
}