import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { responses } = await request.json();

    if (!responses || responses.length !== 6) {
      return NextResponse.json({ error: 'Invalid responses' }, { status: 400 });
    }

    const inattention = (responses[0] + responses[1] + responses[2] + responses[3]) / 4;
    const hyperactivity = (responses[4] + responses[5]) / 2;
    const overall = (inattention + hyperactivity) / 2;

    let riskLevel: string;
    if (overall < 1.5) riskLevel = 'low';
    else if (overall < 2.5) riskLevel = 'moderate';
    else riskLevel = 'high';

    return NextResponse.json({
      inattentionScore: Math.round(inattention * 100) / 100,
      hyperactivityScore: Math.round(hyperactivity * 100) / 100,
      overallScore: Math.round(overall * 100) / 100,
      riskLevel,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
