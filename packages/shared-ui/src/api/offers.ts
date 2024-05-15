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
  offerId: number,
): Promise<OfferData> {
  const result = await platformAdapter.invokeV5Api(`/eu/offers/offers/${offerId}`, {
    method: 'GET',
  });

  if (result.statusCode !== 200) {
    throw new Error('Unable to retrieve offer details');
  }

  return OfferDataSchema.parse(JSON.parse(result.body).data);
}
