import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { GetVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/GetVaultBatchController';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import GetVaultBatchService from '@blc-mono/redemptions/application/services/vault/GetVaultBatchService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-get-vaultBatch` });

const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(SecretsManager.key, SecretsManager)
  // Repositories
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  // API Service
  .provideClass(GetVaultBatchService.key, GetVaultBatchService)

  .injectClass(GetVaultBatchController);

export const handler = controller.invoke;
