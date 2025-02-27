import { createInjector } from 'typed-inject';

import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { PaymentInitiationController } from '@blc-mono/payments/application/controllers/apiGateway/paymentInitiation/PaymentInitiationController';
import { PaymentEventsRepository } from '@blc-mono/payments/application/repositories/PaymentEventsRepository';
import { PaymentEventStoreRepository } from '@blc-mono/payments/application/repositories/PaymentEventStoreRepository';
import { SecretRepository } from '@blc-mono/payments/application/repositories/SecretRepository';
import { StripeRepository } from '@blc-mono/payments/application/repositories/StripeRepository';
import { PaymentInitiationService } from '@blc-mono/payments/application/services/paymentInitiation/PaymentInitiationService';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'payments';
const logger = new LambdaLogger({ serviceName: `${service}-paymentInitiation-post` });
const paymentEventStoreRepository = new PaymentEventStoreRepository(
  getEnv(PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE),
  process.env.REGION ?? 'eu-west-2',
);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)

  // Repositories
  .provideValue(PaymentEventStoreRepository.key, paymentEventStoreRepository)
  .provideClass(PaymentEventsRepository.key, PaymentEventsRepository)
  .provideClass(SecretRepository.key, SecretRepository)
  .provideClass(StripeRepository.key, StripeRepository)

  //API service
  .provideClass(PaymentInitiationService.key, PaymentInitiationService)

  // Controller
  .injectClass(PaymentInitiationController);

/**
 * Handler for a REST API endpoint to initiate a payment
 */
export const handler = controller.invoke;
