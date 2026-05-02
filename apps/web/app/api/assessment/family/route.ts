import { NextRequest, NextResponse } from 'next/server';
import { updateAssessment } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId, familyMemberName, relationship, observations } = body;

    if (!assessmentId || !familyMemberName || !relationship || !observations) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const assessment = await updateAssessment(assessmentId, {
      family_input_provided: true,
      family_input_completed_at: new Date().toISOString(),
      current_section: 'history',
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
