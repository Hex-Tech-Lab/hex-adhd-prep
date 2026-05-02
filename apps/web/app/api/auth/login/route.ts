import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, validateEmail, generateSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (hasSupabase) {
      const { getUserByEmail } = await import('@/lib/supabase-server');

      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const isValid = verifyPassword(password, user.password_hash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const sessionToken = generateSessionToken();

      return NextResponse.json(
        {
          success: true,
          user: { id: user.id, email: user.email, age: user.age, tier: user.tier },
          sessionToken,
        },
        { status: 200 }
      );
    }

    if (email === 'demo@test.com' && password === 'demo12345') {
      return NextResponse.json(
        {
          success: true,
          user: { id: 'demo-user-id', email, age: 30, tier: '49' },
          sessionToken: generateSessionToken(),
          note: 'Demo mode'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Demo mode: use email=demo@test.com password=demo12345' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}