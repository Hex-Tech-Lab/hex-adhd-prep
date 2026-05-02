import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { onset, schoolPerformance, childTraits } = await request.json();

    if (!onset || !schoolPerformance || !childTraits) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save to Supabase assessment.history_data
    // For now, return success
    return NextResponse.json({
      success: true,
      data: { onset, schoolPerformance, childTraits },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
