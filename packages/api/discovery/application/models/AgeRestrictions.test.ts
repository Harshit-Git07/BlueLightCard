import { getAgeRestrictions } from '@blc-mono/discovery/application/models/AgeRestrictions';

describe('AgeRestrictions', () => {
  beforeEach(() => {
    const DateReal = global.Date;
    const mockDate = new Date('2021-11-01T00:00:00.000Z');

    jest.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length) {
        return new DateReal(...args);
      }
      return mockDate;
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return age restrictions for 21 year old', function () {
    const result = getAgeRestrictions('2000-01-01');

    expect(result).toEqual(['none', '16+', '18+', '21+']);
  });

  it('should return age restrictions for 20 year old', function () {
    const result = getAgeRestrictions('2000-11-02');

    expect(result).toEqual(['none', '16+', '18+']);
  });

  it('should return age restrictions for 16 year old', function () {
    const result = getAgeRestrictions('2004-01-01');

    expect(result).toEqual(['none', '16+']);
  });

  it('should return age restrictions for 15 year old', function () {
    const result = getAgeRestrictions('2006-01-01');

    expect(result).toEqual(['none']);
  });
});
