// src/types/assessment.ts
export interface AssessmentFormData {
  assessmentId: string;
  [key: string]: unknown;
}

export interface HistoryFormData extends AssessmentFormData {
  onset: string;
  schoolPerformance: string;
  childTraits: string;
}

export interface ImpactFormData extends AssessmentFormData {
  workImpact: string;
  relationshipImpact: string;
  biggestChallenge: string;
}

export interface ComorbidityFormData extends AssessmentFormData {
  comorbidities: string[];
  notes: string;
}

export interface InterviewFormData extends AssessmentFormData {
  questionId: string;
  response: string;
  questionText?: string;
}

export interface FamilyFormData extends AssessmentFormData {
  familyMemberName: string;
  relationship: string;
  observations: string;
}

export interface AssessmentResponse {
  success: boolean;
  assessment?: Record<string, unknown>;
  note?: string;
  [key: string]: unknown;
}

export type AssessmentStep =
  | 'start'
  | 'asrs'
  | 'history'
  | 'impact'
  | 'comorbidity'
  | 'interview'
  | 'family'
  | 'review'
  | 'complete';