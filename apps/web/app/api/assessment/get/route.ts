import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assessmentId = searchParams.get('id');

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      // Demo mode response
      return NextResponse.json({
        assessment: {
          id: assessmentId,
          asrs_risk_level: 'moderate',
          asrs_score: 2.5,
          history_data: { onset: 'childhood', schoolPerformance: 'struggled' },
          impact_data: { workImpact: 'significant', relationshipImpact: 'moderate' },
          comorbidity_data: { comorbidities: ['anxiety'] },
          family_input_provided: false,
          note: 'Demo mode - returning sample data'
        }
      });
    }

    const { getSupabaseClient } = await import('@/lib/supabase-server');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ assessment: data });
  } catch (err) {
    console.error('Error fetching assessment:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
