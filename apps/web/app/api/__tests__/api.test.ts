import { apiPost, apiGet } from '@/lib/api';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('API wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('apiPost', () => {
    it('should send POST request with correct parameters', async () => {
      const mockResponse = { success: true, data: { id: '123' } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await apiPost('/test', { name: 'test' });

      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'test' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed response with error message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Invalid input' }),
      } as Response);

      await expect(apiPost('/test', { name: 'test' })).rejects.toThrow('Invalid input');
    });

    it('should throw error with fallback message when JSON parse fails on error response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Parse error')),
      } as Response);

      await expect(apiPost('/test', {})).rejects.toThrow('Request failed');
    });

    it('should return parsed JSON on success', async () => {
      const data = { score: 3.5, riskLevel: 'high' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      } as Response);

      const result = await apiPost('/assessment/asrs', { assessmentId: 'test', responses: [1, 2, 3, 4, 0, 0] });

      expect(result).toEqual(data);
    });
  });

  describe('apiGet', () => {
    it('should send GET request with correct URL', async () => {
      const mockResponse = { health: 'ok' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await apiGet('/health');

      expect(mockFetch).toHaveBeenCalledWith('/api/health');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on failed response', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      await expect(apiGet('/nonexistent')).rejects.toThrow('HTTP 404');
    });

    it('should return parsed JSON on success', async () => {
      const data = { assessmentId: 'test', status: 'in_progress' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      } as Response);

      const result = await apiGet('/assessment/status?assessmentId=test');

      expect(result).toEqual(data);
    });
  });
});
