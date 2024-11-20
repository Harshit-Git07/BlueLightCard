import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MenuType } from '@blc-mono/discovery/application/models/MenuResponse';

import { mapMenusAndOffersToMenuResponse } from '../../repositories/Menu/service/mapper/MenuMapper';
import { getMenusByMenuType, getMenusByMenuTypes } from '../../repositories/Menu/service/MenuService';

const logger = new LambdaLogger({ serviceName: 'menu-get' });

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const querySchema = z.object({
  type: z.array(z.enum([MenuType.DEALS_OF_THE_WEEK, MenuType.FEATURED, MenuType.MARKETPLACE, MenuType.FLEXIBLE])),
});

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { menusRequested } = getQueryParams(event);

    const menusAndOffers =
      menusRequested.length === 1
        ? await getMenusByMenuType(menusRequested[0])
        : await getMenusByMenuTypes(menusRequested);

    return Response.OK({ message: `successful`, data: mapMenusAndOffersToMenuResponse(menusAndOffers) });
  } catch (error) {
    logger.error({ message: `Error querying getMenus: ${JSON.stringify(error)}` });
    return Response.BadRequest({ message: `error`, data: 'Error querying getMenus' });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  let menusRequested: MenuType[] = [];
  const idList = queryParams?.id ?? '';
  if (idList.length > 0) {
    menusRequested = decodeURIComponent(idList)
      .split(',')
      .map((id) => id.trim() as MenuType);
    const queryValidation = querySchema.safeParse({ type: menusRequested });
    if (!queryValidation.success) {
      logger.error({ message: `Error queryValidation getMenus: ${JSON.stringify(queryValidation)}` });
      throw new Error(queryValidation.error.errors[0]?.message || `Invalid query string parameter 'id'`);
    }
  }
  const authToken = event.headers.Authorization as string;

  return { menusRequested, authToken };
};
