import { SearchOfferType } from '../experimentMakeSearch';
import { experimentMakeSearch } from '@/utils/API/experimentMakeSearch';
import { IPlatformAdapter, useMockPlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { PlatformVariant } from '@bluelightcard/shared-ui/types';
import { V5_API_URL } from '@/globals/apiUrl';

describe('Experiment make search', () => {
  let mockPlatformAdapter: IPlatformAdapter;

  const searchResults: SearchOfferType[] = [
    {
      ID: 'abcd-1234-defg-5678',
      LegacyID: 1,
      OfferName: 'offer',
      offerimg: 'img',
      CompID: 'abcd-5678-defg-1234',
      LegacyCompanyID: 1,
      CompanyName: 'company',
      OfferType: 1,
    },
  ];
  const searchResultsLegacy: SearchOfferType[] = [
    {
      ID: 1,
      LegacyID: 1,
      OfferName: 'offer',
      offerimg: 'img',
      CompID: 1,
      LegacyCompanyID: 1,
      CompanyName: 'company',
      OfferType: 1,
    },
  ];

  const searchApiResponse = { data: searchResults };

  beforeEach(() => {
    mockPlatformAdapter = useMockPlatformAdapter(200, searchApiResponse, PlatformVariant.Web);
  });

  it('should invoke V5 API with correct parameters', async () => {
    const result = await experimentMakeSearch(
      'apple',
      '1990-01-01',
      'service',
      mockPlatformAdapter,
      false
    );

    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Search, {
      method: 'GET',
      queryParameters: {
        query: 'apple',
        dob: '1990-01-01',
        organisation: 'service',
      },
    });
    expect(result).toEqual({
      results: searchResults,
    });
  });

  it('should invoke map legacy IDs to IDs when "useLegacyId" is true', async () => {
    const result = await experimentMakeSearch(
      'apple',
      '1990-01-01',
      'service',
      mockPlatformAdapter,
      true
    );

    expect(result).toEqual({
      results: searchResultsLegacy,
    });
  });
});
