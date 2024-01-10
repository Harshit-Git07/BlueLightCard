import { BRAND, SEARCH_ENDPOINT } from '@/global-vars';
import { getSiteIdFromBrandId } from '../getSiteIdFromBrandId';

const he = require('he');

export type SearchOfferType = {
  ID: number;
  OfferName: string;
  offerimg: string;
  CompID: number;
  CompanyName: string;
  OfferType: number;
};

export type SearchResultsType = {
  error?: string;
  results?: SearchOfferType[];
};

/**
 * Makes a search request to the Search API
 * @param queryRaw The raw query string for the search
 * @param idToken The id token for the user for authentication
 * @param allowAgeGated Whether or not the search should allow age gated content
 * @returns SearchResultsType object with either an error or results
 */
export async function makeSearch(queryRaw: string, idToken: string, allowAgeGated: boolean = true) {
  const axios = require('axios');
  let data = {
    searchTerm: he.escape(queryRaw),
    siteId: getSiteIdFromBrandId(BRAND),
    allowAgeGated,
  };

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: SEARCH_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    data: data,
  };

  let output: SearchResultsType = {};

  try {
    const response = await axios.request(config);
    output.results = response.data.data as SearchOfferType[];
  } catch (error: any) {
    output.error = error.message;
  }

  return output;
}
