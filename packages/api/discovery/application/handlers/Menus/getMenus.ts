import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { MenuResponse, MenuType } from '@blc-mono/discovery/application/models/MenuResponse';
const logger = new LambdaLogger({ serviceName: 'menu-get' });

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const dummyMenuResponse: MenuResponse = {
  dealsOfTheWeek: {
    offers: [
      {
        offerID: '1',
        offerName: 'Deal of the Week 1',
        offerDescription: 'Description for Deal of the Week 1',
        imageURL: 'http://example.com/image1.jpg',
        companyID: 'company1',
        companyName: 'Company 1',
      },
    ],
  },
  featured: {
    offers: [
      {
        offerID: '2',
        offerName: 'Featured Offer 1',
        offerDescription: 'Description for Featured Offer 1',
        imageURL: 'http://example.com/image2.jpg',
        companyID: 'company2',
        companyName: 'Company 2',
      },
    ],
  },
  marketplace: [
    {
      menuName: 'Marketplace Menu 1',
      hidden: false,
      offers: [
        {
          offerID: '3',
          offerName: 'Marketplace Offer 1',
          offerDescription: 'Description for Marketplace Offer 1',
          imageURL: 'http://example.com/image3.jpg',
          companyID: 'company3',
          companyName: 'Company 3',
        },
      ],
    },
  ],
  flexible: [
    {
      listID: 'list1',
      title: 'Flexible List 1',
      imageURL: 'http://example.com/image4.jpg',
    },
  ],
};

const querySchema = z.object({
  type: z.array(z.enum([MenuType.dealsOfTheWeek, MenuType.featured, MenuType.marketplace, MenuType.flexible])),
});

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const menuList = getQueryParams(event);

    const filteredMenuResponse: MenuResponse = {
      dealsOfTheWeek: menuList.menusRequested.includes('dealsOfTheWeek') ? dummyMenuResponse.dealsOfTheWeek : undefined,
      featured: menuList.menusRequested.includes('featured') ? dummyMenuResponse.featured : undefined,
      marketplace: dummyMenuResponse.marketplace?.filter((menu) => menuList.menusRequested.includes(menu.menuName)),
      flexible: dummyMenuResponse.flexible?.filter((list) => menuList.menusRequested.includes(list.listID)),
    };

    if (
      !filteredMenuResponse.dealsOfTheWeek &&
      !filteredMenuResponse.featured &&
      !filteredMenuResponse.marketplace?.length &&
      !filteredMenuResponse.flexible?.length
    ) {
      return Response.OK({ message: `successful`, data: dummyMenuResponse });
    }

    return Response.OK({ message: `successful`, data: filteredMenuResponse });
  } catch (error) {
    logger.error({ message: `Error querying getMenus: ${JSON.stringify(error)}` });
    return Response.BadRequest({ message: `error`, data: 'Error querying getMenus' });
  }
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  let menusRequested: string[] = [];
  const idList = queryParams?.id ?? '';
  if (idList.length > 0) {
    menusRequested = decodeURIComponent(idList)
      .split(',')
      .map((id) => id.trim());
    const queryValidation = querySchema.safeParse({ type: menusRequested });
    if (!queryValidation.success) {
      logger.error({ message: `Error queryValidation getMenus: ${JSON.stringify(queryValidation)}` });
      throw new Error(queryValidation.error.errors[0]?.message || `Invalid query string parameter 'id'`);
    }
  }
  const authToken = event.headers.Authorization as string;

  return { menusRequested, authToken };
};
