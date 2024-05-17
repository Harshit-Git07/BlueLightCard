import { z } from 'zod';
import { EndpointsKeys, IPlatformAdapter } from '../adapters';
import { RedemptionTypeSchema } from '../components/OfferSheet/types';

export async function getRedemptionDetails(platformAdapter: IPlatformAdapter, offerId: number) {
  const result = await platformAdapter.invokeV5Api(EndpointsKeys.REDEMPTION_DETAILS, {
    method: 'GET',
    queryParameters: {
      offerId: offerId.toString(),
    },
  });

  if (result.status !== 200) {
    throw new Error('Unable to retrieve redemption details');
  }

  return typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
}

export const RedeemDataSchema = z.object({
  redemptionType: RedemptionTypeSchema,
  redemptionDetails: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
  }),
});
export const RedeemResponseSchema = z.object({
  data: RedeemDataSchema,
  statusCode: z.number(),
});
export type RedeemData = z.infer<typeof RedeemDataSchema>;
export type RedeemResponse = z.infer<typeof RedeemResponseSchema>;

export async function redeemOffer(
  platformAdapter: IPlatformAdapter,
  offerId: number,
  offerName: string,
  companyName: string,
) {
  const result = await platformAdapter.invokeV5Api(EndpointsKeys.REDEEM_OFFER, {
    method: 'POST',
    body: JSON.stringify({
      offerId,
      offerName,
      companyName,
    }),
  });

  if (result.status !== 200) {
    throw new Error('Unable to redeem offer');
  }

  const resultData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
  return RedeemResponseSchema.parse(resultData);
}
