import { NextRequest, NextResponse } from 'next/server';
import { detectFollowUpNeeded, getAnthropicClient } from '@/lib/claude/client';
import { createQualityFeedback } from '@/lib/response-quality';
import { getFallbackQuestionsForDomain } from '@/lib/claude/prompts';

export async function POST(request: NextRequest) {
  try {
    // Bearer token authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const token = authHeader.slice(7).trim();
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { assessmentId, questionId, response, questionText, section } = body;

    if (!assessmentId || !questionId || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasClaude = getAnthropicClient() !== null;

    let followUpResult: { needsFollowUp: boolean; followUpQuestion?: string | null } = { needsFollowUp: false };

    if (hasClaude && hasSupabase) {
      try {
        followUpResult = await detectFollowUpNeeded(questionText || 'General interview question', response);
      } catch (error) {
        console.warn('Follow-up detection failed, falling back to heuristic:', error);
      }
    }

    if (!hasClaude || !followUpResult.needsFollowUp) {
      const heuristicFeedback = createQualityFeedback(questionId, response);
      if (heuristicFeedback.needs_followup && !hasClaude) {
        followUpResult = {
          needsFollowUp: true,
          followUpQuestion: getFallbackQuestionsForDomain(section || 'attention')[0],
        };
      }
    }

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        note: 'Demo mode - data not persisted',
        data: { questionId, response },
        followUpQuestion: followUpResult.followUpQuestion || null,
      });
    }

    const { updateAssessment, insertInterviewResponse } = await import('@/lib/supabase-server');

    await insertInterviewResponse({
      assessment_id: assessmentId,
      question_id: questionId,
      response_text: response,
      ai_flagged_vague: followUpResult.needsFollowUp,
      ai_follow_up_question: followUpResult.followUpQuestion || null,
    });

    const assessment = await updateAssessment(assessmentId, {
      current_section: 'interview',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      assessment,
      followUpQuestion: followUpResult.followUpQuestion || null,
    });
  } catch (err) {
    console.error('Interview save error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
