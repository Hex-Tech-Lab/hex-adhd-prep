import { NextRequest, NextResponse } from 'next/server';
import { validateAssessmentId, sanitizeText } from '@/lib/validation';
import { apiRateLimiter } from '@/lib/rate-limit';

/**
 * POST /api/assessment/feedback
 * Clinician feedback on assessment accuracy
 * Part of Software 3.0: Data-Centric AI Improvement Loop
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const limitResult = apiRateLimiter(clientIp);

    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json();
    const {
      assessmentId: rawAssessmentId,
      clinicianId,
      actualDiagnosis,
      confidence,
      assessmentAccuracy,
      missingSymptoms,
      falsePositives,
      notes,
    } = body;

    // Validate inputs
    let assessmentId: string;
    try {
      assessmentId = validateAssessmentId(rawAssessmentId);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    // Validate diagnosis
    const validDiagnoses = ['adhd', 'not-adhd', 'other'];
    if (!validDiagnoses.includes(actualDiagnosis)) {
      return NextResponse.json({ error: 'Invalid diagnosis value' }, { status: 400 });
    }

    // Validate confidence (0-1)
    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      return NextResponse.json({ error: 'Confidence must be between 0 and 1' }, { status: 400 });
    }

    // Validate accuracy (0-1)
    if (typeof assessmentAccuracy !== 'number' || assessmentAccuracy < 0 || assessmentAccuracy > 1) {
      return NextResponse.json(
        { error: 'Assessment accuracy must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Log feedback (in production, save to database)
    const feedback = {
      assessmentId,
      clinicianId,
      actualDiagnosis,
      confidence,
      assessmentAccuracy,
      missingSymptoms: Array.isArray(missingSymptoms)
        ? missingSymptoms.map((s: unknown) => sanitizeText(s))
        : [],
      falsePositives: Array.isArray(falsePositives)
        ? falsePositives.map((f: unknown) => sanitizeText(f))
        : [],
      notes: notes ? sanitizeText(notes) : '',
      feedbackTimestamp: new Date().toISOString(),
    };

    console.log('[FEEDBACK] Clinician assessment feedback:', feedback);

    return NextResponse.json(
      {
        success: true,
        feedbackId: `feedback-${Date.now()}`,
        message: 'Thank you for your feedback. This helps improve our assessment.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ERROR] Feedback endpoint:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
