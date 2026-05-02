import { NextRequest, NextResponse } from 'next/server';
import { supabase, updateAssessment } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessmentId } = body;

    if (!assessmentId) {
      return NextResponse.json({ error: 'Missing assessmentId' }, { status: 400 });
    }

    // Fetch current assessment
    const { data: assessment, error: fetchError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (fetchError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Mark as completed
    const completed = await updateAssessment(assessmentId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      current_section: 'review',
      last_activity_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      assessment: completed,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
