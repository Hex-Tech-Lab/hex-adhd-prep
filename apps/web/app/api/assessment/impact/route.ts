import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, workImpact, relationshipImpact, biggestChallenge } = body;

    if (!assessmentId || !workImpact || !relationshipImpact || !biggestChallenge) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        note: 'Demo mode - data not persisted',
        data: { workImpact, relationshipImpact, biggestChallenge }
      });
    }

    const { updateAssessment } = await import('@/lib/supabase-server');
    const assessment = await updateAssessment(assessmentId, {
      impact_data: { workImpact, relationshipImpact, biggestChallenge },
      current_section: 'comorbidity',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, assessment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}