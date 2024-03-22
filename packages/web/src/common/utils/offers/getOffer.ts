import { RETRIEVE_OFFER_ENDPOINT } from '@/global-vars';
import { Logger } from '@/services/Logger';
import { OfferData, OfferResponseSchema } from '@/types/api/offers';
import axios from 'axios';

export const getOfferById = async (idToken: string, offerId: string): Promise<OfferData> => {
  const offerDataRes = await axios({
    method: 'get',
    maxBodyLength: Infinity,
    url: `${RETRIEVE_OFFER_ENDPOINT}${offerId}`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  try {
    return OfferResponseSchema.parse(offerDataRes.data).data;
  } catch (error) {
    Logger.instance.error('Error parsing offer data', { error });
    throw error;
  }
};
