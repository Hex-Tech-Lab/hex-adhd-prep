import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validateEmail, generateSessionToken } from '@/lib/auth';
import { createUser, createAssessment, getUserByEmail } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, age } = body;

    // Validation
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

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const passwordHash = hashPassword(password);
    const user = await createUser(email, passwordHash, age);

    // Create initial assessment (Tier $49)
    const assessment = await createAssessment(user.id, '49');

    // Generate session token
    const sessionToken = generateSessionToken();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          age: user.age,
        },
        assessment: {
          id: assessment.id,
          tier: assessment.tier,
        },
        sessionToken,
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
