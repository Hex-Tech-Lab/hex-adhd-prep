import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { familyMemberName, relationship, observations } = await request.json();

    if (!familyMemberName || !relationship || !observations) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Save to Supabase assessment.family_data
    // For now, return success
    return NextResponse.json({
      success: true,
      data: { familyMemberName, relationship, observations },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
