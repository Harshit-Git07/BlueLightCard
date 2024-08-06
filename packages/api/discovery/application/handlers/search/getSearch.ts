import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

import { search } from '../../../application/services/legacySearch';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

const logger = new LambdaLogger({ serviceName: 'search-get' });
const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { searchTerm, service, isAgeGated, authToken } = getQueryParams(event);

  if (searchTerm && service) {
    logger.info({ message: `Search term: ${searchTerm}` });
    const result = await search(searchTerm, authToken, isAgeGated, service);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result.results,
      }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing data on request - searchTerm: ${searchTerm}, service: ${service}`,
      }),
    };
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const searchTerm = queryParams?.query;
  const service = queryParams?.organisation;
  const isAgeGated = queryParams?.isAgeGated === 'true';
  const authToken = event.headers.Authorization as string;

  return { searchTerm, service, isAgeGated, authToken };
};
