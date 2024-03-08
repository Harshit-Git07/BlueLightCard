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

    return getOfferDetailFromLegacy(offerId as string, uid, event.headers.Authorization as string, source);
  } catch (error: any) {
    logger.error({ message: 'Error fetching offers', data: error });
    return error;
  }
};

async function getOfferDetailFromLegacy(
  id: string,
  uid: string,
  bearerToken: string,
  source: string,
): Promise<Response> {
  try {
    const { data: legacyOffersResponse } = await getLegacyOffersData(id, uid, bearerToken);
    logger.info({ message: 'GET legacy Offers Output', data: legacyOffersResponse });

    if (legacyOffersResponse.data.offers.length === 0) {
      logger.info({ message: 'no offers received from legacy API' });
      return Response.NotFound({ message: 'Offer not found', data: {} });
    }
    const offer = legacyOffersResponse.data.offers.find((offer: LegacyOffers) => offer.id === Number(id));
    if (!offer) {
      logger.info({ message: `Legacy API response did not contain the offer with id: ${id}` });
      return Response.NotFound({ message: 'Offer not found', data: {} });
    }
    const offersResponse = validateOffersResponse({
      ...getOfferDetail(offer), // using id in query params will get only one offer
      companyId: legacyOffersResponse.data.id,
      companyLogo: legacyOffersResponse.data.s3logos,
    }) as Offers;

    if (!isDev(stage)) {
      //set the stream depending on header sent
      const stream = source === API_SOURCE.APP ? process.env.FIREHOSE_STREAM_APP! : process.env.FIREHOSE_STREAM_WEB!;
      const data = {
        cid: offersResponse.companyId,
        oid_: offersResponse.id,
        mid: uid,
        timedate: new Date().toISOString(),
      };
      await firehose.send({ stream, data });
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

function getOfferDetail(offer: LegacyOffers): Omit<Offers, 'companyId' | 'companyLogo'> {
  const offerType = OFFER_TYPES[offer.typeid as keyof typeof OFFER_TYPES];
  const expiry = offer.expires && !isNaN(new Date(offer.expires).valueOf()) ? new Date(offer.expires) : undefined;
  const offerWithOutExpiry = {
    id: offer.id,
    name: offer.name,
    description: offer.desc,
    type: offerType,
    terms: offer.terms,
  };

  const offerRes = expiry ? { ...offerWithOutExpiry, expiry } : offerWithOutExpiry;
  return offerRes;
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

function getLegacyOffersData(id: string, uid: string, bearerToken: string) {
  const legacyOffersUrl = process.env.LEGACY_RETRIEVE_OFFERS_URL;
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
  const apiUrl = `${legacyOffersUrl}?id=${id}&uid=${uid}&bypass=true`;
  logger.info({
    message: 'GET legacy Offers api',
    data: { auth: bearerToken, apiUrl },
  });
  return axios.get<AxiosResponse<LegacyCompanyOffers>>(apiUrl, {
    headers: {
      Authorization: bearerToken,
    },
  });
}
