import { addMonths, subMonths } from 'date-fns';

import { isActiveOffer } from '@blc-mono/discovery/application/utils/activeOfferRules';
import { isValidAge } from '@blc-mono/discovery/application/utils/ageRestrictionRules';
import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';

import { menuOfferFactory } from '../factories/MenuOfferFactory';

import { isValidMenuOffer } from './isValidMenuOffer';

jest.mock('@blc-mono/discovery/application/utils/trustRules');
jest.mock('@blc-mono/discovery/application/utils/ageRestrictionRules');
jest.mock('@blc-mono/discovery/application/utils/activeOfferRules');

const isValidTrustMock = jest.mocked(isValidTrust);
const isValidAgeMock = jest.mocked(isValidAge);
const isActiveOfferMock = jest.mocked(isActiveOffer);

describe('isValidOffer', () => {
  beforeEach(() => {
    isValidTrustMock.mockReturnValue(true);
    isValidAgeMock.mockReturnValue(true);
    isActiveOfferMock.mockReturnValue(true);
  });

  const menuOffer = menuOfferFactory.build();
  const dob = '2000-01-01';
  const organisation = 'NHS';

  const futureTime = addMonths(new Date(), 1).toISOString();
  const pastTime = subMonths(new Date(), 1).toISOString();

  const testCases = [
    {
      menuOffer: { ...menuOffer, start: undefined, end: undefined },
      isInSchedule: true,
    },
    {
      menuOffer: { ...menuOffer, start: undefined, end: futureTime },
      isInSchedule: true,
    },
    {
      menuOffer: { ...menuOffer, start: pastTime, end: undefined },
      isInSchedule: true,
    },
    {
      menuOffer: { ...menuOffer, start: pastTime, end: futureTime },
      isInSchedule: true,
    },
    {
      menuOffer: { ...menuOffer, start: pastTime, end: pastTime },
      isInSchedule: false,
    },
    {
      menuOffer: { ...menuOffer, start: futureTime, end: futureTime },
      isInSchedule: false,
    },
  ];

  describe.each(testCases)('isValidMenuOffer', ({ menuOffer, isInSchedule }) => {
    it('should return true if offer is active, valid for age and valid for trust', () => {
      const result = isValidMenuOffer(menuOffer, dob, organisation);
      const isValid = isInSchedule;
      expect(result).toEqual(isValid);
    });

    it('should return false if offer is not active', () => {
      isActiveOfferMock.mockReturnValue(false);

      const result = isValidMenuOffer(menuOffer, dob, organisation);

      expect(result).toEqual(false);
    });

    it('should return false if offer is not valid for age', () => {
      isValidAgeMock.mockReturnValue(false);

      const result = isValidMenuOffer(menuOffer, dob, organisation);

      expect(result).toEqual(false);
    });

    it('should return false if offer is not valid for trust', () => {
      isValidTrustMock.mockReturnValue(false);

      const result = isValidMenuOffer(menuOffer, dob, organisation);

      expect(result).toEqual(false);
    });
  });
});
