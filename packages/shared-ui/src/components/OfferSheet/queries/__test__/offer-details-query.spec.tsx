import { offerDetailsQuery } from '../offer-details-query';
import { usePlatformAdapter } from '../../../../adapters';
import { useSharedUIConfig } from '../../../../providers';
import { getMockPlatformAdapter } from '../../__mocks__/platformAdapter';
import { MockSharedUiConfig } from 'src/test';

jest.mock('../../../../adapters');
jest.mock('../../../../providers');

describe('offerDetailsQuery', () => {
  beforeEach(() => {
    (usePlatformAdapter as jest.Mock).mockReturnValue(getMockPlatformAdapter('vault'));
    (useSharedUIConfig as jest.Mock).mockReturnValue(MockSharedUiConfig);
  });

  it('should return query options with correct queryKey', () => {
    const offerId = 123;
    const result = offerDetailsQuery(offerId);
    expect(result.queryKey).toEqual(['offer-details', offerId]);
  });
});
