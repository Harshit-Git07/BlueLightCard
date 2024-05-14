import axios from 'axios';
import he from 'he';

import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { DiscoveryStackEnvironmentKeys } from '../../infrastructure/constants/environment';
import { SearchOfferType, SearchResultsType } from '../../libs/models/SearchResults';

const logger = new LambdaLogger({ serviceName: 'search-legacy-search' });

export const search = async (queryRaw: string, idToken: string, allowAgeGated = true, service: string) => {
  const host = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_LAMBDA_SCRIPTS_HOST);
  const environment = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_LAMBDA_SCRIPTS_ENVIRONMENT);
  const brand = getEnv(DiscoveryStackEnvironmentKeys.SEARCH_BRAND);
  const searchPath = `${host}/${environment}/newSearch`;

  const data = {
    searchTerm: he.escape(queryRaw),
    siteId: Number(brand),
    allowAgeGated,
    service,
  };

  const config = {
    method: 'post',
    maxBodyLength: 300,
    url: searchPath,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getIdToken(idToken),
    },
    data: data,
  };

  const output: SearchResultsType = {};

  try {
    const response = await axios.request(config);
    output.results = response.data.data as SearchOfferType[];
    if (output.results) {
      mapSearchResults(output.results);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    output.error = error.message;
    logger.error({ message: `Error in legacySearch: ${error.message}` });
  }

  return output;
};

const mapSearchResults = (results: SearchOfferType[]) =>
  results.forEach((result) => (result.S3Logos = result.offerimg));

const getIdToken = (userIdToken: string) => {
  const authTokenOverride = getEnvRaw(DiscoveryStackEnvironmentKeys.SEARCH_AUTH_TOKEN_OVERRIDE);
  if (authTokenOverride && authTokenOverride !== '') {
    logger.info({ message: 'Using searchAuthTokenOverride' });
    return authTokenOverride;
  }
  return userIdToken;
};
