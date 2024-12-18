import { offerFactory } from '@blc-mono/discovery/application/factories/OfferFactory';
import { isActiveOffer } from '@blc-mono/discovery/application/utils/activeOfferRules';
import { isValidAge } from '@blc-mono/discovery/application/utils/ageRestrictionRules';
import { isValidTrust } from '@blc-mono/discovery/application/utils/trustRules';

import { isValidOffer } from './isValidOffer';

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

  const offer = offerFactory.build();
  const dob = '2000-01-01';
  const organisation = 'NHS';

  it('should return true if offer is active, valid for age and valid for trust', () => {
    const result = isValidOffer(offer, dob, organisation);

    expect(result).toEqual(true);
  });

  it('should return false if offer is not active', () => {
    isActiveOfferMock.mockReturnValue(false);

    const result = isValidOffer(offer, dob, organisation);

    expect(result).toEqual(false);
  });

  it('should return false if offer is not valid for age', () => {
    isValidAgeMock.mockReturnValue(false);

    const result = isValidOffer(offer, dob, organisation);

    expect(result).toEqual(false);
  });

  it('should return false if offer is not valid for trust', () => {
    isValidTrustMock.mockReturnValue(false);

    const result = isValidOffer(offer, dob, organisation);

    expect(result).toEqual(false);
  });
});
