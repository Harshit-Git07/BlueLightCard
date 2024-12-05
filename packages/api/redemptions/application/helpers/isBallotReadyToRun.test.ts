import { describe, expect } from '@jest/globals';
import { set, sub } from 'date-fns';

import { isBallotReadyToRun } from './isBallotReadyToRun';

describe('isBallotReadyToRun', () => {
  const date = new Date();
  const drawDate = date;

  it('should return false when ballot date is today and after 10pm', () => {
    const currentDate = set(date, { hours: 22, minutes: 0, seconds: 0 });
    const isExpired = isBallotReadyToRun(drawDate, currentDate);
    expect(isExpired).toBe(true);
  });

  it('should return true when ballot date is today and before 10pm', () => {
    const currentDate = set(date, { hours: 21, minutes: 59, seconds: 59 });
    const isExpired = isBallotReadyToRun(drawDate, currentDate);
    expect(isExpired).toBe(false);
  });

  it('should return true when ballot date is not today and after 10pm', () => {
    const currentDate = sub(set(date, { hours: 22, minutes: 1, seconds: 0 }), { days: 1 });
    const isExpired = isBallotReadyToRun(drawDate, currentDate);
    expect(isExpired).toBe(false);
  });
});
