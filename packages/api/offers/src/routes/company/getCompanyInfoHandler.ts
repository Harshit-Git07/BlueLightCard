import 'reflect-metadata';
import { container } from 'tsyringe';
import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from 'aws-lambda';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { LegacyCompanyOffersResponse } from '../../models/legacy/legacyCompanyOffers';
import { getLegacyUserId } from '../../utils/getLegacyUserIdFromToken';
import { getEnvRaw } from '../../../../core/src/utils/getEnv';
import { CompanyOffersService } from '../../../src/services/CompanyOffersService';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { checkIfEnvironmentVariablesExist } from '../../../src/utils/validation';
import { DI_KEYS } from '../../../src/utils/diTokens';
import { Logger } from '../../../../core/src/utils/logger/logger';

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

  const companyId = (event.pathParameters as APIGatewayProxyEventPathParameters)?.id;
  const authToken = event.headers.Authorization as string;
  const uid = getLegacyUserId(authToken);

  if (!authToken) {
    logger.error({ message: 'Authorization token not set' });
    return Response.Unauthorized({ message: 'Authorization token not set' });
  }

  if (!uid) {
    logger.error({ message: 'uid not set' });
    return Response.Unauthorized({ message: 'uid not set' });
  }

  if (!companyId) {
    logger.error({ message: 'companyId not set' });
    return Response.BadRequest({ message: 'companyId not set' });
  }

  const queryParams = `cid=${companyId}&uid=${uid}`;

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
