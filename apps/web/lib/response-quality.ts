/**
 * Response Quality Scoring System
 * Evaluates user responses for quality and completeness
 * Part of Software 3.0: Data-Centric AI Improvement
 */

export interface ResponseQuality {
  score: 0-100; // Overall quality score
  length: 'too_short' | 'adequate' | 'detailed';
  specificity: 'vague' | 'specific' | 'detailed';
  relevance: 'off_topic' | 'relevant' | 'highly_relevant';
  clarity: 'unclear' | 'clear' | 'very_clear';
  confidence: 0-100; // Confidence in the score
}

export interface QualityFeedback {
  question_id: string;
  response_text: string;
  quality: ResponseQuality;
  suggestions: string[];
  needs_followup: boolean;
}

export function scoreResponseQuality(responseText: string, expectedMinLength: number = 10): ResponseQuality {
  const text = responseText.trim();
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

  // Length assessment
  const length: ResponseQuality['length'] =
    wordCount < expectedMinLength ? 'too_short' : wordCount < 50 ? 'adequate' : 'detailed';

  // Specificity assessment
  const vagueKeywords = ['something', 'things', 'stuff', 'kind of', 'sort of', 'like', 'basically'];
  const vagueCount = vagueKeywords.filter((keyword) => text.toLowerCase().includes(keyword)).length;
  const specificity: ResponseQuality['specificity'] =
    vagueCount > 3 ? 'vague' : wordCount < 30 ? 'specific' : 'detailed';

  // Relevance assessment (basic heuristic)
  const relevance: ResponseQuality['relevance'] =
    wordCount < 5 ? 'off_topic' : wordCount < 30 ? 'relevant' : 'highly_relevant';

  // Clarity assessment
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : wordCount;
  const clarity: ResponseQuality['clarity'] =
    avgSentenceLength > 25 ? 'unclear' : avgSentenceLength > 15 ? 'clear' : 'very_clear';

  // Calculate overall score
  const scores = {
    length: { too_short: 30, adequate: 70, detailed: 100 }[length],
    specificity: { vague: 40, specific: 70, detailed: 100 }[specificity],
    relevance: { off_topic: 20, relevant: 70, highly_relevant: 100 }[relevance],
    clarity: { unclear: 40, clear: 75, very_clear: 100 }[clarity],
  };

  const score = Math.round((scores.length * 0.2 + scores.specificity * 0.3 + scores.relevance * 0.3 + scores.clarity * 0.2) as unknown as number) as 0-100;
  const confidence = Math.min(80 + wordCount * 5, 100) as 0-100; // Higher confidence with more data

  return { score, length, specificity, relevance, clarity, confidence };
}

export function generateQualitySuggestions(quality: ResponseQuality): string[] {
  const suggestions: string[] = [];

  if (quality.length === 'too_short') {
    suggestions.push('Please provide more detail to help us understand your experience better.');
  }

  if (quality.specificity === 'vague') {
    suggestions.push('Try to be more specific - use concrete examples or describe situations that happened.');
  }

  if (quality.relevance === 'off_topic') {
    suggestions.push('This response seems unrelated to the question. Please answer what was asked.');
  }

  if (quality.clarity === 'unclear') {
    suggestions.push('Try breaking this into shorter sentences for clarity.');
  }

  return suggestions;
}

export function assessNeedsFollowup(quality: ResponseQuality): boolean {
  return quality.score < 60 || quality.length === 'too_short' || quality.specificity === 'vague';
}

export function createQualityFeedback(
  questionId: string,
  responseText: string,
  expectedMinLength?: number
): QualityFeedback {
  const quality = scoreResponseQuality(responseText, expectedMinLength);
  const suggestions = generateQualitySuggestions(quality);
  const needsFollowup = assessNeedsFollowup(quality);

  return {
    question_id: questionId,
    response_text: responseText,
    quality,
    suggestions,
    needs_followup: needsFollowup,
  };
}
