import { IPlatformAdapter } from '../adapters';

export async function getRedemptionDetails(platformAdapter: IPlatformAdapter, offerId: number) {
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redemptionDetails', {
    method: 'GET',
    queryParameters: {
      offerId: offerId.toString(),
    },
  });

  if (result.statusCode !== 200) {
    throw new Error('Unable to retrieve redemption details');
  }

  return JSON.parse(result.body);
}
