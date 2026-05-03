import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateSessionToken } from '@/lib/auth';
import {
  validateAndSanitizeEmail,
  validateAndSanitizePassword,
  validateAge,
} from '@/lib/validation';
import { authRateLimiter } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    const limitResult = authRateLimiter(clientIp);
    if (!limitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { email: rawEmail, password: rawPassword, age: rawAge } = body;

    // Validate and sanitize inputs
    let email: string;
    let password: string;
    let age: number;

    try {
      email = validateAndSanitizeEmail(rawEmail);
      password = validateAndSanitizePassword(rawPassword);
      age = validateAge(rawAge);
    } catch (validationError) {
      return NextResponse.json(
        {
          error:
            validationError instanceof Error
              ? validationError.message
              : 'Invalid input',
        },
        { status: 400 }
      );
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabase) {
      const { createUser, createAssessment, getUserByEmail } = await import('@/lib/supabase-server');

      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      const passwordHash = hashPassword(password);
      const user = await createUser(email, passwordHash, age);
      const assessment = await createAssessment(user.id, '49');
      const sessionToken = generateSessionToken();

      return NextResponse.json(
        {
          success: true,
          user: { id: user.id, email: user.email, age: user.age },
          assessment: { id: assessment.id, tier: assessment.tier },
          sessionToken,
        },
        { status: 201 }
      );
    }

    const sessionToken = generateSessionToken();
    return NextResponse.json(
      {
        success: true,
        user: { id: 'demo-user-id', email, age },
        assessment: { id: 'demo-assessment-id', tier: '49' },
        sessionToken,
        note: 'Demo mode - DB not connected'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}