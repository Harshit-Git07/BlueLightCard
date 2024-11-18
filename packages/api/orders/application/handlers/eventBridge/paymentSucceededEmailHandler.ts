import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';

import { PaymentSucceededEmailController } from '../../controllers/eventBridge/paymentResultEmailControllers/PaymentSucceededEmailController';
import { BrazeEmailClientProvider } from '../../repositories/BrazeEmailClientProvider';
import { EmailRepository } from '../../repositories/EmailRepository';
import { SecretRepository } from '../../repositories/SecretRepository';
import { EmailService } from '../../services/email/EmailService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'orders';
const logger = new LambdaLogger({ serviceName: `${service}-checkout-post` });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)

  // Repositories
  .provideClass(SecretRepository.key, SecretRepository)
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  .provideClass(EmailRepository.key, EmailRepository)

  //API service
  .provideClass(EmailService.key, EmailService)

  // Controller
  .injectClass(PaymentSucceededEmailController);

/**
 * Handler for a REST API endpoint to create a checkout
 */
export const handler = controller.invoke;
