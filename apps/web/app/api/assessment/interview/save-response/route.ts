import { NextRequest, NextResponse } from 'next/server';
import { detectFollowUpNeeded } from '@/lib/claude/client';
import { updateAssessment, insertInterviewResponse, getInterviewResponseCount } from '@/lib/supabase-server';
import { TOTAL_INTERVIEW_QUESTIONS } from '@/lib/constants';

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

    // Check if follow-up is needed using Claude
    let followUpResult: { needsFollowUp: boolean; followUpQuestion?: string | null } = { needsFollowUp: false };
    try {
      followUpResult = await detectFollowUpNeeded(questionText || 'General interview question', response);
    } catch (error) {
      console.warn('Follow-up detection failed, continuing without:', error);
    }

    // Get current response count BEFORE inserting the new one
    const previousCount = await getInterviewResponseCount(assessmentId);
    
    // Save the response
    await insertInterviewResponse({
      assessment_id: assessmentId,
      question_id: questionId,
      response_text: response,
      ai_flagged_vague: followUpResult.needsFollowUp,
      ai_follow_up_question: followUpResult.followUpQuestion || null,
    });

    // Calculate new count and progress
    const newCount = previousCount + 1;
    const progressPercent = Math.min(100, Math.round((newCount / TOTAL_INTERVIEW_QUESTIONS) * 100));

    // If interview is complete, suppress follow-up to avoid exceeding total questions
    const shouldReturnFollowUp = followUpResult.needsFollowUp && progressPercent < 100;

    // Update assessment progress
    const assessment = await updateAssessment(assessmentId, {
      current_section: 'interview',
      last_activity_at: new Date().toISOString(),
      interview_progress_percent: progressPercent,
    });

    return NextResponse.json({
      success: true,
      assessment,
      followUpQuestion: shouldReturnFollowUp ? followUpResult.followUpQuestion || null : null,
    });
  } catch (err) {
    console.error('Interview save error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
