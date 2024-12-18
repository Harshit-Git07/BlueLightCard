import { formatDateDDMMYYYY, formatDateDMMMYYYY, formatDateDDMMMYYYY_12HourTime } from './dates';

describe('Date formatting utilities', () => {
  describe('formatDateDDMMYYYY', () => {
    it('should return null when no date is provided', () => {
      expect(formatDateDDMMYYYY('')).toBeNull();
    });

    it('should format date in DD/MM/YYYY format', () => {
      expect(formatDateDDMMYYYY('2023-12-25')).toBe('25/12/2023');
    });
  });

  describe('formatDateDMMMYYYY', () => {
    it('should return null when no date is provided', () => {
      expect(formatDateDMMMYYYY('')).toBeNull();
    });

    it('should format date in D MMM YYYY format', () => {
      expect(formatDateDMMMYYYY('2023-12-25')).toBe('25 Dec 2023');
    });
  });

  describe('formatDateDDMMMYYYY_12HourTime', () => {
    it('should return null when no date is provided', () => {
      expect(formatDateDDMMMYYYY_12HourTime('')).toBeNull();
    });

    it('should format date and time in DD MMM YYYY - hh:mm A format', () => {
      expect(formatDateDDMMMYYYY_12HourTime('2023-12-25T15:30:00')).toBe('25 Dec 2023 - 03:30 PM');
    });
  });
});
