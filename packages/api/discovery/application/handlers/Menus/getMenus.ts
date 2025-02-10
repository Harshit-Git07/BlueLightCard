import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import { MenuWithSubMenus } from '@blc-mono/discovery/application/models/Menu';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { MenuWithOffers } from '../../models/Menu';
import { mapMenusAndOffersToMenuResponse } from '../../repositories/Menu/service/mapper/MenuMapper';
import { getMenusByMenuType } from '../../repositories/Menu/service/MenuService';
import { extractHeaders } from '../../utils/extractHeaders';
import { getUserDetails } from '../../utils/getUserDetails';
import { isValidMenu } from '../../utils/isValidMenu';
import { isValidMenuOffer } from '../../utils/isValidMenuOffer';

const logger = new LambdaLogger({ serviceName: 'menu-get' });

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const menusSchema = z.object({
  type: z.array(z.enum([MenuType.DEALS_OF_THE_WEEK, MenuType.FEATURED, MenuType.MARKETPLACE, MenuType.FLEXIBLE])),
});

const getMenusParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  let menusRequested: MenuType[] = [];
  const idList = queryParams?.id ?? '';
  if (idList.length > 0) {
    menusRequested = decodeURIComponent(idList)
      .split(',')
      .map((id) => id.trim() as MenuType);
    const queryValidation = menusSchema.safeParse({ type: menusRequested });
    if (!queryValidation.success) {
      logger.error({ message: `Error queryValidation getMenus: ${JSON.stringify(queryValidation)}` });
      throw new Error(queryValidation.error.errors[0]?.message || `Invalid query string parameter 'id'`);
    }
  }
  const { authToken, platform } = extractHeaders(event.headers);
  return { menusRequested, authToken, platform };
};

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { menusRequested, authToken } = getMenusParams(event);
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

    const { dob, organisation } = userProfile;

    const menusToRetrieve =
      menusRequested.length > 0
        ? menusRequested
        : [MenuType.DEALS_OF_THE_WEEK, MenuType.FEATURED, MenuType.MARKETPLACE, MenuType.FLEXIBLE];

    const menusAndOffers: {
      [menuType: string]: (MenuWithOffers | MenuWithSubMenus)[];
    } = {};

    await Promise.all(
      menusToRetrieve.map(async (menuType) => {
        const menuData = await getMenusByMenuType(menuType);
        if (menuData && menuData.length > 0) {
          menusAndOffers[menuType] = menuData;
        }
      }),
    );

    const filteredMenusAndOffers = filterInvalidMenuOffers(menusAndOffers, dob, organisation);

    return Response.OK({
      message: `successful`,
      data: mapMenusAndOffersToMenuResponse(filteredMenusAndOffers),
    });
  } catch (error) {
    logger.error({ message: `Error querying getMenus: ${JSON.stringify(error)}` });
    return Response.Error(new Error('Error querying getMenus'), HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const filterInvalidMenuOffers = (
  menusAndOffers: Partial<Record<MenuType, MenuWithOffers[] | MenuWithSubMenus[]>>,
  dob: string,
  organisation: string,
): Partial<Record<MenuType, MenuWithOffers[] | MenuWithSubMenus[]>> => {
  const filteredMenusAndOffers = { ...menusAndOffers };

  Object.keys(filteredMenusAndOffers).forEach((menuType) => {
    const type = menuType as MenuType;

    if (type === MenuType.FLEXIBLE) return;

    if (Array.isArray(filteredMenusAndOffers[type])) {
      filteredMenusAndOffers[type] = (filteredMenusAndOffers[type] as MenuWithOffers[])
        .map((menu) => ({
          ...menu,
          offers: menu.offers.filter((offer) => isValidMenuOffer(offer, dob, organisation)),
        }))
        .filter((menu) => isValidMenu(menu) && menu.offers.length > 0);
    }
  });

  return filteredMenusAndOffers;
};
