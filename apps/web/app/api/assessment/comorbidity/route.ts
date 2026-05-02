import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, comorbidities, notes } = body;

    if (!assessmentId || !Array.isArray(comorbidities)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        note: 'Demo mode - data not persisted',
        data: { comorbidities, notes }
      });
    }

    const { updateAssessment } = await import('@/lib/supabase-server');
    const assessment = await updateAssessment(assessmentId, {
      comorbidity_data: { comorbidities, notes },
      current_section: 'review',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, assessment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}