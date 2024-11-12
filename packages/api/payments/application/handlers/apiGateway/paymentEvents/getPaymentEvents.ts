import { createInjector } from 'typed-inject';

import { getEnv, getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { PaymentEventsController } from '@blc-mono/payments/application/controllers/apiGateway/paymentEvents/PaymentEventsController';
import { PaymentEventStoreRepository } from '@blc-mono/payments/application/repositories/PaymentEventStoreRepository';
import { PaymentEventsService } from '@blc-mono/payments/application/services/paymentEvents/PaymentEventsService';
import { PaymentsStackEnvironmentKeys } from '@blc-mono/payments/infrastructure/constants/environment';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'payments';
const logger = new LambdaLogger({ serviceName: `${service}-paymentEvents-get` });
const paymentEventStoreRepository = new PaymentEventStoreRepository(
  getEnv(PaymentsStackEnvironmentKeys.TRANSACTIONS_EVENTS_TABLE),
  process.env.REGION ?? 'eu-west-2',
);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)

  // Repositories
  .provideValue(PaymentEventStoreRepository.key, paymentEventStoreRepository)

  //API service
  .provideClass(PaymentEventsService.key, PaymentEventsService)

  // Controller
  .injectClass(PaymentEventsController);

/**
 * Handler for a REST API endpoint to query payment events
 */
export const handler = controller.invoke;
