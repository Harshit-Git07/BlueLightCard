import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import { APIGatewayProxyEventPathParameters } from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { categories } from '@blc-mono/discovery/application/handlers/categories/getCategories';
import { CategoryOffer, CategoryResponse } from '@blc-mono/discovery/application/models/CategoryResponse';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'categories-get' });

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const categoryId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id ?? '';

  logger.info({ message: `Getting category for id ${categoryId}` });

  if (isValidCategory(categoryId)) {
    return Response.OK({ message: 'Success', data: getCategory(categoryId) });
  } else {
    return Response.BadRequest({ message: 'Invalid category ID', data: {} });
  }
};

const isValidCategory = (categoryId: string) => categories.find((category) => category.id === categoryId);

const getCategory = (categoryId: string): CategoryResponse => {
  return {
    id: categoryId,
    name: categories.find((category) => category.id === categoryId)?.name ?? 'Unknown Category',
    data: [buildDummyOffer(1), buildDummyOffer(2), buildDummyOffer(3), buildDummyOffer(4), buildDummyOffer(5)],
  };
};

export const buildDummyOffer = (id: number): CategoryOffer => {
  return {
    ID: '189f3060626368d0a716f0e795d8f2c7',
    LegacyID: 9487,
    OfferName: `Get 20% off your food bill, valid Monday - Friday = ${id}`,
    OfferType: 'in-store',
    offerimg: 'https://cdn.sanity.io/images/td1j6hke/staging/c92d0d548e09b08e4659cb5a4a2a55fa9fc2f11c-640x320.jpg',
    CompID: '24069b9c8eb7591046d066ef57e26a94',
    LegacyCompanyID: 9694,
    CompanyName: 'Stonehouse Pizza & Carvery',
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
