import { getOffer } from '../offers';
import { useMockPlatformAdapter } from 'src/adapters';

describe('getOffer', () => {
  test('getOffer calls the offer endpoint', async () => {
    const mockOffer = {
      id: 100,
      companyId: 101,
      companyLogo: 'test-company-logo.png',
      description: 'A test offer',
      expiry: '2024-01-01',
      name: 'Test Offer',
      terms: 'Some terms and conditions',
      type: 'a-type',
    };
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: mockOffer });

    const result = await getOffer(mockPlatformAdapter, 123);

    expect(result).toEqual(mockOffer);
    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/eu/offers/offers/123', {
      method: 'GET',
    });
  });

  test('getOffer throws an error if the API request fails', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);

    const result = getOffer(mockPlatformAdapter, 123);

    expect(result).rejects.toThrow('Unable to retrieve offer details');
  });
});
