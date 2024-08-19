import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultBatchCreatedController } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultBatchCreatedController';
import { AdminEmailRepository } from '@blc-mono/redemptions/application/repositories/AdminEmailRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { VaultBatchCreatedService } from '@blc-mono/redemptions/application/services/vaultBatch/VaultBatchCreatedService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-vault-batch-created` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_ONLY);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Providers - AWS SES email
  .provideClass(SesClientProvider.key, SesClientProvider)
  // Repositories
  .provideClass(AdminEmailRepository.key, AdminEmailRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  // Service
  .provideClass(VaultBatchCreatedService.key, VaultBatchCreatedService)
  // Controller
  .injectClass(VaultBatchCreatedController);

/**
 * Handler for event bridge event when a vault batch is created.
 */
export const handler = controller.invoke;
