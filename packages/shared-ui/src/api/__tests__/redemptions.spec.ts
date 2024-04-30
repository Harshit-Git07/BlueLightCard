import { getRedemptionDetails } from '../redemptions';
import { useMockPlatformAdapter } from '../../adapters';

test('getRedemptionDetails calls the redemption details endpoint', async () => {
  const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

  const result = await getRedemptionDetails(mockPlatformAdapter, 123);

  expect(result).toEqual({ data: { redemptionType: 'vault' } });
  expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(
    '/eu/redemptions/member/redemptionDetails',
    { method: 'GET', queryParameters: { offerId: '123' } },
  );
});

test('getRedemptionDetails throws an error if the redemption details endpoint does not return a 200', async () => {
  const mockPlatformAdapter = useMockPlatformAdapter(500);

  const result = getRedemptionDetails(mockPlatformAdapter, 123);

  expect(result).rejects.toThrow('Unable to retrieve redemption details');
});
