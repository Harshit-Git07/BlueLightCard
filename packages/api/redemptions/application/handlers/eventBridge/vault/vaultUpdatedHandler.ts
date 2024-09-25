import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultUpdatedController } from '@blc-mono/redemptions/application/controllers/eventBridge/vault/VaultUpdatedController';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { VaultService } from '@blc-mono/redemptions/application/services/vault/VaultService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-updated-vault` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  // Repositories
  .provideClass(RedemptionConfigRepository.key, RedemptionConfigRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  // API Service
  .provideClass(VaultService.key, VaultService)
  // Controller
  .injectClass(VaultUpdatedController);

/**
 * Handler for event bridge event when a vault is updated.
 */
export const handler = controller.invoke;
