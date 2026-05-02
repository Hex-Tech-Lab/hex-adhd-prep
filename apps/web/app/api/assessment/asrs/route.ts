import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, responses } = body;

    if (!assessmentId || !responses || responses.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid request: assessmentId and 6 responses required' },
        { status: 400 }
      );
    }

    const inattention = (responses[0] + responses[1] + responses[2] + responses[3]) / 4;
    const hyperactivity = (responses[4] + responses[5]) / 2;
    const overallScore = (inattention + hyperactivity) / 2;

    let riskLevel: string;
    if (overallScore < 1.5) riskLevel = 'low';
    else if (overallScore < 2.5) riskLevel = 'moderate';
    else riskLevel = 'high';

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          success: true,
          inattentionScore: Math.round(inattention * 100) / 100,
          hyperactivityScore: Math.round(hyperactivity * 100) / 100,
          overallScore: Math.round(overallScore * 100) / 100,
          riskLevel,
          note: 'DB not connected - scores calculated but not stored'
        },
        { status: 200 }
      );
    }

    const { updateAssessment } = await import('@/lib/supabase-server');
    const assessment = await updateAssessment(assessmentId, {
      asrs_part_a_score: Math.round(inattention * 100) / 100,
      asrs_part_b_score: Math.round(hyperactivity * 100) / 100,
      asrs_total_score: Math.round(overallScore * 100) / 100,
      asrs_risk_level: riskLevel,
      asrs_completed_at: new Date().toISOString(),
      current_section: 'family',
    });

    return NextResponse.json(
      {
        success: true,
        inattentionScore: Math.round(inattention * 100) / 100,
        hyperactivityScore: Math.round(hyperactivity * 100) / 100,
        overallScore: Math.round(overallScore * 100) / 100,
        riskLevel,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('ASRS scoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
