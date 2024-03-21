import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { HttpStatusCode } from '../../../../core/src/types/http-status-code.enum';
import { LegacyOffers } from '../../models/legacy/legacyOffers';
import { LegacyCompanyOffers } from '../../models/legacy/legacyCompanyOffers';
import { Offer, OfferModel } from '../../models/offers';
import { API_SOURCE, ENVIRONMENTS, LegacyAPIEndPoints } from '../../utils/global-constants';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';
import { FirehoseDeliveryStream } from '../../../../core/src/utils/firehose';
import { isDev } from '../../../../core/src/utils/checkEnvironment';
import { getOfferDetail } from '../../utils/parseLegacyOffers';
import { LegacyAPIService } from '../../services/legacyAPIService';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-offers-get` });
const stage = (process.env.STAGE ?? 'dev') as ENVIRONMENTS;
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
    logger.error({ message: 'Error fetching offer', data: error });
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
    }) as Offer;

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

function validateOffersResponse(offer: Offer): Offer | Response {
  const result = OfferModel.safeParse(offer);
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

function getLegacyOffersData(id: string, uid: string, token: string) {
  const legacyAPIService = new LegacyAPIService({ stage, token, logger });
  return legacyAPIService.get<LegacyCompanyOffers>(LegacyAPIEndPoints.RETRIEVE_OFFERS, `id=${id}&uid=${uid}`);
}
