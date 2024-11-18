import { OFFERS_API_GATEWAY_ENDPOINT } from '@/root/global-vars';
import axios from 'axios';

export const getCompany = async (idToken: string, companyId: any) => {
  const config = {
    method: 'get',
    url: `${OFFERS_API_GATEWAY_ENDPOINT}/company/${companyId}`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Access-Control-Allow-Origin': '*',
    },
  };
  try {
    const result = await axios.request(config);
    return result.data.data;
  } catch (e) {
    return null;
  }
};

export const getOffersByCompany = async (idToken: string, companyId: any) => {
  const config = {
    method: 'get',
    url: `${OFFERS_API_GATEWAY_ENDPOINT}/company/${companyId}/offers`,
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Access-Control-Allow-Origin': '*',
    },
  };
  try {
    const result = await axios.request(config);
    return result.data.data;
  } catch (e) {
    return null;
  }
};
