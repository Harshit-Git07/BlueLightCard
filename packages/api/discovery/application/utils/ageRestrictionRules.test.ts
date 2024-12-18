import { subYears } from 'date-fns';

import { isValidAge } from '@blc-mono/discovery/application/utils/ageRestrictionRules';

describe('isValidAge', () => {
  describe('user is under 16', () => {
    const dob = subYears(new Date(), 15).toISOString();

    it('should return true for an offer with no age restriction', () => {
      const offerAgeRestriction = 'none';

      const result = isValidAge(dob, offerAgeRestriction);

      expect(result).toBe(true);
    });

    it.each(['16+', '18+', '21+', '16+, 18+', '16+, 21+', '18+, 21+', '16+, 18+, 21+'])(
      'should return false for an offer with %s age restriction',
      (offerAgeRestriction) => {
        const result = isValidAge(dob, offerAgeRestriction);

        expect(result).toBe(false);
      },
    );
  });

  describe('user is under 18', () => {
    const dob = subYears(new Date(), 17).toISOString();

    it.each(['none', '16+', 'none, 16+'])(
      'should return true for an offer with %s age restriction',
      (offerAgeRestriction) => {
        const result = isValidAge(dob, offerAgeRestriction);

        expect(result).toBe(true);
      },
    );

    it.each(['18+', '21+', '16+, 18+', '16+, 21+', '18+, 21+', '16+, 18+, 21+'])(
      'should return false for an offer with %s age restriction',
      (offerAgeRestriction) => {
        const result = isValidAge(dob, offerAgeRestriction);

        expect(result).toBe(false);
      },
    );
  });

  describe('user is under 21', () => {
    const dob = subYears(new Date(), 19).toISOString();

    it.each(['none', '16+', '18+', 'none, 16+', 'none, 18+', 'none, 16+, 18+'])(
      'should return true for an offer with %s age restriction',
      (offerAgeRestriction) => {
        const result = isValidAge(dob, offerAgeRestriction);

        expect(result).toBe(true);
      },
    );

    it.each(['21+', '16+, 21+', '18+, 21+', '16+, 18+, 21+'])(
      'should return false for an offer with %s age restriction',
      (offerAgeRestriction) => {
        const result = isValidAge(dob, offerAgeRestriction);

        expect(result).toBe(false);
      },
    );
  });

  describe('user is over 21', () => {
    const dob = subYears(new Date(), 22).toISOString();

    it.each([
      'none',
      '16+',
      '18+',
      '21+',
      'none, 16+',
      'none, 18+',
      'none, 21+',
      '16+, 18+',
      '16+, 21+',
      '18+, 21+',
      'none, 16+, 18+',
      'none, 16+, 21+',
      'none, 18+, 21+',
      '16+, 18+, 21+',
      'none, 16+, 18+, 21+',
    ])('should return true for an offer with %s age restriction', (offerAgeRestriction) => {
      const result = isValidAge(dob, offerAgeRestriction);

      expect(result).toBe(true);
    });
  });
});
