import { z } from 'zod';
import { passwordRules, passwordSchema } from './';

describe('Password Schema', () => {
  describe('passwordRules', () => {
    it('should have the correct messages', () => {
      const messages = passwordRules.map((rule) => rule.label);
      expect(messages).toEqual([
        'One uppercase character',
        'One lowercase character',
        'One special character from ~ # @ $ % & ! * _ ? ^ -',
        'One number',
        'Ten characters minimum',
        'No more than two repeated characters in a row',
      ]);
    });
  });

  describe('passwordSchema', () => {
    it('should validate a password meeting all criteria', () => {
      const validPassword = 'StrongP@ss1';
      const result = passwordSchema.safeParse(validPassword);
      expect(result.success).toBe(true);
    });

    it('should reject a password missing uppercase', () => {
      const invalidPassword = 'weakp@ssword1';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('One uppercase character');
      }
    });

    it('should reject a password missing lowercase', () => {
      const invalidPassword = 'STRONGP@SSWORD1';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('One lowercase character');
      }
    });

    it('should reject a password missing special character', () => {
      const invalidPassword = 'StrongPassword1';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'One special character from ~ # @ $ % & ! * _ ? ^ -',
        );
      }
    });

    it('should reject a password with invalid special character', () => {
      const invalidPassword = 'StrongPassword1+';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'One special character from ~ # @ $ % & ! * _ ? ^ -',
        );
      }
    });

    it('should reject a password missing number', () => {
      const invalidPassword = 'StrongP@ssword';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('One number');
      }
    });

    it('should reject a password shorter than 10 characters', () => {
      const invalidPassword = 'Short@1';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Ten characters minimum');
      }
    });

    it('should reject a password with more than two repeated characters', () => {
      const invalidPassword = 'StrongP@sss1';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe(
          'No more than two repeated characters in a row',
        );
      }
    });

    it('should reject a password failing multiple criteria', () => {
      const invalidPassword = 'weeeak';
      const result = passwordSchema.safeParse(invalidPassword);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors).toHaveLength(5); // All criteria except lowercase
      }
    });
  });

  describe('buildPasswordSchema', () => {
    it('should build a schema that validates all rules', () => {
      const validPassword = 'StrongP@ss1';
      const invalidPasswords = [
        'weakp@ssword1',
        'STRONGP@SSWORD1',
        'StrongPassword1',
        'StrongP@ssword',
        'Short@1',
        'StrongP@sss1',
      ];

      expect(passwordSchema.safeParse(validPassword).success).toBe(true);

      invalidPasswords.forEach((password) => {
        expect(passwordSchema.safeParse(password).success).toBe(false);
      });
    });
  });
});
