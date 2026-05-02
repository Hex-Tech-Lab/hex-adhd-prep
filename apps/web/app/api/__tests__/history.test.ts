/**
 * @jest-environment node
 */

import { POST } from '../assessment/history/route';
import { updateAssessment } from '@/lib/supabase-server';
import { NextRequest } from 'next/server';

jest.mock('@/lib/supabase-server', () => ({
  updateAssessment: jest.fn(),
}));

describe('History API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/assessment/history', () => {
    it('should return 200 with valid body (demo mode)', async () => {
      const body = {
        assessmentId: 'test-assessment-id',
        onset: 'childhood',
        schoolPerformance: 'struggled',
        childTraits: 'inattentive',
      };

      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.note).toBe('Demo mode - data not persisted');
      expect(data.data).toEqual({
        onset: 'childhood',
        schoolPerformance: 'struggled',
        childTraits: 'inattentive',
      });
    });

    it('should return 200 with valid body (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockAssessment = { id: 'test-assessment-id' };
      (updateAssessment as jest.Mock).mockResolvedValue(mockAssessment);

      const body = {
        assessmentId: 'test-assessment-id',
        onset: 'childhood',
        schoolPerformance: 'struggled',
        childTraits: 'inattentive',
      };

      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.assessment).toEqual(mockAssessment);
      expect(updateAssessment).toHaveBeenCalledWith('test-assessment-id', expect.objectContaining({
        history_data: {
          onset: 'childhood',
          schoolPerformance: 'struggled',
          childTraits: 'inattentive',
        },
        current_section: 'impact',
      }));

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return 400 with missing assessmentId', async () => {
      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify({
          onset: 'childhood',
          schoolPerformance: 'struggled',
          childTraits: 'inattentive',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 with missing onset', async () => {
      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId: 'test-id',
          schoolPerformance: 'struggled',
          childTraits: 'inattentive',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 with missing schoolPerformance', async () => {
      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId: 'test-id',
          onset: 'childhood',
          childTraits: 'inattentive',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 with missing childTraits', async () => {
      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId: 'test-id',
          onset: 'childhood',
          schoolPerformance: 'struggled',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 400 with empty body', async () => {
      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should return 500 when updateAssessment throws (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      (updateAssessment as jest.Mock).mockRejectedValue(new Error('Database error'));

      const body = {
        assessmentId: 'test-id',
        onset: 'childhood',
        schoolPerformance: 'struggled',
        childTraits: 'inattentive',
      };

      const request = new NextRequest('http://localhost/api/assessment/history', {
        method: 'POST',
        body: JSON.stringify(body),
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
