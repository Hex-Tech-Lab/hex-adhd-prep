import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    anthropicClient = new Anthropic({
      apiKey,
      // Add timeout and other configurations as needed
    });
  }

  return anthropicClient;
}

export async function generateInterviewQuestion(
  section: string,
  previousResponses: string[]
): Promise<string> {
  const client = getAnthropicClient();

  const systemPrompt = `You are an empathic clinical interviewer specializing in ADHD assessment.
Your role is to ask thoughtful, open-ended questions that help gather detailed information about the person's experiences.

Guidelines:
- Ask one question at a time
- Questions should be conversational and non-judgmental
- Focus on gathering specific examples and experiences
- Avoid yes/no questions when possible
- Keep questions under 150 characters
- Be supportive and understanding in tone

Current context: This is for an ADHD assessment interview in the "${section}" section.`;

  const userPrompt = `Based on these previous responses: ${previousResponses.join('; ')}

Generate the next most appropriate interview question for the "${section}" section.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.7,
    });

    const question = response.content[0]?.type === 'text'
      ? response.content[0].text.trim()
      : '';

    if (!question) {
      throw new Error('No question generated');
    }

    return question;
  } catch (error) {
    console.error('Claude API error:', error);
    // Fallback to static questions
    return getFallbackQuestion(section);
  }
}

export async function detectFollowUpNeeded(
  question: string,
  response: string
): Promise<{ needsFollowUp: boolean; followUpQuestion?: string | null }> {
  const client = getAnthropicClient();

  const systemPrompt = `You are analyzing interview responses for ADHD assessment.
Determine if the response is vague, incomplete, or would benefit from a follow-up question.

Return a JSON object with:
- needsFollowUp: boolean
- followUpQuestion: string (only if needsFollowUp is true, max 100 characters)

Guidelines:
- Mark as needing follow-up if response is very brief (< 20 words)
- Mark as needing follow-up if response lacks specific examples
- Mark as needing follow-up if response seems incomplete
- Follow-up questions should be specific and probing`;

  const userPrompt = `Question: ${question}
Response: ${response}

Analyze if this response needs a follow-up question:`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    const content = response.content[0]?.type === 'text'
      ? response.content[0].text.trim()
      : '';

    try {
      const result = JSON.parse(content);
      return result;
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError);
      return { needsFollowUp: false };
    }
  } catch (error) {
    console.error('Claude API error in follow-up detection:', error);
    return { needsFollowUp: false };
  }
}

function getFallbackQuestion(section: string): string {
  const fallbacks: Record<string, string[]> = {
    'attention': [
      'Can you tell me about a specific time when you struggled to maintain focus?',
      'How does difficulty concentrating affect your daily activities?',
      'What strategies have you tried to improve your focus?'
    ],
    'hyperactivity': [
      'How do you handle feelings of restlessness?',
      'Can you describe situations where you feel the need to move constantly?',
      'How does physical restlessness impact your work or relationships?'
    ],
    'impulsivity': [
      'Tell me about a time when acting quickly led to unintended consequences.',
      'How do you manage impulsive decisions?',
      'What situations tend to trigger impulsive behavior for you?'
    ]
  };

  const questions = fallbacks[section] || fallbacks['attention'];
  return questions[Math.floor(Math.random() * questions.length)];
}