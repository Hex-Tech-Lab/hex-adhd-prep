import Anthropic from '@anthropic-ai/sdk';
import { INTERVIEW_SYSTEM_PROMPTS, getFallbackQuestionsForDomain, getMemoryScaffoldsForAgeGroup } from './prompts';

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

  const systemPrompt = INTERVIEW_SYSTEM_PROMPTS.interviewer;

  const userPrompt = `CONTEXT: ADHD assessment interview in "${section}" domain
PREVIOUS RESPONSES: ${previousResponses.join('; ')}

Generate the next most appropriate interview question.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 120,
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
    // Enhanced fallback using domain-specific question banks
    return getEnhancedFallbackQuestion(section);
  }
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

  const systemPrompt = INTERVIEW_SYSTEM_PROMPTS.followUpDetector;

  const userPrompt = `QUESTION: ${question}
RESPONSE: ${response}

DETERMINE if follow-up needed:`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.3,
    });

    const content = response.content[0]?.type === 'text'
      ? response.content[0].text.trim()
      : '';

    try {
      const result = JSON.parse(content);

      // Enhanced validation with better error handling
      if (!result || typeof result !== 'object') {
        console.error('Invalid Claude response structure');
        return { needsFollowUp: false };
      }

      if (typeof result.needsFollowUp !== 'boolean') {
        console.error('Missing or invalid needsFollowUp boolean');
        return { needsFollowUp: false };
      }

      if (result.needsFollowUp) {
        if (typeof result.followUpQuestion !== 'string') {
          console.error('Follow-up needed but question missing');
          return { needsFollowUp: false };
        }
        if (result.followUpQuestion.length > 80) {
          console.warn('Follow-up question truncated to 80 chars');
          result.followUpQuestion = result.followUpQuestion.substring(0, 80);
        }
      }

      return result;
    } catch (parseError) {
      console.error('JSON parse error in follow-up detection:', parseError);
      return { needsFollowUp: false };
    }
  } catch (error) {
    console.error('Claude API error in follow-up detection:', error);
    return { needsFollowUp: false };
  }
}

      if (typeof result.needsFollowUp !== 'boolean') {
        console.error('Claude response missing valid needsFollowUp boolean');
        return { needsFollowUp: false };
      }

      if (result.needsFollowUp && typeof result.followUpQuestion !== 'string') {
        console.error('Claude response has needsFollowUp=true but missing followUpQuestion string');
        return { needsFollowUp: false };
      }

      // Validate follow-up question length if present
      if (result.followUpQuestion && result.followUpQuestion.length > 100) {
        console.warn('Claude follow-up question too long, truncating');
        result.followUpQuestion = result.followUpQuestion.substring(0, 100);
      }

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

// Enhanced fallback question selection using comprehensive question banks
function getEnhancedFallbackQuestion(section: string): string {
  const questions = getFallbackQuestionsForDomain(section.toLowerCase());
  return questions[Math.floor(Math.random() * questions.length)];
}

// Memory scaffolding for patients who express difficulty remembering
export async function generateMemoryScaffolds(ageGroup: 'early' | 'school' | 'adolescent' | 'general' = 'general'): Promise<string[]> {
  const client = getAnthropicClient();

  const systemPrompt = INTERVIEW_SYSTEM_PROMPTS.memoryScaffolding;

  const scaffolds = getMemoryScaffoldsForAgeGroup(ageGroup);
  const contextPrompt = `AGE GROUP: ${ageGroup} childhood
AVAILABLE SCAFFOLDS: ${scaffolds.slice(0, 5).join('; ')}

Generate 2-3 contextual memory prompts for ADHD recall:`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.6,
    });

    const content = response.content[0]?.type === 'text'
      ? response.content[0].text.trim()
      : '';

    try {
      const result = JSON.parse(content);
      if (result.scaffolds && Array.isArray(result.scaffolds) && result.scaffolds.length >= 2) {
        return result.scaffolds.slice(0, 3); // Limit to 3 scaffolds
      }
    } catch (parseError) {
      console.error('Failed to parse memory scaffold response:', parseError);
    }

    // Fallback to static scaffolds
    return scaffolds.slice(0, 3);
  } catch (error) {
    console.error('Claude API error in memory scaffolding:', error);
    // Return static scaffolds as fallback
    return getMemoryScaffoldsForAgeGroup(ageGroup).slice(0, 3);
  }
}