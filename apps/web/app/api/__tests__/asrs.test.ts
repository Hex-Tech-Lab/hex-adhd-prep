/**
 * @jest-environment node
 */

import { POST } from '../assessment/asrs/route';
import { updateAssessment } from '@/lib/supabase-server';
import { NextRequest } from 'next/server';

jest.mock('@/lib/supabase-server', () => ({
  updateAssessment: jest.fn(),
}));

describe('ASRS API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/assessment/asrs', () => {
    it('should return 200 with valid body (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      const mockAssessment = { id: 'test-assessment-id' };
      (updateAssessment as jest.Mock).mockResolvedValue(mockAssessment);

      const body = {
        assessmentId: 'test-assessment-id',
        responses: [2, 3, 1, 2, 3, 4],
      };

      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.inattentionScore).toBe(2);
      expect(data.hyperactivityScore).toBe(3.5);
      expect(data.overallScore).toBe(2.75);
      expect(data.riskLevel).toBe('high');
      expect(updateAssessment).toHaveBeenCalledWith('test-assessment-id', expect.objectContaining({
        asrs_part_a_score: 2,
        asrs_part_b_score: 3.5,
        asrs_total_score: 2.75,
        asrs_risk_level: 'high',
      }));

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });

    it('should return 400 with missing fields', async () => {
      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify({ assessmentId: 'test-id' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid request');
    });

    it('should return 400 with empty body', async () => {
      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid request');
    });

    it('should return 400 with wrong number of responses', async () => {
      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId: 'test-id',
          responses: [1, 2, 3],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid request');
    });

    it('should calculate scoring correctly for low risk', async () => {
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const body = {
        assessmentId: 'test-id',
        responses: [0, 0, 0, 0, 0, 0],
      };

      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.overallScore).toBe(0);
      expect(data.riskLevel).toBe('low');
    });

    it('should calculate scoring correctly for moderate risk', async () => {
      (updateAssessment as jest.Mock).mockResolvedValue({ id: 'test-id' });

      const body = {
        assessmentId: 'test-id',
        responses: [1, 2, 2, 1, 2, 2],
      };

      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.inattentionScore).toBe(1.5);
      expect(data.hyperactivityScore).toBe(2);
      expect(data.overallScore).toBe(1.75);
      expect(data.riskLevel).toBe('moderate');
    });

    it('should return 500 when updateAssessment throws (with Supabase)', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'test-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

      (updateAssessment as jest.Mock).mockRejectedValue(new Error('Database error'));

      const body = {
        assessmentId: 'test-id',
        responses: [1, 2, 3, 4, 0, 0],
      };

      const request = new NextRequest('http://localhost/api/assessment/asrs', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');

      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    });
  });
});
