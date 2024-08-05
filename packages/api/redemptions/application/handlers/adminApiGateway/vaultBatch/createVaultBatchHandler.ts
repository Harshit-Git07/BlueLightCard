import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CreateVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/CreateVaultBatchController';
import { CreateVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/CreateVaultBatchService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-create-vaultBatch` });

/**
 * this is a stub
 * TODO: this will require DatabaseConnection, TransactionManager, Repository(s), etc
 */
const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideClass(CreateVaultBatchService.key, CreateVaultBatchService)
  .injectClass(CreateVaultBatchController);

export const handler = controller.invoke;
