import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: NextRequest) {
  try {
    // Trigger a test error for Sentry to capture
    throw new Error('Sentry test error - triggered from API endpoint');
  } catch (error) {
    // Capture the error with Sentry
    Sentry.captureException(error);

    return NextResponse.json({
      success: true,
      message: 'Error triggered and sent to Sentry',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
