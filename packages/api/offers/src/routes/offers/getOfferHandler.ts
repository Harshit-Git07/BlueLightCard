import 'reflect-metadata';
import { container } from 'tsyringe';
import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { HttpStatusCode } from '../../../../core/src/types/http-status-code.enum';
import { LegacyCompanyOffersResponse } from '../../models/legacy/legacyCompanyOffers';
import { CompanyOffersService, ICompanyOffersService } from '../../services/CompanyOffersService';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { getEnvRaw } from '../../../../core/src/utils/getEnv';
import { checkIfEnvironmentVariablesExist } from '../../utils/validation';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { DI_KEYS } from '../../utils/diTokens';
import { decodeJWT } from '../../utils/decodeJWT';

let isEnvironmentVariableExist = false;
const service = getEnvRaw('SERVICE');
const blcBaseUrl = getEnvRaw('BASE_URL');
const offersLegacyApiEndpoint = getEnvRaw('LEGACY_OFFERS_API_ENDPOINT');
const logger = new LambdaLogger({ serviceName: `${service}-get-offer-detail` });
let companyOffersService: ICompanyOffersService;
const stage = getEnvRaw('STAGE') as string;

if (
  checkIfEnvironmentVariablesExist({ service, blcBaseUrl, offersLegacyApiEndpoint, stage }, logger)
) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.BlcBaseUrl, { useValue: blcBaseUrl });
  companyOffersService = container.resolve(CompanyOffersService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'get offer handler started' });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }

  // Get Offer data
  const offerId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;

  if (!offerId) {
    logger.error({ message: 'offerId not set' });
    return Response.BadRequest({ message: 'offerId not set' });
  }

  const authToken = event.headers.Authorization as string;
  let decodedToken;

  try {
    decodedToken = decodeJWT(authToken, logger);
  } catch (error: any) {
    return Response.Unauthorized({ message: error.message });
  }

  const { "custom:blc_old_id": uid} = decodedToken;
  if(!uid) {
    logger.error({message: 'UID missing from JWT when required.'});
    return Response.Unauthorized({ message: "Missing required information" });
  }

  const queryParams = `id=${offerId}&uid=${uid}`;

  try {
    const data = await companyOffersService.getOfferById<LegacyCompanyOffersResponse>(
      authToken as string,
      offersLegacyApiEndpoint as string,
      queryParams,
      offerId as string,
    );

    if (!data) {
      return Response.NotFound({ message: 'Offer not found' });
    }

    return Response.OK({ message: 'Success', data });
  } catch (error: any) {
    logger.error({ message: 'Error fetching offer', body: error });
    return Response.Error(error as Error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
