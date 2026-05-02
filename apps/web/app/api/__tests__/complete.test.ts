/**
 * @jest-environment node
 */

import { POST } from '../assessment/complete/route';
import { supabase, updateAssessment } from '@/lib/supabase-server';
import { NextRequest } from 'next/server';

jest.mock('@/lib/supabase-server', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
  updateAssessment: jest.fn(),
}));

describe('Complete API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/assessment/complete', () => {
    it('should return 200 and mark assessment as completed (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockSelect = {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { id: 'test-assessment-id', status: 'in_progress' },
              error: null,
            }),
          })),
        })),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockSelect);
      (updateAssessment as jest.Mock).mockResolvedValue({
        id: 'test-assessment-id',
        status: 'completed',
        completed_at: '2024-01-01T00:00:00.000Z',
        current_section: 'review',
      });

      const request = new NextRequest('http://localhost/api/assessment/complete', {
        method: 'POST',
        body: JSON.stringify({ assessmentId: 'test-assessment-id' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.assessment.status).toBe('completed');
      expect(data.assessment.current_section).toBe('review');
      expect(updateAssessment).toHaveBeenCalledWith(
        'test-assessment-id',
        expect.objectContaining({
          status: 'completed',
          current_section: 'review',
        })
      );

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return 400 when assessmentId is missing', async () => {
      const request = new NextRequest('http://localhost/api/assessment/complete', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing assessmentId');
    });

    it('should return 404 when assessment not found (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockSelect = {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          })),
        })),
      };

      (supabase.from as jest.Mock).mockReturnValue(mockSelect);

      const request = new NextRequest('http://localhost/api/assessment/complete', {
        method: 'POST',
        body: JSON.stringify({ assessmentId: 'nonexistent-id' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Assessment not found');

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return 500 when updateAssessment throws (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockSelect = { eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 'test-assessment-id' }, error: null }) }) };
      (supabase.from as jest.Mock).mockReturnValue(mockSelect);
      (updateAssessment as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/assessment/complete', {
        method: 'POST',
        body: JSON.stringify({ assessmentId: 'test-assessment-id' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal error');

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return 500 when updateAssessment throws (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockSelect = { eq: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: { id: 'test-assessment-id' }, error: null }) }) };
      (supabase.from as jest.Mock).mockReturnValue(mockSelect);
      (updateAssessment as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/assessment/complete', {
        method: 'POST',
        body: JSON.stringify({ assessmentId: 'test-assessment-id' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal error');

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });
  });
});
