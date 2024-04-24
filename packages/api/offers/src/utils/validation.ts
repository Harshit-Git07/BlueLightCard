import { BLC_AUS, BLC_UK, DDS_UK } from './global-constants';
import { Logger } from '@aws-lambda-powertools/logger';
import {
  OfferRestrictionQueryInput,
  OfferRestrictionQueryInputModel,
} from '../models/queries-input/offerRestrictionQueryInput';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ZodSchema } from 'zod';

export function validateBrand(brandId: string) {
  return !(!brandId || ![BLC_UK, BLC_AUS, DDS_UK].includes(brandId));
}

export function validateOfferRestrictionInput(payload: any, logger: Logger) {
  const result = OfferRestrictionQueryInputModel.safeParse(payload);
  if (result.success) {
    return payload as OfferRestrictionQueryInput;
  } else {
    logger.error(`Error validating homepage query input ${result.error}`);
    throw new Error(`Error validating homepage query input ${result.error}`);
  }
}

export function checkIfEnvironmentVariablesExist(
  envs: { [key: string]: string | undefined },
  logger: LambdaLogger,
): boolean {
  for (const [key, value] of Object.entries(envs)) {
    if (!value) {
      logger.error({ message: `Environment variable ${key} is not set` });
      return false;
    }
  }
  return true;
}

export function validateByZodSafeParse<T>(schema: ZodSchema<T>, data: T, logger: LambdaLogger): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    logger.error({ message: `Error validating the data ${result.error}` });
    throw new Error('Error validating data info output');
  }
}
