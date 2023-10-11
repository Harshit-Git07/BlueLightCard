import { describe, expect } from '@jest/globals';
import { setDate } from './setDate';

describe('Response', () => {
  it('should return 0000000000000000', () => {
    const response = setDate('');
    expect(response).toBe('0000000000000000');
  });

  it('should return 0000000000000000', () => {
    const response = setDate('                 ');
    expect(response).toBe('0000000000000000');
  });

  it('should return 0000000000000000', () => {
    const response = setDate(null);
    expect(response).toBe('0000000000000000');
  });

  it('should return 0000000000000000', () => {
    const response = setDate(undefined);
    expect(response).toBe('0000000000000000');
  });

  it('should return 0000000000000000', () => {
    const response = setDate('0000-00-00');
    expect(response).toBe('0000000000000000');
  });

  it('should return 0000000000000000', () => {
    const response = setDate('02 July -1900');
    expect(response).toBe('0000000000000000');
  });

    it('should return 0000000000000000', () => {
        const response = setDate('0000-00-00 00:00:00');
        expect(response).toBe('0000000000000000');
    });

    it('should return date in timestamp', () => {
        const response = setDate('2022-12-12 23:59:59');
        expect(response).toBe(String(new Date('2022-12-12 23:59:59'.toString()).getTime()));
    });

    it('should return date in timestamp', () => {
        const response = setDate('2027-1-1');
        expect(response).toBe(String(new Date('2027-1-1'.toString()).getTime()));
    });

    it('should return date in timestamp', () => {
        const response = setDate('8 Oct 2023');
        expect(response).toBe(String(new Date('8 oct 2023'.toString()).getTime()));
    });
});
