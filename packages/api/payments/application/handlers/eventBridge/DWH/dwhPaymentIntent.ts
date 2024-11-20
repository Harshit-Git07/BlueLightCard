import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';

import { DwhPaymentIntentController } from '../../../controllers/eventBridge/DWH/dwhPaymentIntentController';
import { DwhRepository } from '../../../repositories/DwhRepository';
import { DwhLoggingService } from '../../../services/DWH/dwhLoggingService';

const logger = new LambdaLogger({ serviceName: 'payments-dwh-payment-intent' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Repositories
  .provideClass(DwhRepository.key, DwhRepository)
  // Service
  .provideClass(DwhLoggingService.key, DwhLoggingService)
  // Controller
  .injectClass(DwhPaymentIntentController);

export const handler = controller.invoke;
