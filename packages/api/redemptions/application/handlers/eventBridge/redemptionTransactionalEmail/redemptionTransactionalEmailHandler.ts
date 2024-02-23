import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionTransactionalEmailController } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';

const logger = new LambdaLogger({ serviceName: 'redemptions-redemption-transactional-email' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Controller
  .injectClass(RedemptionTransactionalEmailController);

/**
 * Handler for sending a transactional email for a redemption.
 */
export const handler = controller.invoke;
