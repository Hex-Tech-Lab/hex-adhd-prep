import { NextRequest, NextResponse } from 'next/server';
import { detectFollowUpNeeded, generateMemoryScaffolds } from '@/lib/claude/client';
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

    // Check if memory scaffolding is needed
    let memoryScaffolds: string[] | null = null;
    const memoryTriggerPhrases = [
      "i don't remember",
      "i can't recall",
      "i don't know",
      "no memory",
      "can't remember",
      "don't recall",
      "fuzzy memory",
      "unclear",
      "not sure about that"
    ];

    const needsMemoryHelp = memoryTriggerPhrases.some(phrase =>
      response.toLowerCase().includes(phrase)
    );

    if (needsMemoryHelp) {
      try {
        // Determine age group based on question content (simplified logic)
        let ageGroup: 'early' | 'school' | 'adolescent' | 'general' = 'general';
        const questionLower = (questionText || '').toLowerCase();

        if (questionLower.includes('child') || questionLower.includes('early') || questionLower.includes('preschool')) {
          ageGroup = 'early';
        } else if (questionLower.includes('school') || questionLower.includes('elementary') || questionLower.includes('middle')) {
          ageGroup = 'school';
        } else if (questionLower.includes('teen') || questionLower.includes('adolescent') || questionLower.includes('high school')) {
          ageGroup = 'adolescent';
        }

        memoryScaffolds = await generateMemoryScaffolds(ageGroup);
      } catch (error) {
        console.warn('Memory scaffolding failed, continuing without:', error);
      }
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
      memoryScaffolds: memoryScaffolds || null,
    });
  } catch (err) {
    console.error('Interview save error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
