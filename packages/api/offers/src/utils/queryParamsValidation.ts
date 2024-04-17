import { ZodError, ZodSchema } from 'zod';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

/**
 * A generic type for query validation result
 */
export type ValidationResult<T> = {
  params?: T;
  result: boolean;
  message?: ZodError | string;
};

/**
 * a generic method to validate query params base of zod schema
 * @param schema
 * @param logger
 * @param queryParams
 */
export function validateQueryParams<T>(
  schema: ZodSchema<T>,
  logger: LambdaLogger,
  queryParams?: T,
): ValidationResult<T> {
  if (queryParams) {
    const result = schema.safeParse(queryParams);
    if (result.success) {
      return {
        params: result.data,
        result: result.success,
      };
    } else {
      logger.warn({ message: `Error validating query input`, body: { error: result.error } });
      return { result: false, message: result.error };
    }
  } else {
    logger.warn({ message: `Query params are empty`, body: { queryParams } });
    return { result: false, message: 'One or more of parameters are empty' };
  }
}
