import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultCodesUploadController } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultCodesUploadController';
import { RedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultCodesUploadService } from '@blc-mono/redemptions/application/services/vaultBatch/VaultCodesUploadService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { S3ClientProvider } from '@blc-mono/redemptions/libs/storage/S3ClientProvider';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-vault-codes-upload` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Repositories
  .provideClass(VaultCodesRepository.key, VaultCodesRepository)
  .provideClass(RedemptionsEventsRepository.key, RedemptionsEventsRepository)
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  // Providers
  .provideClass(S3ClientProvider.key, S3ClientProvider)
  // API Service
  .provideClass(VaultCodesUploadService.key, VaultCodesUploadService)
  // Controller
  .injectClass(VaultCodesUploadController);

/**
 * Handler for event bridge event when vault codes are uploaded to S3.
 */
export const handler = controller.invoke;
