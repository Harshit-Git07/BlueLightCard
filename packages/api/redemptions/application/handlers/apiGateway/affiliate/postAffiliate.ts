import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { AffiliateController } from '@blc-mono/redemptions/application/controllers/apiGateway/affiliate/AffiliateController';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-affiliate-post` });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Controller
  .injectClass(AffiliateController);

/**
 * Handler for a REST API endpoint to redeem an offer.
 */
export const handler = controller.invoke;
