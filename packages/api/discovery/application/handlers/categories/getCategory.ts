import 'dd-trace/init';

import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import { z } from 'zod';

import { HttpStatusCode } from '@blc-mono/core/types/http-status-code.enum';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { unpackJWT } from '@blc-mono/core/utils/unpackJWT';
import { categories } from '@blc-mono/discovery/application/handlers/categories/getCategories';
import { EventType, OfferType } from '@blc-mono/discovery/application/models/Offer';
import { OfferResponse } from '@blc-mono/discovery/application/models/OfferResponse';
import { DiscoveryOpenSearchService } from '@blc-mono/discovery/application/services/opensearch/DiscoveryOpenSearchService';
import { SearchResult } from '@blc-mono/discovery/application/services/opensearch/OpenSearchResponseMapper';

import { EventResponse } from '../../models/EventResponse';
import { extractHeaders } from '../../utils/extractHeaders';
import { getUserDetails } from '../../utils/getUserDetails';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'categories-get' });

const getCategoryParams = (event: APIGatewayEvent) => {
  const categoryId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id ?? '';
  const { authToken, platform } = extractHeaders(event.headers);

  return { authToken, platform, categoryId };
};

const openSearchService = new DiscoveryOpenSearchService();

const handlerUnwrapped = async (event: APIGatewayEvent) => {
  try {
    const { categoryId, authToken } = getCategoryParams(event);
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

    logger.info({ message: `Getting category for id ${categoryId}` });

    if (isValidCategory(categoryId)) {
      const results: SearchResult[] = [];

      const categoryName = getCategoryName(categoryId);

      if (categoryName === 'Events') {
        results.push(
          ...(await openSearchService.queryByEventCategory(
            await openSearchService.getLatestIndexName(),
            dob,
            organisation,
            categoryId,
          )),
        );
      } else {
        results.push(
          ...(await openSearchService.queryByCategory(
            await openSearchService.getLatestIndexName(),
            dob,
            organisation,
            categoryId,
          )),
        );
      }

      const mappedResults = results.map((result) => mapSearchResultToOfferResponse(result));
      return Response.OK({
        message: 'Success',
        data: {
          id: categoryId,
          name: categoryName,
          data: mappedResults,
        },
      });
    } else {
      return Response.BadRequest({ message: 'Invalid category ID', data: {} });
    }
  } catch (error) {
    return Response.Error(new Error('Error querying offers by category'), HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};

const isValidCategory = (categoryId: string) => categories.find((category) => category.id === categoryId);
const getCategoryName = (categoryId: string) => {
  const category = categories.find((category) => category.id === categoryId);
  return category?.name ?? 'Unknown Category';
};

const mapSearchResultToOfferResponse = (result: SearchResult): OfferResponse | EventResponse => {
  if (result.OfferType === EventType.TICKET) {
    return {
      offerType: EventType.TICKET,
      eventID: result.ID,
      eventName: result.eventName,
      eventDescription: result.eventDescription ?? '',
      imageURL: result.eventImg,
      venueID: result.venueID,
      venueName: result.venueName,
    };
  }

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
