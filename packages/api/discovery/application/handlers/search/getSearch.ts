import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

const logger = new LambdaLogger({ serviceName: 'search-get' });

const openSearchService = new DiscoveryOpenSearchService();

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { searchTerm, organisation, dob } = getQueryParams(event);

  if (searchTerm && organisation && dob) {
    logger.info({ message: `Search term: ${searchTerm}, organisation: ${organisation}, dob: ${dob}` });

    try {
      const results = await openSearchService.queryBySearchTerm(
        searchTerm,
        await openSearchService.getLatestIndexName(),
        dob,
        organisation,
      );

      return Response.OK({ message: 'Success', data: results });
    } catch (error) {
      logger.error({ message: `Error querying OpenSearch: ${JSON.stringify(error)}` });
      return Response.Error(new Error('Error querying OpenSearch'), HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  } else {
    return Response.BadRequest({
      message: `Missing data on request - searchTerm: ${searchTerm}, organisation: ${organisation}, dob: ${dob}`,
    });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const searchTerm = queryParams?.query;
  const organisation = queryParams?.organisation;
  const dob = queryParams?.dob;
  const authToken = event.headers.Authorization as string;

  return { searchTerm, organisation, dob, authToken };
};
