import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import axios, { AxiosResponse } from 'axios';
import { HttpStatusCode } from '../../../../core/src/types/http-status-code.enum';
import { LegacyOffers } from '../../models/legacy/legacyOffers';
import { LegacyCompanyOffers } from '../../models/legacy/legacyCompanyOffers';
import { Offers, OffersModel } from '../../models/offers';
import { API_SOURCE, OFFER_TYPES } from '../../utils/global-constants';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';
import { FirehoseDeliveryStream } from '../../../../core/src/utils/firehose';
import { isDev } from '../../../../core/src/utils/checkEnvironment';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-offers-get` });
const stage = process.env.STAGE ?? '';
const firehose = new FirehoseDeliveryStream(logger);

export const handler = async (event: APIGatewayEvent) => {
  try {
    const offerId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;
    const authToken = event.headers.Authorization ?? '';
    const source = event.headers.source ?? '';
    const uid = getLegacyUserId(authToken);

    if (!offerId) {
      logger.error({ message: 'offerId not set' });
      return Response.NotFound({ message: 'offerId not set' });
    }

    const legacyOffersUrl = process.env.LEGACY_RETRIEVE_OFFERS_URL as string;
    if (!legacyOffersUrl) {
      return Response.Error(
        {
          name: 'legacyApiUrlNotSet',
          message: 'Error fetching offers',
        },
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const apiUrl = `${legacyOffersUrl}?id=${offerId}&uid=${uid}&bypass=true`;
    logger.info({ message: 'apiUrl', data: apiUrl });
    return getOfferDetailFromLegacy(apiUrl, event.headers.Authorization as string, uid, source);
  } catch (error: any) {
    logger.error({ message: 'Error fetching offers', data: error });
    return error;
  }
};

async function getOfferDetailFromLegacy(
  apiUrl: string,
  bearerToken: string,
  uid: string,
  source: string,
): Promise<Response> {
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

    if (!isDev(stage)) {
      //set the stream depending on header sent
      const stream = source === API_SOURCE.APP ? process.env.FIREHOSE_STREAM_APP! : process.env.FIREHOSE_STREAM_WEB!;
      const data = {
        cid: offersResponse.companyId,
        oid: offersResponse.id,
        mid: uid,
        timedate: new Date().toISOString()
      };
      await firehose.send({stream, data});
    }

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
