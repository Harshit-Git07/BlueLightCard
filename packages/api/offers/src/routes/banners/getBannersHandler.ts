import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { BannerService, IBannerService } from '../../../src/services/bannerService';
import {
  BannersIsAgeGatedQueryInput,
  BannersIsAgeGatedQueryInputModel,
} from '../../../src/models/queries-input/bannersIsAgeGatedQueryInput';
import { ZodSchema } from 'zod';
import { validateQueryParams, ValidationResult } from '../../utils/queryParamsValidation';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { container } from 'tsyringe';
import { DI_KEYS } from '../../../src/utils/diTokens';
import { checkIfEnvironmentVariablesExist } from '../../../src/utils/validation';

let isEnvironmentVariableExist = false;
const service = process.env.SERVICE as string;
const tableName: string = process.env.BANNERS_TABLE_NAME as string;
const logger = new LambdaLogger({ serviceName: `${service}-banners-handler` });
container.register(Logger.key, { useValue: logger });
container.register(DI_KEYS.BannersTable, { useValue: tableName });
let bannerService: IBannerService;

if (checkIfEnvironmentVariablesExist({ service, tableName }, logger)) {
  isEnvironmentVariableExist = true;
  container.register(Logger.key, { useValue: logger });
  container.register(DI_KEYS.BannersTable, { useValue: tableName });
  bannerService = container.resolve(BannerService);
}

export const handler = async (event: APIGatewayEvent) => {
  logger.info({ message: 'in getBannersHandler' });

  if (!isEnvironmentVariableExist) {
    return Response.Error(Error('Environment variables not set'));
  }

  const validatedQueryParams: ValidationResult<BannersIsAgeGatedQueryInput> = validateQueryParams(
    BannersIsAgeGatedQueryInputModel as ZodSchema,
    logger,
    event.queryStringParameters,
  );

  if (!validatedQueryParams.result) {
    logger.warn({ message: `Error validating query params`, body: { queryParams: event.queryStringParameters } });
    return Response.BadRequest({ message: `Error validating query params`, error: validatedQueryParams.message });
  }

  const { brandId, type, isAgeGated } = validatedQueryParams.params!;

  try {
    const banners = await bannerService.getBannersByBrandIdAndTypeAndIsAgeGated(brandId, type, isAgeGated);

    logger.info({ message: 'Banners: ' + JSON.stringify(banners) });

    if (!banners) {
      logger.warn({ message: 'getBannersByBrandIdAndTypeAndIsAgeGated returns empty array' });
      return Response.NoContent();
    }

    return Response.OK({
      message: 'successful',
      data: banners,
    });
  } catch (error: any) {
    logger.error({ message: 'Error fetching banners', body: error });
    return Response.Error(error as Error);
  }
};
