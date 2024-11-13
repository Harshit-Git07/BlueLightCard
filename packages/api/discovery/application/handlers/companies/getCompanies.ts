import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { isAfter, subMinutes } from 'date-fns';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { OpenSearchService } from '@blc-mono/discovery/application/services/opensearch/OpenSearchService';

import { CompanySummary } from '../../models/CompaniesResponse';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'companies-get' });

const CACHE_TTL_MINUTES = 5;

interface AllCompanies {
  timestamp?: Date;
  companies?: CompanySummary[];
}

let ALL_COMPANIES_CACHE: AllCompanies = {};

const openSearchService = new OpenSearchService();

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  logger.info({ message: `Getting all companies` });
  const { organisation, dob, skipCache } = getQueryParams(event);

  if (!organisation || !dob) {
    return Response.BadRequest({
      message: `Missing data on request - organisation: ${organisation}, dob: ${dob}`,
    });
  }

  if (isCacheValid(ALL_COMPANIES_CACHE, skipCache)) {
    return Response.OK({ message: 'Success', data: ALL_COMPANIES_CACHE.companies });
  } else {
    try {
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

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const organisation = queryParams?.organisation;
  const dob = queryParams?.dob;
  const skipCache = queryParams?.skipCache === 'true';

  return { organisation, dob, skipCache };
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
