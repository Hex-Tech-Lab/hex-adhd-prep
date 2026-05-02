import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateASRSScores } from '@hex/logic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { assessmentId, responses } = await request.json();

    // Validate
    if (!assessmentId || !responses || responses.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid request: need assessmentId and 6 responses' },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = calculateASRSScores(responses);

    // Store in Supabase
    const { error } = await supabase
      .from('asrs_scores')
      .insert([{
        assessment_id: assessmentId,
        inattention_score: scores.inattentionScore,
        hyperactivity_score: scores.hyperactivityScore,
        overall_score: scores.overallScore,
        risk_level: scores.riskLevel,
      }]);

    if (error) throw error;

    return NextResponse.json(scores, { status: 201 });
  } catch (err) {
    console.error('ASRS scoring error:', err);
    return NextResponse.json(
      { error: 'Scoring failed' },
      { status: 500 }
    );
  }
}
