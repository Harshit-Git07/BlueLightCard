import {
  LEGACY_MICROSERVICE_BRAND,
  RETRIEVE_FAVOURITE_ENDPOINT,
  UPDATE_FAVOURITE_ENDPOINT,
} from '@/global-vars';
import axios from 'axios';
import { unpackJWT } from '@core/utils/unpackJWT';
import { OfferData } from '@/types/api/offers';

export async function retrieveFavourites(companyId?: string) {
  const idToken = localStorage.getItem('idToken');

  if (idToken && companyId) {
    let { 'custom:blc_old_id': userId } = unpackJWT(idToken);
    userId = userId ?? null;
    const data = {
      userId: parseInt(userId, 10),
      brand: LEGACY_MICROSERVICE_BRAND,
    };
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: RETRIEVE_FAVOURITE_ENDPOINT,
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      data: data,
    };

    let favouriteCompanies: number[];
    try {
      const favouriteResponse = await axios(config);
      favouriteCompanies = favouriteResponse.data.data;
      return companyId && favouriteCompanies.includes(parseInt(companyId, 10));
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

export async function UpdateFavourites(
  offerMeta: OfferData,
  idToken: string,
  userId?: string
): Promise<boolean> {
  const data = {
    companyId: offerMeta.companyId,
    brand: LEGACY_MICROSERVICE_BRAND,
    userId: userId,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: UPDATE_FAVOURITE_ENDPOINT,
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    data: data,
  };

  try {
    await axios(config);
    return true;
  } catch (e) {
    return false;
  }
}
