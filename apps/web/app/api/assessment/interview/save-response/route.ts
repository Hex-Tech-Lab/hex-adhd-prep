import { NextRequest, NextResponse } from 'next/server';
import { detectFollowUpNeeded } from '@/lib/claude/client';

export async function POST(request: NextRequest) {
  try {
    // Basic authentication check - in production, this would use proper auth tokens
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { assessmentId, questionId, response, questionText } = body;

    if (!assessmentId || !questionId || !response) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        note: 'Demo mode - data not persisted',
        data: { questionId, response }
      });
    }

    const { updateAssessment, insertInterviewResponse } = await import('@/lib/supabase-server');

    // Check if follow-up is needed using Claude
    let followUpResult: { needsFollowUp: boolean; followUpQuestion?: string | null } = { needsFollowUp: false };
    try {
      followUpResult = await detectFollowUpNeeded(questionText || 'General interview question', response);
    } catch (error) {
      console.warn('Follow-up detection failed, continuing without:', error);
    }

    // Save the response
    await insertInterviewResponse({
      assessment_id: assessmentId,
      question_id: questionId,
      response_text: response,
      ai_flagged_vague: followUpResult.needsFollowUp,
      ai_follow_up_question: followUpResult.followUpQuestion || null,
    });

    // Update assessment progress
    const assessment = await updateAssessment(assessmentId, {
      current_section: 'interview',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      assessment,
      followUpQuestion: followUpResult.followUpQuestion || null
    });
  } catch (err) {
    console.error('Interview save error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}