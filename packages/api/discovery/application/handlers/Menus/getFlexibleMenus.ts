import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventPathParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';

import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from '../../repositories/Menu/service/mapper/FlexibleMenuMapper';
import { getThemedMenuAndOffersBySubMenuId } from '../../repositories/Menu/service/MenuService';

const logger = new LambdaLogger({ serviceName: 'flexible-menu-get' });

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const querySchema = z.object({
  id: z.string(),
});

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { id: flexibleMenuId } = getPathParams(event);
    const flexibleMenuOffers = await getThemedMenuAndOffersBySubMenuId(flexibleMenuId);
    if (!flexibleMenuOffers) {
      return Response.NotFound({ message: `No flexible menu found with id: ${flexibleMenuId}` });
    }
    return Response.OK({
      message: `successful`,
      data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(flexibleMenuOffers),
    });
  } catch (error) {
    logger.error({ message: `Error querying getFlexibleMenus: ${JSON.stringify(error)}` });
    return Response.BadRequest({ message: `error`, data: 'Error querying getFlexibleMenus' });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getPathParams = (event: APIGatewayEvent) => {
  const pathParams = event.pathParameters as APIGatewayProxyEventPathParameters;
  const queryValidation = querySchema.safeParse({ id: pathParams.id });
  if (!queryValidation.success) {
    logger.error({ message: `Error queryValidation getFlexibleMenus: ${JSON.stringify(queryValidation)}` });
    throw new Error(queryValidation.error.errors[0]?.message || `Invalid query string parameter 'id'`);
  }
  return queryValidation.data;
};
