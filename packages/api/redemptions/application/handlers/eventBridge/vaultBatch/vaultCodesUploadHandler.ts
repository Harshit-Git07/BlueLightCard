import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultCodesUploadController } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultCodesUploadController';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { VaultCodesUploadService } from '@blc-mono/redemptions/application/services/vaultBatch/VaultCodesUploadService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-vault-codes-upload` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  // Repositories
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  .provideClass(VaultCodesRepository.key, VaultCodesRepository)
  // API Service
  .provideClass(VaultCodesUploadService.key, VaultCodesUploadService)
  // Controller
  .injectClass(VaultCodesUploadController);

/**
 * Handler for event bridge event when vault codes are uploaded to S3.
 */
export const handler = controller.invoke;
