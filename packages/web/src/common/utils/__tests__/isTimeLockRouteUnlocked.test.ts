import isTimeLockRouteUnlocked from '../isTimeLockRouteUnlocked';

describe('isTimeLockRouteUnlocked', () => {
  test('is true when a start date is in the past', () => {
    const myLink = {
      text: 'My Link',
      link: '/my-link',
      startTime: '1900-11-24T01:00:00',
    };

    expect(isTimeLockRouteUnlocked(myLink)).toBe(true);
  });

  test('is true when an end date is in the future', () => {
    const myLink = {
      text: 'My Link',
      link: '/my-link',
      endTime: '3000-11-24T01:00:00',
    };

    expect(isTimeLockRouteUnlocked(myLink)).toBe(true);
  });

  test('is true when a start date is in the past and end date is in the future', () => {
    const myLink = {
      text: 'My Link',
      link: '/my-link',
      startTime: '1900-11-24T01:00:00',
      endTime: '3000-11-24T01:00:00',
    };

    expect(isTimeLockRouteUnlocked(myLink)).toBe(true);
  });

  test('is false when a start date is in the future', () => {
    const myLink = {
      text: 'My Link',
      link: '/my-link',
      startTime: '3000-11-24T01:00:00',
    };

    expect(isTimeLockRouteUnlocked(myLink)).toBe(false);
  });

  test('is false when an end date is in the past', () => {
    const myLink = {
      text: 'My Link',
      link: '/my-link',
      endTime: '1900-11-24T01:00:00',
    };

    expect(isTimeLockRouteUnlocked(myLink)).toBe(false);
  });
});
