import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { HttpStatusCode } from '@blc-mono/core/src/types/http-status-code.enum';
import { LegacyCompanyOffers } from '../../../models/legacy/legacyCompanyOffers';
import { getLegacyUserId } from '../../../utils/getLegacyUserIdFromToken';
import { CompanyOffers, CompanyOffersModel } from '../../../models/companyOffers';
import { getEnv } from '../../../../../core/src/utils/getEnv';
import { LegacyOffers } from '../../../models/legacy/legacyOffers';
import { ENVIRONMENTS, LegacyAPIEndPoints } from '../../../utils/global-constants';
import { LegacyAPIService } from '../../../services/legacyAPIService';
import { getOfferDetail } from '../../../utils/parseLegacyOffers';

const service: string = getEnv('service');
const logger = new Logger({ serviceName: `${service}-get-details` });
const stage = (process.env.STAGE ?? 'dev') as ENVIRONMENTS;

export const handler = async (event: APIGatewayEvent) => {
  //process API gateway event
  try {
    const companyId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;
    const authToken = event.headers.Authorization as string;
    if (!authToken) {
      logger.error({ message: 'Authorization token not set' });
      return Response.Unauthorized({ message: 'Authorization token not set' });
    }
    const uid = getLegacyUserId(authToken);

    if (!companyId) {
      logger.error({ message: 'companyId not set' });
      return Response.NotFound({ message: 'companyId not set' });
    }

    return getDetailFromLegacy(companyId as string, uid, event.headers.Authorization as string);
  } catch (error: any) {
    logger.error({ message: 'Error fetching company offer details', data: error });
    return error;
  }
};

async function getDetailFromLegacy(id: string, uid: string, bearerToken: string): Promise<Response> {
  try {
    const { data: legacyAPIResponse } = await getDataFromLegacyAPI(id, uid, bearerToken);
    logger.info({ message: 'Output received from retrieve offers API.', data: legacyAPIResponse }); // not logging response as it may be large.

    if (!legacyAPIResponse.data || Number(id) !== legacyAPIResponse.data?.id) {
      logger.error({ message: 'Company id mismatch' });
      return Response.NotFound({ message: 'Company not found', data: {} });
    }

    if (!(legacyAPIResponse.data.offers.length > 0)) {
      logger.error({ message: 'Company offers not found' });
      return Response.NoContent();
    }

    // company name is mandatory in legacy code, so expecting we will always have a value for it
    const companyInfoResponse = validateOffersResponse({
      offers: legacyAPIResponse.data.offers.map((offer: LegacyOffers) => getOfferDetail(offer)),
    });

    return Response.OK({ message: 'Success', data: companyInfoResponse });
  } catch (error) {
    logger.error({ message: 'Error fetching details from legacy API', data: error });
    return Response.Error(error as Error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

function validateOffersResponse(company: CompanyOffers): CompanyOffers {
  const result = CompanyOffersModel.safeParse(company);
  if (result.success) {
    return company;
  } else {
    logger.error(`Error validating company info output ${result.error}`);
    throw new Error('Error validating company info output');
  }
}

function getDataFromLegacyAPI(id: string, uid: string, token: string) {
  const legacyAPIService = new LegacyAPIService({ stage, token, logger });
  return legacyAPIService.get<LegacyCompanyOffers>(LegacyAPIEndPoints.RETRIEVE_OFFERS, `cid=${id}&uid=${uid}`);
}
