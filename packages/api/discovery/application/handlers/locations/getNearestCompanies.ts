import 'dd-trace/init';

import { APIGatewayEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';

import { DiscoveryOpenSearchService } from '../../services/opensearch/DiscoveryOpenSearchService';
import { extractHeaders } from '../../utils/extractHeaders';
import { getUserDetails } from '../../utils/getUserDetails';

import { DistanceUnit } from './locations.enum';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const logger = new LambdaLogger({ serviceName: 'get-nearest-offers' });

const openSearchService = new DiscoveryOpenSearchService();

const locationSchema = z.object({
  lat: z.string().transform((val) => parseFloat(val)),
  lon: z.string().transform((val) => parseFloat(val)),
  distanceUnit: z.enum([DistanceUnit.MILES, DistanceUnit.KILOMETERS]),
  distance: z.string().transform((val) => parseInt(val, 10)),
  limit: z.string().transform((val) => parseInt(val, 10)),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
});

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const validation = locationSchema.safeParse(queryParams);

  const { authToken, platform } = extractHeaders(event.headers);

  if (!validation.success) {
    logger.error({ message: `Validation error in getNearestCompanies: ${JSON.stringify(validation)}` });
    throw new Error(
      `Invalid query parameters: ${validation.error.issues.map((issue) => issue.path + ' - ' + issue.message).join(', ')}`,
    );
  }

  const { lat, lon, distance, limit, companyId, companyName, distanceUnit } = validation.data;
  return { lat, lon, distance, limit, companyId, companyName, authToken, platform, distanceUnit };
};

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { lat, lon, distance, limit, companyId, companyName, authToken, distanceUnit } = getQueryParams(event);

    const parsedBearerToken = unpackJWT(authToken);

    const userProfile = await getUserDetails(parsedBearerToken['custom:blc_old_uuid']);

    if (!userProfile) {
      return Response.Error(new Error('User not found'), HttpStatusCode.NOT_FOUND);
    }
    if (!userProfile?.organisation) {
      logger.error({ message: 'User profile missing organisation, returning empty companies' });
      return Response.OK({ message: 'No organisation assigned on user, defaulting to no companies', data: [] });
    }

    const { organisation, dob } = userProfile;

    const results = await openSearchService.queryByLocation({
      indexName: await openSearchService.getLatestIndexName(),
      lat,
      lon,
      distance,
      distanceUnit,
      limit,
      dob,
      organisation,
      companyId,
      companyName,
    });

    logger.info({ message: `Found ${results.length} offers - ${JSON.stringify(results)}` });
    return Response.OK({ message: 'Success', data: results });
  } catch (error) {
    logger.error({ message: `Error in getNearestCompanies: ${JSON.stringify(error)}` });
    return Response.Error(new Error('Error querying nearest companies'), HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
