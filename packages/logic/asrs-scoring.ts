// Generated from packages/specs/adhd/scoring.yaml

import { ASRSScores, ASRSResponse } from '@hex/types';

export function calculateASRSScores(responses: ASRSResponse[]): ASRSScores {
  // Calculate subscale scores
  const inattentionResponses = responses
    .filter(r => ['Q1', 'Q2', 'Q3', 'Q4'].includes(r.questionId))
    .map(r => r.responseValue);

  const hyperactivityResponses = responses
    .filter(r => ['Q5', 'Q6'].includes(r.questionId))
    .map(r => r.responseValue);

  const inattentionScore = inattentionResponses.length > 0
    ? inattentionResponses.reduce((a, b) => a + b, 0) / inattentionResponses.length
    : 0;

  const hyperactivityScore = hyperactivityResponses.length > 0
    ? hyperactivityResponses.reduce((a, b) => a + b, 0) / hyperactivityResponses.length
    : 0;

  const overallScore = (inattentionScore + hyperactivityScore) / 2;

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high';
  let explanation: string;

  if (overallScore < 1.5) {
    riskLevel = 'low';
    explanation = 'Your responses suggest minimal ADHD symptoms. However, only a clinician can provide a diagnosis.';
  } else if (overallScore < 2.5) {
    riskLevel = 'moderate';
    explanation = 'Your responses suggest moderate ADHD symptoms. A clinical evaluation is recommended.';
  } else {
    riskLevel = 'high';
    explanation = 'Your responses suggest significant ADHD symptoms. We strongly recommend scheduling a clinical evaluation.';
  }

  return {
    assessmentId: responses[0]?.assessmentId || '',
    inattentionScore: Math.round(inattentionScore * 100) / 100,
    hyperactivityScore: Math.round(hyperactivityScore * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100,
    riskLevel,
    explanation,
  };
}
