import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { workImpact, relationshipImpact, biggestChallenge } = await request.json();

    if (!workImpact || !relationshipImpact || !biggestChallenge) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save to Supabase assessment.impact_data
    // For now, return success
    return NextResponse.json({
      success: true,
      data: { workImpact, relationshipImpact, biggestChallenge },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
