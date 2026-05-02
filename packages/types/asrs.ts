// Generated from packages/specs/adhd/questionnaire.yaml

export interface ASRSQuestion {
  id: string;
  text: string;
  type: 'likert_5';
  weight: number;
  domain: 'inattention' | 'hyperactivity';
}

export interface ASRSResponse {
  assessmentId: string;
  questionId: string;
  responseValue: 0 | 1 | 2 | 3 | 4;
}

export interface ASRSScores {
  assessmentId: string;
  inattentionScore: number;
  hyperactivityScore: number;
  overallScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  explanation: string;
}

export const ASRS_QUESTIONS: ASRSQuestion[] = [
  {
    id: 'Q1',
    text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'inattention',
  },
  {
    id: 'Q2',
    text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'inattention',
  },
  {
    id: 'Q3',
    text: 'How often do you have problems remembering appointments or obligations?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'inattention',
  },
  {
    id: 'Q4',
    text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'inattention',
  },
  {
    id: 'Q5',
    text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'hyperactivity',
  },
  {
    id: 'Q6',
    text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?',
    type: 'likert_5',
    weight: 1.0,
    domain: 'hyperactivity',
  },
];

export const ANSWER_OPTIONS = [
  { value: 0, label: 'Never or Rarely' },
  { value: 1, label: 'Sometimes' },
  { value: 2, label: 'Often' },
  { value: 3, label: 'Very Often' },
  { value: 4, label: 'Constantly or Almost Always' },
];
