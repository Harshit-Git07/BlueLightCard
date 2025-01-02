import { APIGatewayEvent } from 'aws-lambda';
import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { ThemedSubMenuWithOffers } from '@blc-mono/discovery/application/models/ThemedMenu';
import { isValidEvent, isValidOffer } from '@blc-mono/discovery/application/utils/isValidOffer';

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
    const { dob, organisation } = getQueryParams(event);

    if (dob && organisation) {
      const flexibleMenuOffers = await getThemedMenuAndOffersBySubMenuId(flexibleMenuId);
      if (!flexibleMenuOffers) {
        return Response.NotFound({ message: `No flexible menu found with id: ${flexibleMenuId}` });
      }

      const filteredFlexibleMenuOffers = filterInvalidOffers(flexibleMenuOffers, dob, organisation);

      return Response.OK({
        message: `successful`,
        data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(filteredFlexibleMenuOffers),
      });
    } else {
      return Response.BadRequest({
        message: `Missing query parameter on request - organisation: ${organisation}, dob: ${dob}`,
      });
    }
  } catch (error) {
    logger.error({ message: `Error querying getFlexibleMenus: ${JSON.stringify(error)}` });
    return Response.BadRequest({
      message: `error`,
      data: 'Error querying getFlexibleMenus',
    });
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

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const dob = queryParams?.dob;
  const organisation = queryParams?.organisation;

  return {
    dob: dob,
    organisation: organisation,
  };
};

const filterInvalidOffers = (
  submenuWithOffers: ThemedSubMenuWithOffers,
  dob: string,
  organisation: string,
): ThemedSubMenuWithOffers => {
  const filteredOffers = submenuWithOffers.offers.filter((offer) => isValidOffer(offer, dob, organisation));
  const filteredEvents = submenuWithOffers.events.filter((event) => isValidEvent(event, dob, organisation));

  return {
    ...submenuWithOffers,
    offers: filteredOffers,
    events: filteredEvents,
  };
};
