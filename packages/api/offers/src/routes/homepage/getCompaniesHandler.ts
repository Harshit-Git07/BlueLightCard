import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';
import process from 'node:process';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { container } from 'tsyringe';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { DI_KEYS } from '../../utils/diTokens';
import { IOffersHomepageService, OffersHomepageService } from '../../services/offersHomepageService';
import { Response } from '../../../../core/src/utils/restResponse/response';
import {
  HomepageMenuQueryParams,
  HomepageMenuQueryParamsModel,
} from '../../models/queryParams/homepageMenuQueryParams';
import { ZodSchema } from 'zod';
import { TYPE_KEYS } from '../../utils/global-constants';
import { checkIfEnvironmentVariablesExist } from '../../utils/validation';
import { validateQueryParams, ValidationResult } from '../../utils/queryParamsValidation';

let isEnvironmentVariableExist = false;
const service = process.env.SERVICE as string;
const logger = new LambdaLogger({ serviceName: `${service}-homepage-company-handler` });
const tableName = process.env.OFFER_HOMEPAGE_TABLE_NAME as string;
let iOfferHomepageService: IOffersHomepageService;

if (checkIfEnvironmentVariablesExist({ service, tableName }, logger)) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.OffersHomePageTable, { useValue: tableName });
  iOfferHomepageService = container.resolve(OffersHomepageService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'get homepage company handler started', body: event.queryStringParameters });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }

  const validatedQueryParams: ValidationResult<HomepageMenuQueryParams> = validateQueryParams(
    HomepageMenuQueryParamsModel as ZodSchema,
    logger,
    event.queryStringParameters,
  );

  if (!validatedQueryParams.result) {
    logger.warn({ message: `Error validating query params`, body: { queryParams: event.queryStringParameters } });
    return Response.BadRequest({ message: `Error validating query params`, error: validatedQueryParams.message });
  }

  const { brand, isAgeGated } = validatedQueryParams.params!;

  try {
    const result = await iOfferHomepageService.getCompanyMenu(brand, TYPE_KEYS.COMPANIES, isAgeGated);
    if (result) {
      return Response.OK({ message: 'successful', data: { companies: result } });
    } else {
      logger.error({ message: 'No company found' });
      return Response.NoContent({ message: 'No company found' });
    }
  } catch (error) {
    logger.error({ message: 'Error getting companies', body: error });
    return Response.Error(error as Error);
  }
};
