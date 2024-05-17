import { IPlatformAdapter, EndpointsKeys } from '../adapters';
import { z } from 'zod';

export const OfferDataSchema = z.object({
  id: z.number(),
  companyId: z.number(),
  companyLogo: z.string(),
  description: z.string(),
  expiry: z.string(),
  name: z.string(),
  terms: z.string(),
  type: z.string(),
});
export type OfferData = z.infer<typeof OfferDataSchema>;

export async function getOffer(
  platformAdapter: IPlatformAdapter,
  offerId: number,
): Promise<OfferData> {
  const result = await platformAdapter.invokeV5Api(EndpointsKeys.OFFER_DETAILS, {
    method: 'GET',
    pathParameter: offerId.toString(),
  });

  if (result.status !== 200) {
    throw new Error('Unable to retrieve offer details');
  }

  const resultData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
  return OfferDataSchema.parse(resultData.data);
}
