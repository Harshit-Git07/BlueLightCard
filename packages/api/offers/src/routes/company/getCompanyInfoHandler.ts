import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import axios, { AxiosResponse } from 'axios';
import { HttpStatusCode } from '@blc-mono/core/src/types/http-status-code.enum';
import { LegacyCompanyOffers } from '../../models/legacy/legacyCompanyOffers';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';
import { CompanyInfo, CompanyInfoModel } from '../../models/companyInfo';
import { getEnv } from '../../../../core/src/utils/getEnv';

const service: string = getEnv('service');
const logger = new Logger({ serviceName: `${service}-get-details` });
const legacyOffersUrl = getEnv('LEGACY_RETRIEVE_OFFERS_URL');

export const handler = async (event: APIGatewayEvent) => {
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
    logger.error({ message: 'Error fetching company details', data: error });
    return error;
  }
};

async function getDetailFromLegacy(id: string, uid: string, bearerToken: string): Promise<Response> {
  try {
    const { data: legacyAPIResponse } = await getDataFromLegacyAPI(id, uid, bearerToken);
    logger.info({ message: 'Output received from retrieve offers API.' }); // not logging response as it may be large.

    if (!legacyAPIResponse.data || Number(id) !== legacyAPIResponse.data?.id) {
      logger.error({ message: 'Company id mismatch' });
      return Response.NotFound({ message: 'Company not found', data: {} });
    }

    // company name is mendatory in legacy code, so expecting we will always have a value for it
    const companyInfoResponse = validateOffersResponse({
      id: legacyAPIResponse.data.id,
      name: legacyAPIResponse.data.name,
      description: legacyAPIResponse.data.summary ?? '',
    });

    return Response.OK({ message: 'Success', data: companyInfoResponse });
  } catch (error) {
    logger.error({ message: 'Error fetching details from legacy API', data: error });
    return Response.Error(error as Error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

function validateOffersResponse(company: CompanyInfo): CompanyInfo {
  const result = CompanyInfoModel.safeParse(company);
  if (result.success) {
    return company;
  } else {
    logger.error(`Error validating company info  output ${result.error}`);
    throw new Error('Error validating company info output');
  }
}

// we get this data from offer/retrieve.php so it remains same
function getDataFromLegacyAPI(id: string, uid: string, bearerToken: string) {
  if (!legacyOffersUrl) {
    logger.error({ message: 'Legacy API Url not set' });
    throw new Error('Legacy API Url not set');
  }
  const apiUrl = `${legacyOffersUrl}?cid=${id}&uid=${uid}&bypass=true`;
  logger.info({
    message: 'GET legacy Offers api',
    data: { apiUrl },
  });
  return axios.get<AxiosResponse<LegacyCompanyOffers>>(apiUrl, {
    headers: {
      Authorization: bearerToken,
    },
  });
}
