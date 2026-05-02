import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { comorbidities, notes } = await request.json();

    if (!Array.isArray(comorbidities)) {
      return NextResponse.json({ error: 'Invalid comorbidities' }, { status: 400 });
    }

    // TODO: Save to Supabase assessment.comorbidity_data
    // For now, return success
    return NextResponse.json({
      success: true,
      data: { comorbidities, notes },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
