import { calculateASRSScore, calculateRiskLevel, validateASRSResponses } from '../asrs';

describe('ASRS utilities', () => {
  describe('calculateASRSScore', () => {
    it('should calculate scores with valid 6-element array', () => {
      const responses = [2, 3, 1, 2, 3, 4];
      const result = calculateASRSScore(responses);

      expect(result.inattention).toBe(2);
      expect(result.hyperactivity).toBe(3.5);
      expect(result.overall).toBe(2.75);
    });

    it('should calculate scores for all zeros', () => {
      const responses = [0, 0, 0, 0, 0, 0];
      const result = calculateASRSScore(responses);

      expect(result.inattention).toBe(0);
      expect(result.hyperactivity).toBe(0);
      expect(result.overall).toBe(0);
    });

    it('should calculate scores for all max values', () => {
      const responses = [4, 4, 4, 4, 4, 4];
      const result = calculateASRSScore(responses);

      expect(result.inattention).toBe(4);
      expect(result.hyperactivity).toBe(4);
      expect(result.overall).toBe(4);
    });

    it('should throw error for non-array input', () => {
      expect(() => calculateASRSScore(null as any)).toThrow('6 responses required');
      expect(() => calculateASRSScore(undefined as any)).toThrow('6 responses required');
      expect(() => calculateASRSScore('not an array' as any)).toThrow('6 responses required');
      expect(() => calculateASRSScore(123 as any)).toThrow('6 responses required');
    });

    it('should throw error for wrong number of responses', () => {
      expect(() => calculateASRSScore([1, 2, 3])).toThrow('6 responses required');
      expect(() => calculateASRSScore([1, 2, 3, 4, 5, 6, 7])).toThrow('6 responses required');
      expect(() => calculateASRSScore([])).toThrow('6 responses required');
    });

    it('should throw error for values outside 0-4 range', () => {
      expect(() => calculateASRSScore([-1, 0, 0, 0, 0, 0])).toThrow('Responses must be numbers 0-4');
      expect(() => calculateASRSScore([0, 0, 0, 0, 0, 5])).toThrow('Responses must be numbers 0-4');
      expect(() => calculateASRSScore([0, 0, 0, 0, 0, 10])).toThrow('Responses must be numbers 0-4');
    });

    it('should throw error for non-number values', () => {
      expect(() => calculateASRSScore(['1', 2, 3, 4, 0, 0] as any)).toThrow('Responses must be numbers 0-4');
      expect(() => calculateASRSScore([null, 0, 0, 0, 0, 0] as any)).toThrow('Responses must be numbers 0-4');
      expect(() => calculateASRSScore([undefined, 0, 0, 0, 0, 0] as any)).toThrow('Responses must be numbers 0-4');
    });
  });

  describe('calculateRiskLevel', () => {
    it('should return low for score < 1.5', () => {
      expect(calculateRiskLevel(0)).toBe('low');
      expect(calculateRiskLevel(0.5)).toBe('low');
      expect(calculateRiskLevel(1)).toBe('low');
      expect(calculateRiskLevel(1.49)).toBe('low');
    });

    it('should return moderate for score 1.5 to < 2.5', () => {
      expect(calculateRiskLevel(1.5)).toBe('moderate');
      expect(calculateRiskLevel(2)).toBe('moderate');
      expect(calculateRiskLevel(2.49)).toBe('moderate');
    });

    it('should return high for score >= 2.5', () => {
      expect(calculateRiskLevel(2.5)).toBe('high');
      expect(calculateRiskLevel(3)).toBe('high');
      expect(calculateRiskLevel(4)).toBe('high');
    });
  });

  describe('validateASRSResponses', () => {
    it('should return true for valid 6-element array with values 0-4', () => {
      expect(validateASRSResponses([0, 1, 2, 3, 4, 0])).toBe(true);
      expect(validateASRSResponses([0, 0, 0, 0, 0, 0])).toBe(true);
      expect(validateASRSResponses([4, 4, 4, 4, 4, 4])).toBe(true);
    });

    it('should return false for non-array input', () => {
      expect(validateASRSResponses(null as any)).toBe(false);
      expect(validateASRSResponses(undefined as any)).toBe(false);
      expect(validateASRSResponses('string' as any)).toBe(false);
      expect(validateASRSResponses(123 as any)).toBe(false);
    });

    it('should return false for wrong number of responses', () => {
      expect(validateASRSResponses([1, 2, 3])).toBe(false);
      expect(validateASRSResponses([1, 2, 3, 4, 5, 6, 7])).toBe(false);
      expect(validateASRSResponses([])).toBe(false);
    });

    it('should return false for values outside 0-4', () => {
      expect(validateASRSResponses([-1, 0, 0, 0, 0, 0])).toBe(false);
      expect(validateASRSResponses([0, 0, 0, 0, 0, 5])).toBe(false);
    });

    it('should return false for non-number values', () => {
      expect(validateASRSResponses(['1', 2, 3, 4, 0, 0] as any)).toBe(false);
      expect(validateASRSResponses([null, 0, 0, 0, 0, 0] as any)).toBe(false);
    });
  });
});
