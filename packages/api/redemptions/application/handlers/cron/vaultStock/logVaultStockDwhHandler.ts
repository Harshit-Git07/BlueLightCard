import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { LogVaultStockDwhController } from '@blc-mono/redemptions/application/controllers/cron/vaultStock/LogVaultStockDwhController';
import { DwhRepository } from '@blc-mono/redemptions/application/repositories/DwhRepository';
import { VaultStockRepository } from '@blc-mono/redemptions/application/repositories/VaultStockRepository';
import { LogVaultStockDwhService } from '@blc-mono/redemptions/application/services/vaultStock/LogVaultStockDwhService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-getVaultStock` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_ONLY);

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(VaultStockRepository.key, VaultStockRepository)
  .provideClass(DwhRepository.key, DwhRepository)
  .provideClass(LogVaultStockDwhService.key, LogVaultStockDwhService)
  .injectClass(LogVaultStockDwhController);

export const handler = controller.invoke;
