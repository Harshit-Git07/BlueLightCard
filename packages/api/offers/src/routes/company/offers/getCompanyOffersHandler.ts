import 'reflect-metadata';
import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { LegacyCompanyOffersResponse } from '../../../models/legacy/legacyCompanyOffers';
import { getEnvRaw } from '../../../../../core/src/utils/getEnv';
import {
  CompanyOffersService,
  ICompanyOffersService,
} from '../../../services/CompanyOffersService';
import { LambdaLogger } from '../../../../../core/src/utils/logger/lambdaLogger';
import { checkIfEnvironmentVariablesExist } from '../../../utils/validation';
import { DI_KEYS } from '../../../utils/diTokens';
import { Logger } from '../../../../../core/src/utils/logger/logger';
import { container } from 'tsyringe';
import { decodeJWT } from '../../../utils/decodeJWT';

let isEnvironmentVariableExist = false;
const service = getEnvRaw('SERVICE');
const blcBaseUrl = getEnvRaw('BASE_URL');
const offersLegacyApiEndpoint = getEnvRaw('LEGACY_OFFERS_API_ENDPOINT');
const logger = new LambdaLogger({ serviceName: `${service}-get-company-offers-details` });
let companyOffersService: ICompanyOffersService;

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
  const { "custom:blc_old_id": uid} = decodedToken;

  if(!uid) {
    logger.error({message: 'UID missing from JWT when required.'});
    return Response.Unauthorized({ message: "Missing required information" });
  }
  
  // Get company id
  const companyId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;
  
  if (!companyId) {
    logger.error({ message: 'companyId not set' });
    return Response.BadRequest({ message: 'companyId not set' });
  }

  const queryParams = `cid=${companyId}&uid=${uid}`;

  try {
    const data = await companyOffersService.getCompanyOffers<LegacyCompanyOffersResponse>(
      authToken as string,
      offersLegacyApiEndpoint as string,
      queryParams,
      companyId as string,
    );

    if (!data) {
      return Response.NotFound({ message: 'No offers found' });
    }

    return Response.OK({ message: 'Success', data });
  } catch (error: any) {
    logger.error({ message: 'Error fetching company offer details', body: error });
    return Response.Error(error as Error);
  }
};
