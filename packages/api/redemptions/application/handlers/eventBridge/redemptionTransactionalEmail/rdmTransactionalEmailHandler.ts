import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionTransactionalEmailController } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionTransactionalEmail/RedemptionTransactionalEmailController';
import { EmailRepository } from '@blc-mono/redemptions/application/repositories/EmailRepository';
import { EmailService } from '@blc-mono/redemptions/application/services/email/EmailService';
import { BrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const logger = new LambdaLogger({ serviceName: 'redemptions-redemption-transactional-email' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Misc
  .provideClass(SecretsManager.key, SecretsManager)
  // Providers
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  // Repositiories
  .provideClass(EmailRepository.key, EmailRepository)
  // Services
  .provideClass(EmailService.key, EmailService)
  // Controller
  .injectClass(RedemptionTransactionalEmailController);

/**
 * Handler for sending a transactional email for a redemption.
 */
export const handler = controller.invoke;
