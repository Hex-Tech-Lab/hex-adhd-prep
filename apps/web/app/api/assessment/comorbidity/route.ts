import { NextRequest, NextResponse } from 'next/server';
import { updateAssessment } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, comorbidities, notes } = body;

    if (!assessmentId || !Array.isArray(comorbidities)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const assessment = await updateAssessment(assessmentId, {
      comorbidity_data: { comorbidities, notes },
      current_section: 'review',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
