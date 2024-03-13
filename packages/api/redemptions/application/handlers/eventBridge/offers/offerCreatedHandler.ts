import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { OfferCreatedController } from '@blc-mono/redemptions/application/controllers/eventBridge/offer/OfferCreatedController';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { OfferCreatedService } from '@blc-mono/redemptions/application/services/dataSync/offer/OfferCreatedService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-created-offer` });
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
  .provideClass(OfferCreatedService.key, OfferCreatedService)
  // Controller
  .injectClass(OfferCreatedController);

/**
 * Handler for event bridge event when an offer is created.
 */
export const handler = controller.invoke;
