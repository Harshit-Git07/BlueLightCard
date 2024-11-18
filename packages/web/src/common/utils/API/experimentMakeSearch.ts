import { WebPlatformAdapter } from '@/utils/WebPlatformAdapter';
import { V5_API_URL } from '@/globals/apiUrl';

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
 * Makes a search request to the Discovery API Gateway
 * @param queryRaw The raw query string for the search
 * @param dateOfBirth User date of birth
 * @param service Include the users service (organisation) for obtaining service specific content
 * @param platFormAdapter PlatformAdapter for making the API request
 * @param useLegacyId Determines whether to use legacy IDs
 * @returns SearchResultsType object with either an error or results
 */
export async function experimentMakeSearch(
  queryRaw: string,
  dateOfBirth: string,
  service: string,
  platFormAdapter: WebPlatformAdapter,
  useLegacyId = true
) {
  const params = {
    query: he.escape(queryRaw),
    dob: dateOfBirth,
    organisation: service,
  };
  const output: SearchResultsType = {};

  try {
    const response = await platFormAdapter.invokeV5Api(V5_API_URL.Search, {
      method: 'GET',
      queryParameters: params,
    });
    output.results = JSON.parse(response.data).data as SearchOfferType[];

    if (useLegacyId) {
      output.results.forEach((result) => {
        result.ID = result.LegacyID ?? result.ID;
        result.CompID = result.LegacyCompanyID ?? result.CompID;
      });
    }
  } catch (error: any) {
    output.error = error.message;
  }

  return output;
}
