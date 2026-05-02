import { NextRequest, NextResponse } from 'next/server';
import { updateAssessment } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, onset, schoolPerformance, childTraits } = body;

    if (!assessmentId || !onset || !schoolPerformance || !childTraits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const assessment = await updateAssessment(assessmentId, {
      history_data: { onset, schoolPerformance, childTraits },
      current_section: 'impact',
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
