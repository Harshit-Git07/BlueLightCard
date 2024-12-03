import 'reflect-metadata';
import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { getEnvRaw } from '../../../../../core/src/utils/getEnv';
import { CompanyOffersService } from '../../../services/CompanyOffersService';
import { LambdaLogger } from '../../../../../core/src/utils/logger/lambdaLogger';
import { checkIfEnvironmentVariablesExist } from '../../../utils/validation';
import { DI_KEYS } from '../../../utils/diTokens';
import { Logger } from '../../../../../core/src/utils/logger/logger';
import { container } from 'tsyringe';
import { decodeJWT } from '../../../utils/decodeJWT';
import { UserProfile } from '../../../services/UserProfile';
import { HttpStatusCode } from '../../../../../core/src/types/http-status-code.enum';

let isEnvironmentVariableExist = false;
const service = getEnvRaw('SERVICE');
const blcBaseUrl = getEnvRaw('BASE_URL');
const offersLegacyApiEndpoint = getEnvRaw('LEGACY_OFFERS_API_ENDPOINT');
const logger = new LambdaLogger({ serviceName: `${service}-get-company-offers-details` });
let companyOffersService: CompanyOffersService;

if (checkIfEnvironmentVariablesExist({ service, blcBaseUrl, offersLegacyApiEndpoint }, logger)) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.BlcBaseUrl, { useValue: blcBaseUrl });
  companyOffersService = container.resolve(CompanyOffersService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'get company offers handler started' });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }
  //process API gateway event

  // Validate Authentication
  const authToken = event.headers.Authorization as string;
  let decodedToken;

  try {
    decodedToken = decodeJWT(authToken, logger);
  } catch (error: any) {
    return Response.Unauthorized({ message: error.message });
  }
  const { 'custom:blc_old_id': uid } = decodedToken;

  if (!uid) {
    logger.error({ message: 'UID missing from JWT when required.' });
    return Response.Unauthorized({ message: 'Missing required information' });
  }

  // Get company id
  const companyId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;

  if (!companyId) {
    logger.error({ message: 'companyId not set' });
    return Response.BadRequest({ message: 'companyId not set' });
  }

  let serviceParams = '';

  try {
    const userProfile = new UserProfile(authToken);
    const userProfileData = await userProfile.getUserProfileRequest();
    if(userProfileData?.data?.data?.profile?.organisation) {
      serviceParams = `&service=${userProfileData.data.data.profile.organisation}`; 
    } else {
      serviceParams = `&service=`;
    }
  } catch (error: any) {
    logger.error({ message: 'Error fetching user profile', body: error });
    logger.error({ message: 'Error fetching company details', body: error });
    return Response.Error(error as Error, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }

  const queryParams = `cid=${companyId}&uid=${uid}${serviceParams}`;

  try {
    const data = await companyOffersService.getCompanyOffers(
      authToken as string,
      offersLegacyApiEndpoint as string,
      queryParams,
      companyId as string,
    );

    if (!data || data.offers.length === 0) {
      return Response.NotFound({ message: 'No offers found' });
    }

    return Response.OK({ message: 'Success', data });
  } catch (error: any) {
    logger.error({ message: 'Error fetching company offer details', body: error });
    return Response.Error(error as Error);
  }
};
