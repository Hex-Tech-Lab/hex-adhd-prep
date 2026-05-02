import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validateEmail, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, age } = body;

    if (!email || !password || !age) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, age' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (typeof age !== 'number' || age < 18 || age > 120) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 120' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
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