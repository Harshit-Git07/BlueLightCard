import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { OfferUpdatedController } from '@blc-mono/redemptions/application/controllers/eventBridge/offer/OfferUpdatedController';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { OfferUpdatedService } from '@blc-mono/redemptions/application/services/dataSync/offer/OfferUpdatedService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-updated-offer` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  // Repositories
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  .provideClass(GenericsRepository.key, GenericsRepository)
  // API Service
  .provideClass(OfferUpdatedService.key, OfferUpdatedService)
  // Controller
  .injectClass(OfferUpdatedController);

/**
 * Handler for event bridge event when an offer is updated.
 */
export const handler = controller.invoke;
