'use client';
import { useState, useEffect } from 'react';
import { useAssessmentId, useAssessmentProgress } from '@/lib/hooks/useAssessment';
import { ProgressIndicator } from '@/lib/components/ui/ProgressIndicator';
import { FormSection, TextArea, SubmitButton } from '@/lib/components/ui/FormComponents';
import { ErrorDisplay } from '@/lib/components/ui/ErrorDisplay';
import { InterviewFormData } from '@/lib/types/assessment';

interface InterviewQuestion {
  id: string;
  question: string;
  isFollowUp?: boolean;
}

export default function InterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [response, setResponse] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { assessmentId } = useAssessmentId();
  const progress = useAssessmentProgress('interview');

  useEffect(() => {
    // Initialize interview questions
    const initialQuestions: InterviewQuestion[] = [
      {
        id: '1',
        question: 'Can you tell me about a time when you struggled with maintaining focus or attention on a task?'
      },
      {
        id: '2',
        question: 'How do you typically handle situations where you feel restless or have difficulty sitting still?'
      },
      {
        id: '3',
        question: 'Describe a situation where impulsivity affected your decision-making.'
      },
      {
        id: '4',
        question: 'How do you manage tasks that require sustained mental effort over time?'
      },
      {
        id: '5',
        question: 'Can you share an experience where forgetting important details caused issues?'
      }
    ];

    setQuestions(initialQuestions);
    setCurrentQuestion(initialQuestions[0]);
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessmentId || !currentQuestion || !response.trim()) return;

    const formData: InterviewFormData = {
      assessmentId,
      questionId: currentQuestion.id,
      response: response.trim(),
      questionText: currentQuestion.question,
    };

    setSubmitted(true);
    setError(null);

    try {
      const res = await fetch('/api/assessment/interview/save-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save response');
      }

      // If interview progress is 100%, transition to family section
      if (result.assessment?.interview_progress_percent === 100) {
        window.location.href = '/assessment/family';
        return;
      }

      if (result.followUpQuestion) {
        // Handle follow-up question - insert at currentIndex+1 for correct ordering
        const followUp: InterviewQuestion = {
          id: `${currentQuestion.id}-followup`,
          question: result.followUpQuestion,
          isFollowUp: true
        };
        // Insert follow-up immediately after current question
        setQuestions(prev => {
          const newQuestions = [...prev];
          newQuestions.splice(currentIndex + 1, 0, followUp);
          return newQuestions;
        });
        // Advance to the newly inserted follow-up
        setCurrentIndex(prevIndex => prevIndex + 1);
        setCurrentQuestion(followUp);
        setResponse('');
      } else if (currentIndex < questions.length - 1) {
        // Move to next question
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setResponse('');
      } else {
        // Interview complete - navigate to next section
        window.location.href = '/assessment/family';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setSubmitted(false);
    }
  };

  const isComplete = response.trim().length > 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing your interview...</p>
          </div>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Structured Interview
          {currentQuestion?.isFollowUp && (
            <span className="text-sm font-normal text-blue-600 ml-2">(Follow-up)</span>
          )}
        </h1>
        <p className="text-gray-600">
          This guided interview will help gather detailed information about your experiences.
          Please answer as openly and honestly as possible.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <ErrorDisplay error={error} onDismiss={() => setError(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title={currentQuestion?.question || ''} className="border-b-0 pb-0">
          <TextArea
            label="Your response"
            value={response}
            onChange={setResponse}
            placeholder="Share your thoughts and experiences..."
            required
            rows={6}
          />
        </FormSection>

        <SubmitButton disabled={!isComplete} loading={submitted}>
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
        </SubmitButton>
      </form>
    </div>
  );
}