import { hashPassword, verifyPassword, validateEmail, generateSessionToken } from '../auth';

describe('Auth utilities', () => {
  describe('hashPassword and verifyPassword', () => {
    it('should hash password and verify correctly', () => {
      const password = 'test-password-123';
      const hash = hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).toContain(':');
      expect(verifyPassword(password, hash)).toBe(true);
    });

    it('should reject incorrect password', () => {
      const password = 'correct-password';
      const wrongPassword = 'wrong-password';
      const hash = hashPassword(password);

      expect(verifyPassword(wrongPassword, hash)).toBe(false);
    });

    it('should produce different hashes for same password', () => {
      const password = 'same-password';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      expect(hash1).not.toBe(hash2);
      expect(verifyPassword(password, hash1)).toBe(true);
      expect(verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.user@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });
  });

  describe('generateSessionToken', () => {
    it('should generate valid session tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1.length).toBe(64);
      expect(token2.length).toBe(64);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      const token3 = generateSessionToken();

      expect(token1).not.toBe(token2);
      expect(token2).not.toBe(token3);
      expect(token1).not.toBe(token3);
    });
  });
});
