import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import { isAfter, subMinutes } from 'date-fns';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';

import { CompanySummary } from '../../models/CompaniesResponse';
import { extractHeaders } from '../../utils/extractHeaders';
import { getUserDetails } from '../../utils/getUserDetails';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'companies-get' });

const CACHE_TTL_MINUTES = 5;

interface AllCompanies {
  timestamp?: Date;
  companies?: CompanySummary[];
}

let ALL_COMPANIES_CACHE: AllCompanies = {};

const openSearchService = new DiscoveryOpenSearchService();

const getCompanyParams = (event: APIGatewayEvent) => {
  const skipCache = event.queryStringParameters?.skipCache === 'true';
  const { authToken, platform } = extractHeaders(event.headers);
  return { skipCache, authToken, platform };
};

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  logger.info({ message: `Getting all companies` });
  const { skipCache, authToken } = getCompanyParams(event);

  if (isCacheValid(ALL_COMPANIES_CACHE, skipCache)) {
    return Response.OK({ message: 'Success', data: ALL_COMPANIES_CACHE.companies });
  } else {
    try {
      const parsedBearerToken = unpackJWT(authToken);
      const userProfile = await getUserDetails(parsedBearerToken['custom:blc_old_uuid']);

      if (!userProfile) {
        logger.error({ message: 'User profile not found' });
        return Response.Unauthorized({ message: 'User profile not found' });
      }
      if (!userProfile?.organisation) {
        logger.error({ message: 'User profile missing organisation, returning empty offers' });
        return Response.OK({ message: 'No organisation assigned on user, defaulting to no offers', data: [] });
      }

      const { dob } = userProfile;
      const results = await openSearchService.queryAllCompanies(await openSearchService.getLatestIndexName(), dob);
      const sortedResults = [...results].sort(sortByAlphabeticalOrder);
      updateCache(sortedResults);

      return Response.OK({ message: 'Success', data: sortedResults });
    } catch (error) {
      logger.error({ message: `Error querying OpenSearch: ${JSON.stringify(error)}` });
      return Response.Error(new Error('Error querying OpenSearch'), HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const sortByAlphabeticalOrder = (a: CompanySummary, b: CompanySummary) => {
  if (a.companyName.toLowerCase() < b.companyName.toLowerCase()) return -1;
  else if (a.companyName.toLowerCase() > b.companyName.toLowerCase()) return 1;
  return 0;
};

const isCacheValid = (companiesCache: AllCompanies, skipCache: boolean): boolean => {
  if (skipCache || !companiesCache.timestamp) return false;

  return companiesCache && isAfter(companiesCache.timestamp, subMinutes(new Date(), CACHE_TTL_MINUTES));
};

const updateCache = (companies: CompanySummary[]): void => {
  if (companies.length > 0) ALL_COMPANIES_CACHE = { timestamp: new Date(), companies };
};

export const resetCache = (): void => {
  ALL_COMPANIES_CACHE = {};
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
