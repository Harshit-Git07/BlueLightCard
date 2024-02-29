import { RETRIEVE_OFFER_ENDPOINT } from '@/global-vars';
import { offerResponse } from '@/context/OfferSheet/OfferSheetContext';
import axios from 'axios';

export const getOfferById = async (idToken: string, offerId?: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${RETRIEVE_OFFER_ENDPOINT}${offerId}`,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  };
  let offerDataResponse: offerResponse;
  try {
    const offerDataRes = await axios(config);
    offerDataResponse = offerDataRes.data.data;
    return offerDataResponse;
  } catch (e) {
    return null;
  }
};
