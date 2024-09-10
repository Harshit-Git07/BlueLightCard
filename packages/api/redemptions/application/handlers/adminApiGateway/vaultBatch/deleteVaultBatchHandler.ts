import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { DeleteVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/DeleteVaultBatchController';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { DeleteVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/DeleteVaultBatchService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-delete-vaultBatch` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  // Repositories
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  .provideClass(VaultCodesRepository.key, VaultCodesRepository)
  // API Service
  .provideClass(DeleteVaultBatchService.key, DeleteVaultBatchService)
  // Controller
  .injectClass(DeleteVaultBatchController);

export const handler = controller.invoke;
