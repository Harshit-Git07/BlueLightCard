import 'dd-trace/init';

import { APIGatewayEvent } from 'aws-lambda';
import {
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda/trigger/api-gateway-proxy';
import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { categories } from '@blc-mono/discovery/application/handlers/categories/getCategories';
import { OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'categories-get' });

const openSearchService = new DiscoveryOpenSearchService();
const handlerUnwrapped = async (event: APIGatewayEvent) => {
  const categoryId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id ?? '';
  const { dob, organisation } = getQueryParams(event);

  logger.info({ message: `Getting category for id ${categoryId}` });

  if (isValidCategory(categoryId)) {
    const results = await openSearchService.queryByCategory(
      await openSearchService.getLatestIndexName(),
      dob,
      organisation,
      categoryId,
    );
    const mappedResults = results.map((result) => mapSearchResultToOfferResponse(result));
    return Response.OK({
      message: 'Success',
      data: {
        id: categoryId,
        name: getCategoryName(categoryId),
        data: mappedResults,
      },
    });
  } else {
    return Response.BadRequest({ message: 'Invalid category ID', data: {} });
  }
};

const isValidCategory = (categoryId: string) => categories.find((category) => category.id === categoryId);
const getCategoryName = (categoryId: string) => {
  const category = categories.find((category) => category.id === categoryId);
  return category?.name ?? 'Unknown Category';
};

const getQueryParams = (event: APIGatewayEvent) => {
  const queryParams = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  const dob = queryParams?.dob;
  const organisation = queryParams?.organisation;

  return { dob: dob ?? '', organisation: organisation ?? '' };
};

const mapSearchResultToOfferResponse = (result: SearchResult): OfferResponse => {
  return {
    offerID: result.ID,
    legacyOfferID: result.LegacyID,
    offerName: result.OfferName,
    offerDescription: result.OfferDescription ?? '',
    offerType: result.OfferType as OfferType,
    imageURL: result.offerimg,
    companyID: result.CompID,
    legacyCompanyID: result.LegacyCompanyID,
    companyName: result.CompanyName,
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
