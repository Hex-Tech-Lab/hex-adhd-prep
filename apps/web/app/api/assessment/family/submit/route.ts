import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface FamilySubmission {
  assessmentId: string;
  familyToken?: string;
  familyMemberName: string;
  relationship: string;
  observations: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FamilySubmission = await request.json();
    const { assessmentId, familyToken, familyMemberName, relationship, observations } = body;

    if (!familyMemberName || !relationship || !observations) {
      return NextResponse.json(
        { error: 'Missing required fields: familyMemberName, relationship, observations' },
        { status: 400 }
      );
    }

    // Validate assessment ID format
    if (!assessmentId || !isValidUUID(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID format' }, { status: 400 });
    }

    // Validate relationship value
    const validRelationships = ['parent', 'sibling', 'spouse', 'friend', 'other'];
    if (!validRelationships.includes(relationship)) {
      return NextResponse.json(
        { error: `Invalid relationship. Must be one of: ${validRelationships.join(', ')}` },
        { status: 400 }
      );
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabase) {
      // Demo mode response
      return NextResponse.json({
        success: true,
        note: 'Demo mode - data not persisted',
        message: 'Family input submitted successfully. Thank you for your contribution.',
        data: { familyMemberName, relationship, observations },
        familyToken: `demo-token-${randomUUID()}`
      });
    }

    const { insertFamilyInput, getAssessmentByToken } = await import('@/lib/supabase-server');

    let validAssessmentId = assessmentId;
    let generatedToken = familyToken || `family-${randomUUID()}`;

    // If familyToken provided, validate it matches the assessment
    if (familyToken) {
      const assessment = await getAssessmentByToken(familyToken);
      if (!assessment) {
        return NextResponse.json({ error: 'Invalid family token' }, { status: 401 });
      }
      validAssessmentId = assessment.id;
    }

    // Store family input with generated or provided token
    const result = await insertFamilyInput({
      assessment_id: validAssessmentId,
      family_token: generatedToken,
      family_member_name: familyMemberName,
      relationship,
      observations,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Family input submitted successfully. Thank you for your contribution.',
      assessmentId: validAssessmentId,
      familyToken: generatedToken,
      familyInputId: result.id
    });
  } catch (err) {
    console.error('Family submission error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}