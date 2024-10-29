import { createInjector } from 'typed-inject';

import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { StripeEventsController } from '@blc-mono/payments/application/controllers/eventBridge/paymentEvents/stripeEventsController';
import { PaymentEventsRepository } from '@blc-mono/payments/application/repositories/PaymentEventsRepository';
import { PaymentEventStoreRepository } from '@blc-mono/payments/application/repositories/PaymentEventStoreRepository';
import { SecretRepository } from '@blc-mono/payments/application/repositories/SecretRepository';
import { StripeRepository } from '@blc-mono/payments/application/repositories/StripeRepository';
import { PaymentEventHandlerService } from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsHandlerService';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'payments';
const logger = new LambdaLogger({ serviceName: `${service}-stripe-events-handler` });
const paymentEventStoreRepository = new PaymentEventStoreRepository(
  getEnv(PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE),
  process.env.REGION ?? 'eu-west-2',
);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  //repositories
  .provideValue(PaymentEventStoreRepository.key, paymentEventStoreRepository)
  .provideClass(SecretRepository.key, SecretRepository)
  .provideClass(StripeRepository.key, StripeRepository)
  .provideClass(PaymentEventsRepository.key, PaymentEventsRepository)
  //service
  .provideClass(PaymentEventHandlerService.key, PaymentEventHandlerService)
  // Controller
  .injectClass(StripeEventsController);

/**
 * Handler for event bridge event when a vault is updated.
 */
export const handler = controller.invoke;
