import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import axios, { AxiosResponse } from 'axios';
import { HttpStatusCode } from '../../../../core/src/types/http-status-code.enum';
import { LegacyOffers } from '../../models/legacy/legacyOffers';
import { LegacyCompanyOffers } from '../../models/legacy/legacyCompanyOffers';
import { Offers, OffersModel } from '../../models/offers';
import { OFFER_TYPES } from '../../utils/global-constants';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-offers-get` });

export const handler = async (event: APIGatewayEvent) => {
  try {
    logger.info({ message: 'auth token', data: event.headers.Authorization });
    const { id } = event.pathParameters as APIGatewayProxyEventPathParameters;
    const authToken = event.headers.Authorization as string;
    const uid = getLegacyUserId(authToken);
    logger.info({ message: 'GET Offers Input', data: { id, uid } });

    const legacyOffersUrl = process.env.LEGACY_RETRIEVE_OFFERS_URL as string;
    if (!legacyOffersUrl) {
      logger.error({ message: 'Legacy API Url not set' });
      throw Response.Error(
        {
          name: 'legacyApiUrlNotSet',
          message: 'Error fetching offers',
        },
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const apiUrl = `${legacyOffersUrl}?id=${id}&uid=${uid}`;
    logger.info({
      message: 'trigger GET legacy Offers api',
      data: { auth: authToken, apiUrl },
    });

    return getOfferDetailFromLegacy(apiUrl, event.headers.Authorization as string);
  } catch (error: any) {
    logger.error({ message: 'Error fetching offers', data: error });
    return error;
  }
};

async function getOfferDetailFromLegacy(apiUrl: string, bearerToken: string): Promise<Response> {
  try {
    const { data: legacyOffersResponse } = await axios.get<AxiosResponse<LegacyCompanyOffers>>(apiUrl, {
      headers: {
        Authorization: bearerToken,
      },
    });
    logger.info({ message: 'GET legacy Offers Output', data: legacyOffersResponse });

    if (legacyOffersResponse.data.offers.length === 0) {
      return Response.NotFound({ message: 'Offer not found', data: {} });
    }
    const offersResponse = validateOffersResponse({
      ...getOfferDetails(legacyOffersResponse.data.offers[0]), // using id in query params will get only one offer
      companyId: legacyOffersResponse.data.id,
      companyLogo: legacyOffersResponse.data.s3logos,
    }) as Offers;
    return Response.OK({ message: 'Success', data: offersResponse });
  } catch (error) {
    logger.error({ message: 'Error fetching offers from legacy API', data: error });
    return Response.Error(
      {
        name: 'legacyApiError',
        message: 'Error fetching offers',
      },
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
}

function getOfferDetails(offer: LegacyOffers): Omit<Offers, 'companyId' | 'companyLogo'> {
  const offerType = OFFER_TYPES[offer.typeid as keyof typeof OFFER_TYPES];
  return {
    id: offer.id,
    name: offer.name,
    description: offer.desc,
    expiry: new Date(offer.expires),
    type: offerType,
    terms: offer.terms,
  };
}

function validateOffersResponse(offer: Offers): Offers | Response {
  const result = OffersModel.safeParse(offer);
  if (result.success) {
    return offer;
  } else {
    logger.error(`Error validating offers query output ${result.error}`);
    throw Response.Error(
      {
        name: 'responseParsingApiError',
        message: 'Error fetching offers',
      },
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
}
