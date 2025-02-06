import { getRevalidationValue } from '../utils';

describe('Utils', () => {
  describe('getRevalidationValue', () => {
    it('should return number value', () => {
      process.env.NEXT_PUBLIC_REVALIDATE = '0';
      const value = getRevalidationValue();
      expect(value).toBe(0);
    });

    it('should return false if value is not a number', () => {
      process.env.NEXT_PUBLIC_REVALIDATE = 'not a number';
      const value = getRevalidationValue();
      expect(value).toBe(false);
    });
  });
});
