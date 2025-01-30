import axios from 'axios';
import { BRAND, SEARCH_ENDPOINT } from '@/global-vars';
import { getSiteIdFromBrandId } from '../getSiteIdFromBrandId';

const he = require('he');

export type SearchOfferType = {
  ID: number | string;
  LegacyID?: number;
  OfferName: string;
  offerimg: string;
  CompID: number | string;
  LegacyCompanyID?: number;
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
 * @param service Include the users service (organisation) for obtaining service specific content
 * @param ampExpSearchOn Whether or not to use the experimental search endpoint
 * @param searchWithSharedAuthorizerEnabled Whether or not to use the shared authorizer for search
 * @returns SearchResultsType object with either an error or results
 */
export async function makeSearch(
  queryRaw: string,
  idToken: string,
  allowAgeGated: boolean = true,
  service: string,
  searchWithSharedAuthorizerEnabled: boolean = false
) {
  // We use this flag to determine if we should use the shared authorizer lambda for search
  // this is temporary for testing and should be removed as soon testing is complete
  const searchSuffix = searchWithSharedAuthorizerEnabled ? 'SharedAuth' : '';

  const searchPath = `${SEARCH_ENDPOINT}/expSearch${searchSuffix}`;

  const data = {
    searchTerm: he.escape(queryRaw),
    siteId: getSiteIdFromBrandId(BRAND),
    allowAgeGated,
    service,
  };

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: searchPath,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    data: data,
  };

  const output: SearchResultsType = {};

  try {
    const response = await axios.request(config);
    output.results = response.data.data as SearchOfferType[];
  } catch (error: any) {
    output.error = error.message;
  }

  return output;
}
