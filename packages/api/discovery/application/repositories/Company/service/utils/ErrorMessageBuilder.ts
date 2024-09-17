import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';

export function buildErrorMessage(logger: LambdaLogger, error: unknown, message: string): string {
  logger.error({ message, body: error });
  return `${message}: [${error}]`;
}
