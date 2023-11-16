import inTimePeriod from '../inTimePeriod';

describe('inTimePeriod', () => {
  test('is true when a start date is in the past', () => {
    const timeLockSettings = {
      startTime: '1900-11-24T01:00:00',
    };

    expect(inTimePeriod(timeLockSettings)).toBe(true);
  });

  test('is true when an end date is in the future', () => {
    const timeLockSettings = {
      endTime: '3000-11-24T01:00:00',
    };

    expect(inTimePeriod(timeLockSettings)).toBe(true);
  });

  test('is true when a start date is in the past and end date is in the future', () => {
    const timeLockSettings = {
      startTime: '1900-11-24T01:00:00',
      endTime: '3000-11-24T01:00:00',
    };

    expect(inTimePeriod(timeLockSettings)).toBe(true);
  });

  test('is false when a start date is in the future', () => {
    const timeLockSettings = {
      startTime: '3000-11-24T01:00:00',
    };

    expect(inTimePeriod(timeLockSettings)).toBe(false);
  });

  test('is false when an end date is in the past', () => {
    const timeLockSettings = {
      endTime: '1900-11-24T01:00:00',
    };

    expect(inTimePeriod(timeLockSettings)).toBe(false);
  });
});
