import { IPlatformAdapter } from '../adapters';
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
  offerId: number | string,
): Promise<OfferData> {
  const result = await platformAdapter.invokeV5Api(`/eu/offers/offers/${offerId.toString()}`, {
    method: 'GET',
  });

  if (result.status !== 200) {
    throw new Error('Unable to retrieve offer details');
  }

  const resultData = JSON.parse(result.data);
  return OfferDataSchema.parse(resultData.data);
}
