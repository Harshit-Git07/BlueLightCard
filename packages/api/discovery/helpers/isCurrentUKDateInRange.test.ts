import { isCurrentUKDateInRange } from './isCurrentUKDateInRange';

describe('isCurrentUKDateInRange', () => {
  describe('UK Summer Time', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-06-06T01:30:00')); // UK Time of 1:30am
    });
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return true if the UK date is within the range', () => {
      expect(isCurrentUKDateInRange('2024-06-06', '2024-06-08')).toBe(true);
    });

    it('should return false if the current date is outside the range', () => {
      expect(isCurrentUKDateInRange('2024-06-01', '2024-06-06')).toBe(false);
    });
  });

  describe('UK Winter Time', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-11-06T00:30:00')); // UK Time of 12:30am
    });
    afterEach(() => {
      jest.useRealTimers();
    });
    it('should return true if the UK date is within the range', () => {
      expect(isCurrentUKDateInRange('2024-11-06', '2024-11-08')).toBe(true);
    });

    it('should return false if the current date is outside the range', () => {
      expect(isCurrentUKDateInRange('2024-11-01', '2024-11-06')).toBe(false);
    });
  });
});
