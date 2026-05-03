/**
 * Input validation and sanitization utilities
 */

export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Remove HTML tags, trim whitespace
  return input
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, 5000); // Max 5000 characters
}

export function validateAndSanitizeEmail(email: unknown): string {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }

  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    throw new Error('Invalid email format');
  }

  return trimmed;
}

export function validateAndSanitizePassword(password: unknown): string {
  if (typeof password !== 'string') {
    throw new Error('Password must be a string');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  if (password.length > 128) {
    throw new Error('Password is too long');
  }

  return password;
}

export function validateAge(age: unknown): number {
  if (typeof age !== 'number') {
    throw new Error('Age must be a number');
  }

  if (age < 18 || age > 120) {
    throw new Error('Age must be between 18 and 120');
  }

  return age;
}

export function validateAssessmentId(id: unknown): string {
  if (typeof id !== 'string' || !id.match(/^[a-f0-9-]{36}$/i)) {
    throw new Error('Invalid assessment ID');
  }

  return id;
}

export function validateTextArea(text: unknown, maxLength: number = 5000): string {
  const sanitized = sanitizeText(text);

  if (sanitized.length === 0) {
    throw new Error('This field is required');
  }

  if (sanitized.length > maxLength) {
    throw new Error(`Text exceeds maximum length of ${maxLength} characters`);
  }

  return sanitized;
}

export function validateArray<T>(
  arr: unknown,
  validator: (item: unknown) => T,
  options: { minLength?: number; maxLength?: number } = {}
): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }

  const { minLength = 0, maxLength = 100 } = options;

  if (arr.length < minLength) {
    throw new Error(`Array must have at least ${minLength} items`);
  }

  if (arr.length > maxLength) {
    throw new Error(`Array exceeds maximum length of ${maxLength}`);
  }

  return arr.map((item, index) => {
    try {
      return validator(item);
    } catch (err) {
      throw new Error(`Item at index ${index}: ${err instanceof Error ? err.message : 'Invalid item'}`);
    }
  });
}
