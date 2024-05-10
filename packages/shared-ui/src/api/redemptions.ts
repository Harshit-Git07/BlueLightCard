import { z } from 'zod';
import { IPlatformAdapter } from '../adapters';
import { RedemptionTypeSchema } from '../components/OfferSheet/types';

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
  const result = await platformAdapter.invokeV5Api('/eu/redemptions/member/redeem', {
    method: 'POST',
    body: JSON.stringify({
      offerId,
      offerName,
      companyName,
    }),
  });

  if (result.statusCode !== 200) {
    throw new Error('Unable to redeem offer');
  }

  return RedeemResponseSchema.parse(JSON.parse(result.body));
}
