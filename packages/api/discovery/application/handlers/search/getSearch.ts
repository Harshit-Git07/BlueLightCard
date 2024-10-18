import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { OpenSearchService } from '@blc-mono/discovery/application/services/opensearch/OpenSearchService';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

const logger = new LambdaLogger({ serviceName: 'search-get' });

const openSearchService = new OpenSearchService();

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { searchTerm, service, dob } = getQueryParams(event);

  if (searchTerm && service && dob) {
    logger.info({ message: `Search term: ${searchTerm}, service: ${service}, dob: ${dob}` });

    try {
      const results = await openSearchService.queryIndex(searchTerm, await openSearchService.getLatestIndexName(), dob);

      return Response.OK({ message: 'Success', data: results });
    } catch (error) {
      logger.error({ message: `Error querying OpenSearch: ${JSON.stringify(error)}` });
      return Response.Error(new Error('Error querying OpenSearch'), HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  } else {
    return Response.BadRequest({
      message: `Missing data on request - searchTerm: ${searchTerm}, service: ${service}, dob: ${dob}`,
    });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const searchTerm = queryParams?.query;
  const service = queryParams?.organisation;
  const dob = queryParams?.dob;
  const authToken = event.headers.Authorization as string;

  return { searchTerm, service, dob, authToken };
};
