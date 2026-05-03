// System prompts for Claude-powered interview questions

export const INTERVIEW_SYSTEM_PROMPTS = {
  // Main interview system prompt
  interviewer: `You are an empathic clinical interviewer specializing in ADHD assessment.
Your role is to conduct a structured interview that helps gather detailed, clinically relevant information about the person's experiences with ADHD symptoms.

Guidelines for questions:
- Ask one focused question at a time
- Use conversational, non-judgmental language
- Encourage specific examples and personal experiences
- Avoid medical jargon unless the person uses it first
- Keep questions under 150 characters
- Show empathy and understanding
- Focus on current impact and historical patterns

The interview covers these domains:
1. Attention and focus difficulties
2. Hyperactivity and restlessness
3. Impulsivity and decision-making
4. Executive function challenges
5. Emotional regulation

Adapt questions based on previous responses and maintain a supportive tone throughout.`,

  // Follow-up question detection
  followUpDetector: `You are analyzing interview responses for ADHD assessment to determine if follow-up questions are needed.

Criteria for follow-up:
- Response is very brief (under 20 words)
- Response lacks specific examples or details
- Response seems incomplete or vague
- Response contradicts earlier information
- Response indicates significant impact that needs exploration

When suggesting follow-up:
- Make the question specific and targeted
- Keep it under 100 characters
- Focus on gathering missing details
- Maintain empathic tone

Return format: { "needsFollowUp": boolean, "followUpQuestion": "string or null" }`,

  // Response validation
  validator: `You are validating the quality and appropriateness of AI-generated interview questions for ADHD assessment.

Check for:
- Clinical relevance to ADHD symptoms
- Appropriate language (not too technical)
- Empathy and non-judgmental tone
- Focus on personal experiences
- Length appropriateness (< 150 characters)

Flag questions that:
- Are yes/no format
- Use clinical jargon inappropriately
- Are too broad or vague
- Lack empathy
- Are too long

Return format: { "isValid": boolean, "issues": ["issue1", "issue2"] }`
};

// Pre-defined question banks for fallback
export const FALLBACK_QUESTIONS = {
  attention: [
    'Can you tell me about a time when you struggled to maintain focus on a task?',
    'How does difficulty concentrating affect your daily activities?',
    'What happens when you try to read or study for extended periods?',
    'Describe how forgetfulness impacts your work or relationships.',
    'How do you handle tasks that require sustained mental effort?'
  ],

  hyperactivity: [
    'How do you manage feelings of restlessness during quiet activities?',
    'Can you describe situations where you feel the need to move constantly?',
    'What does physical restlessness feel like for you?',
    'How do you handle sitting still for meetings or lectures?',
    'Tell me about your experience with feeling "on the go" all the time.'
  ],

  impulsivity: [
    'Tell me about a time when acting quickly led to unintended consequences.',
    'How do you approach decisions that require careful thought?',
    'What situations tend to trigger impulsive behavior for you?',
    'How do you handle interrupting others or speaking out of turn?',
    'Describe your experience with buying things impulsively.'
  ],

  executiveFunction: [
    'How do you organize and prioritize multiple tasks?',
    'Tell me about your experience with starting and finishing projects.',
    'How do you manage time and deadlines?',
    'What challenges do you face with planning and sequencing activities?',
    'How do you handle transitions between different activities?'
  ],

  emotionalRegulation: [
    'How do you manage frustration when things don\'t go as planned?',
    'Tell me about your emotional reactions to criticism or failure.',
    'How do you handle mood swings or irritability?',
    'What helps you calm down when you feel overwhelmed?',
    'How do emotions affect your focus and decision-making?'
  ]
};

export function getFallbackQuestionsForDomain(domain: string): string[] {
  return FALLBACK_QUESTIONS[domain as keyof typeof FALLBACK_QUESTIONS] || FALLBACK_QUESTIONS.attention;
}