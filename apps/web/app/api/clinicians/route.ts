import { NextRequest, NextResponse } from 'next/server';
import { getClinicians } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || undefined;
    const specialty = searchParams.get('specialty') || undefined;

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        note: 'Demo mode - showing sample clinicians',
        data: [],
      });
    }

    const filters = city || specialty ? { city, specialty } : undefined;
    const clinicians = await getClinicians(filters);

    return NextResponse.json({
      success: true,
      data: clinicians,
    });
  } catch (err) {
    console.error('Error fetching clinicians:', err);
    return NextResponse.json(
      { error: 'Failed to fetch clinicians' },
      { status: 500 }
    );
  }
}