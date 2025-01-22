import { APIGatewayEvent } from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import { ThemedSubMenuWithOffers } from '@blc-mono/discovery/application/models/ThemedMenu';
import { isValidEvent, isValidOffer } from '@blc-mono/discovery/application/utils/isValidOffer';

import { mapThemedSubMenuWithOffersToFlexibleMenuResponse } from '../../repositories/Menu/service/mapper/FlexibleMenuMapper';
import { getThemedMenuAndOffersBySubMenuId } from '../../repositories/Menu/service/MenuService';
import { extractHeaders } from '../../utils/extractHeaders';
import { getUserDetails } from '../../utils/getUserDetails';

const logger = new LambdaLogger({ serviceName: 'flexible-menu-get' });

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const flexibleMenuSchema = z.object({
  id: z.string(),
});

const getFlexibleMenuParams = (event: APIGatewayEvent) => {
  const pathParamValidation = flexibleMenuSchema.safeParse(event.pathParameters);
  if (!pathParamValidation.success) {
    throw new Error(
      `Invalid path parameters: ${pathParamValidation.error.issues.map((issue) => issue.path + ' - ' + issue.message).join(', ')}`,
    );
  }
  const { authToken, platform } = extractHeaders(event.headers);
  return { authToken, platform, id: pathParamValidation.data.id };
};

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { id: flexibleMenuId, authToken } = getFlexibleMenuParams(event);
    const parsedBearerToken = unpackJWT(authToken);
    const userProfile = await getUserDetails(parsedBearerToken['custom:blc_old_uuid']);

    if (!userProfile) {
      logger.error({ message: 'User profile not found' });
      return Response.Unauthorized({ message: 'User profile not found' });
    }

    if (!userProfile?.organisation) {
      logger.error({ message: 'User profile missing organisation, returning empty menus' });
      return Response.OK({ message: 'No organisaton assigned on user, defaulting to no menus', data: [] });
    }
    const { dob, organisation } = userProfile;

    const flexibleMenuOffers = await getThemedMenuAndOffersBySubMenuId(flexibleMenuId);
    if (!flexibleMenuOffers) {
      return Response.NotFound({ message: `No flexible menu found with id: ${flexibleMenuId}` });
    }

    const filteredFlexibleMenuOffers = filterInvalidOffers(flexibleMenuOffers, dob, organisation);

    return Response.OK({
      message: `successful`,
      data: mapThemedSubMenuWithOffersToFlexibleMenuResponse(filteredFlexibleMenuOffers),
    });
  } catch (error) {
    logger.error({ message: `Error querying getFlexibleMenus: ${JSON.stringify(error)}` });
    return Response.Error(new Error('Error querying getFlexibleMenus'), HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

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
