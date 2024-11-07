import 'reflect-metadata';
import { container } from 'tsyringe';
import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { LegacyCompanyOffersResponse } from '../../models/legacy/legacyCompanyOffers';
import { getEnvRaw } from '../../../../core/src/utils/getEnv';
import { CompanyOffersService } from '../../../src/services/CompanyOffersService';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { checkIfEnvironmentVariablesExist } from '../../../src/utils/validation';
import { DI_KEYS } from '../../../src/utils/diTokens';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { decodeJWT } from '../../utils/decodeJWT';
import { UserProfile } from '../../services/UserProfile';
import { HttpStatusCode } from '../../../../core/src/types/http-status-code.enum';

let isEnvironmentVariableExist = false;
const service = getEnvRaw('SERVICE');
const blcBaseUrl = getEnvRaw('BASE_URL');
const offersLegacyApiEndpoint = getEnvRaw('LEGACY_OFFERS_API_ENDPOINT');
const logger = new LambdaLogger({ serviceName: `${service}-get-company-info` });
let companyOffersService: CompanyOffersService;

if (checkIfEnvironmentVariablesExist({ service, blcBaseUrl, offersLegacyApiEndpoint }, logger)) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.BlcBaseUrl, { useValue: blcBaseUrl });
  companyOffersService = container.resolve(CompanyOffersService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'get company info handler started' });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }
  
  // Validate Authentication
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

  const companyId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;
 
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
    const data = await companyOffersService.getCompanyInfo<LegacyCompanyOffersResponse>(
      authToken as string,
      offersLegacyApiEndpoint as string,
      queryParams,
      companyId as string,
    );

    if (!data) {
      return Response.NoContent();
    } else {
      return Response.OK({ message: 'Success', data });
    }
  } catch (error: any) {
    logger.error({ message: 'Error fetching company details', body: error });
    return Response.Error(error as Error);
  }
};
