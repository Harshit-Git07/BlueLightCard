import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { container } from 'tsyringe';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { IOffersHomepageService, OffersHomepageService } from '../../services/offersHomepageService';
import { TYPE_KEYS } from '../../utils/global-constants';
import { DI_KEYS } from '../../utils/diTokens';
import { checkIfEnvironmentVariablesExist, validateBrand } from '../../utils/validation';

let isEnvironmentVariableExist = false;
const service = process.env.SERVICE as string;
const tableName = process.env.OFFER_HOMEPAGE_TABLE_NAME as string;
const logger = new LambdaLogger({ serviceName: `${service}-homepage-categories-handler` });
let iOffersHomepageService: IOffersHomepageService;

if (checkIfEnvironmentVariablesExist({ service, tableName }, logger)) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.OffersHomePageTable, { useValue: tableName });
  iOffersHomepageService = container.resolve(OffersHomepageService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'get homepage categories handler started', body: event.queryStringParameters });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }

  const brand = event.queryStringParameters?.brand;

  if (!brand || !validateBrand(brand)) {
    logger.warn({ message: `Brand query param is empty`, body: { brand } });
    return Response.BadRequest({ message: 'Brand is invalid' });
  }

  try {
    const result = await iOffersHomepageService.getCategoryMenu(brand, TYPE_KEYS.CATEGORIES);
    if (result) {
      logger.info({ message: 'Categories fetched', body: result });
      return Response.OK({ message: 'successful', data: { categories: result } });
    } else {
      logger.error({ message: 'No categories found' });
      return Response.NoContent({ message: 'No categories found' });
    }
  } catch (error) {
    logger.error({ message: 'Error getting categories', body: error });
    return Response.Error(error as Error);
  }
};
