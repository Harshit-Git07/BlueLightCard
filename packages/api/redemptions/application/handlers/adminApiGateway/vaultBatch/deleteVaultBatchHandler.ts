import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { DeleteVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/DeleteVaultBatchController';
import { DeleteVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/DeleteVaultBatchService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-delete-vaultBatch` });

/**
 * this is a stub
 * TODO: this will require DatabaseConnection, TransactionManager, Repository(s), etc
 */
const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideClass(DeleteVaultBatchService.key, DeleteVaultBatchService)
  .injectClass(DeleteVaultBatchController);

export const handler = controller.invoke;
