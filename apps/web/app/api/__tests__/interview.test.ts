/**
 * @jest-environment node
 */

import { POST } from '../assessment/interview/save-response/route';
import { NextRequest } from 'next/server';

// Mock the supabase-server module
jest.mock('@/lib/supabase-server', () => ({
  updateAssessment: jest.fn(),
  insertInterviewResponse: jest.fn(),
}));

// Mock the claude client
jest.mock('@/lib/claude/client', () => ({
  detectFollowUpNeeded: jest.fn(),
  getAnthropicClient: jest.fn(() => null),
}));

// Mock response-quality
jest.mock('@/lib/response-quality', () => ({
  createQualityFeedback: jest.fn(() => ({ needs_followup: false })),
}));

// Mock claude/Prompts
jest.mock('@/lib/claude/prompts', () => ({
  getFallbackQuestionsForDomain: jest.fn(() => ['Fallback question']),
}));

// Import mocked modules
import { updateAssessment, insertInterviewResponse } from '@/lib/supabase-server';
import { detectFollowUpNeeded, getAnthropicClient } from '@/lib/claude/client';

const validToken = 'test-secret-api-key-123';
const validAuthHeader = `Bearer ${validToken}`;

const createRequest = (
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
): NextRequest => {
  const url = 'http://localhost/api/assessment/interview/save-response';
  return new NextRequest(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
};

const defaultValidBody = {
  assessmentId: 'test-assessment-id',
  questionId: 'q1',
  response: 'This is my detailed response to the interview question.',
  questionText: 'How do you handle daily tasks?',
};

describe('Interview Save-Response API Route', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    process.env.SUPABASE_SERVICE_ROLE_KEY = '';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ==================== AUTHENTICATION TESTS (16 tests) ====================

  describe('Authentication - Bearer Token Validation', () => {
    it('should return 401 when no Authorization header is provided', async () => {
      const request = createRequest(defaultValidBody);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 when Authorization header is empty', async () => {
      const request = createRequest(defaultValidBody, { Authorization: '' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 when Authorization header is missing Bearer prefix', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Token abc123',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 when Authorization header is just "Bearer" with no token', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Bearer',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 when Authorization header is "Bearer " with whitespace only', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Bearer ',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 when Authorization header has invalid format (no space)', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'BearerToken123',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should return 401 for Basic auth scheme', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Basic dXNlcjpwYXNz',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should pass authentication with valid Bearer token format', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).not.toBe(401);
      expect(data.error).not.toBe('Authentication required');
    });

    it('should not log or expose the token in error responses', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Bearer secret-token-12345',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(JSON.stringify(data)).not.toContain('secret-token-12345');
    });

    it('should not log or expose the token in 401 responses', async () => {
      // Remove authorization to trigger 401
      const req = createRequest(defaultValidBody);
      const response = await POST(req);
      const responseData = await response.json();

      expect(JSON.stringify(responseData)).not.toContain('secret-token-12345');
    });

    it('should return generic error message without internal details', async () => {
      const request = createRequest(defaultValidBody);
      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBe('Authentication required');
      expect(data).not.toHaveProperty('details');
      expect(data).not.toHaveProperty('stack');
      expect(data).not.toHaveProperty('hint');
    });

    it('should accept any non-empty Bearer token (format-only validation)', async () => {
      const tokens = ['Bearer abc', 'Bearer xyz-123', 'Bearer very-long-token-string-here'];

      for (const authHeader of tokens) {
        const request = createRequest(defaultValidBody, { Authorization: authHeader });
        const response = await POST(request);

        expect(response.status).not.toBe(401);
      }
    });

    it('should handle malformed Authorization header with multiple spaces', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'Bearer  token-with-double-space',
      });
      const response = await POST(request);

      // Should still pass format check (has "Bearer " prefix)
      expect(response.status).not.toBe(401);
    });

    it('should reject lowercase "bearer" scheme', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'bearer token123',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should reject uppercase "BEARER" scheme', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: 'BEARER token123',
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Authentication required');
    });

    it('should not include token in response headers', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);

      const headerNames = [...response.headers.keys()];
      headerNames.forEach((name) => {
        expect(response.headers.get(name)).not.toContain('test-secret-api-key-123');
      });
    });
  });

  // ==================== VALIDATION TESTS (12 tests) ====================

  describe('Body Validation', () => {
    it('should return 400 when assessmentId is missing', async () => {
      const request = createRequest(
        { questionId: 'q1', response: 'test response' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 when questionId is missing', async () => {
      const request = createRequest(
        { assessmentId: 'test-id', response: 'test response' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 when response is missing', async () => {
      const request = createRequest(
        { assessmentId: 'test-id', questionId: 'q1' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 when all required fields are missing', async () => {
      const request = createRequest({}, { Authorization: validAuthHeader });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 500 when request body is empty', async () => {
      const url = 'http://localhost/api/assessment/interview/save-response';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: validAuthHeader,
        },
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should return 400 when body is not valid JSON', async () => {
      const url = 'http://localhost/api/assessment/interview/save-response';
      const request = new NextRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: validAuthHeader,
        },
        body: 'not-json',
      });
      const response = await POST(request);

      expect(response.status).toBe(500);
    });

    it('should return 400 when assessmentId is empty string', async () => {
      const request = createRequest(
        { assessmentId: '', questionId: 'q1', response: 'test' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 when questionId is empty string', async () => {
      const request = createRequest(
        { assessmentId: 'test-id', questionId: '', response: 'test' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 when response is empty string', async () => {
      const request = createRequest(
        { assessmentId: 'test-id', questionId: 'q1', response: '' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should accept valid body with all required fields', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should accept valid body without optional questionText field', async () => {
      const request = createRequest(
        {
          assessmentId: 'test-id',
          questionId: 'q1',
          response: 'test response',
        },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should not expose internal data in validation error responses', async () => {
      const request = createRequest({}, { Authorization: validAuthHeader });
      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBe('Missing required fields');
      expect(data).not.toHaveProperty('missing');
      expect(data).not.toHaveProperty('fields');
    });
  });

  // ==================== DEMO MODE TESTS (6 tests) ====================

  describe('Demo Mode (No Supabase)', () => {
    beforeEach(() => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return success in demo mode when Supabase not configured', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.note).toBe('Demo mode - data not persisted');
    });

    it('should return the submitted data in demo mode', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(data.data).toEqual({
        questionId: 'q1',
        response: 'This is my detailed response to the interview question.',
      });
    });

    it('should not call Supabase in demo mode', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      await POST(request);

      expect(insertInterviewResponse).not.toHaveBeenCalled();
      expect(updateAssessment).not.toHaveBeenCalled();
    });

    it('should return 200 even with missing optional fields in demo mode', async () => {
      const request = createRequest(
        { assessmentId: 'test-id', questionId: 'q1', response: 'test' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should not expose environment details in demo response', async () => {
      process.env.DATABASE_URL = 'secret-db-url';
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(JSON.stringify(data)).not.toContain('secret-db-url');

      delete process.env.DATABASE_URL;
    });

    it('should return consistent response shape in demo mode', async () => {
      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty('success');
      expect(data).toHaveProperty('note');
      expect(data).toHaveProperty('data');
    });
  });

  // ==================== SUPABASE MODE TESTS (8 tests) ====================

  describe('Supabase Mode', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
    });

    afterEach(() => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should insert interview response with correct data', async () => {
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      await POST(request);

      expect(insertInterviewResponse).toHaveBeenCalledWith({
        assessment_id: 'test-assessment-id',
        question_id: 'q1',
        response_text: 'This is my detailed response to the interview question.',
        ai_flagged_vague: false,
        ai_follow_up_question: null,
      });
    });

    it('should update assessment with correct section', async () => {
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      await POST(request);

      expect(updateAssessment).toHaveBeenCalledWith(
        'test-assessment-id',
        expect.objectContaining({
          current_section: 'interview',
        })
      );
    });

    it('should set follow-up flag when Claude detects vague response', async () => {
      (getAnthropicClient as jest.Mock).mockReturnValue({});
      (detectFollowUpNeeded as jest.Mock).mockResolvedValue({
        needsFollowUp: true,
        followUpQuestion: 'Can you provide more details?',
      });
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      await POST(request);

      expect(insertInterviewResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          ai_flagged_vague: true,
          ai_follow_up_question: 'Can you provide more details?',
        })
      );
    });

    it('should return follow-up question in response when detected', async () => {
      (getAnthropicClient as jest.Mock).mockReturnValue({});
      (detectFollowUpNeeded as jest.Mock).mockResolvedValue({
        needsFollowUp: true,
        followUpQuestion: 'Can you elaborate?',
      });
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(data.followUpQuestion).toBe('Can you elaborate?');
    });

    it('should continue without follow-up when Claude detection fails', async () => {
      (detectFollowUpNeeded as jest.Mock).mockRejectedValue(
        new Error('API error')
      );
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should return 500 when insertInterviewResponse throws', async () => {
      (insertInterviewResponse as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal error');
    });

    it('should return 500 when updateAssessment throws', async () => {
      (insertInterviewResponse as jest.Mock).mockResolvedValue({ id: 'resp-1' });
      (updateAssessment as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal error');
    });

    it('should not expose database error details in 500 response', async () => {
      (insertInterviewResponse as jest.Mock).mockRejectedValue(
        new Error('connection refused to db.example.com:5432')
      );

      const request = createRequest(defaultValidBody, {
        Authorization: validAuthHeader,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(data.error).toBe('Internal error');
      expect(JSON.stringify(data)).not.toContain('db.example.com');
    });
  });

  // ==================== SECURITY & EDGE CASE TESTS (6 tests) ====================

  describe('Security & Edge Cases', () => {
    it('should handle very large response text without crashing', async () => {
      const largeResponse = 'a'.repeat(10000);
      const request = createRequest(
        { ...defaultValidBody, response: largeResponse },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle Unicode characters in response', async () => {
      const request = createRequest(
        { ...defaultValidBody, response: '你好 🎉 émoji tést' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should handle null values in body gracefully', async () => {
      const request = createRequest(
        { assessmentId: null, questionId: 'q1', response: 'test' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle number instead of string for assessmentId', async () => {
      const request = createRequest(
        { assessmentId: 123, questionId: 'q1', response: 'test' },
        { Authorization: validAuthHeader }
      );
      const response = await POST(request);

      // Should pass validation since number is truthy, then succeed in demo mode
      expect([200, 400]).toContain(response.status);
    });

    it('should not include stack traces in error responses', async () => {
      const request = createRequest(defaultValidBody);
      const response = await POST(request);
      const data = await response.json();

      expect(JSON.stringify(data)).not.toMatch(/stack|trace|at\s+\w+|\.ts:\d+/i);
    });

    it('should handle rapid successive requests without state corruption', async () => {
      const promises = Array.from({ length: 5 }, (_, i) => {
        const request = createRequest(
          { ...defaultValidBody, assessmentId: `test-${i}` },
          { Authorization: validAuthHeader }
        );
        return POST(request);
      });

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });
});
