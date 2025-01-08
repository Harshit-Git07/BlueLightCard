import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import {
  DiscoveryOpenSearchService,
  DiscoverySearchContext,
} from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT || 'false';

const logger = new LambdaLogger({ serviceName: 'search-get' });

const headersSchema = z.object({
  Authorization: z.string(),
  ['x-client-type']: z.enum(['web', 'mobile']),
});

const openSearchService = new DiscoveryOpenSearchService();

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const { searchTerm, organisation, dob, authToken, platform } = getQueryParams(event);

  if (searchTerm && organisation && dob) {
    logger.info({ message: `Search term: ${searchTerm}, organisation: ${organisation}, dob: ${dob}` });

    try {
      const parsedBearerToken = unpackJWT(authToken);

      const searchContext: DiscoverySearchContext = {
        term: searchTerm,
        dob,
        indexName: await openSearchService.getLatestIndexName(),
        organisation,
        memberId: parsedBearerToken['custom:blc_old_uuid'],
        platform,
      };
      const results = await openSearchService.queryBySearchTerm(searchContext);

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
  const headerValidation = headersSchema.safeParse(event.headers);
  if (!headerValidation.success) {
    throw new Error(
      `Invalid headers: ${headerValidation.error.issues.map((issue) => issue.path + ' - ' + issue.message).join(', ')}`,
    );
  }

  const authToken = headerValidation.data.Authorization;
  const platform = headerValidation.data['x-client-type'];

  return { searchTerm, organisation, dob, authToken, platform };
};
