import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { UpdateVaultBatchController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/vaultBatch/UpdateVaultBatchController';
import { UpdateVaultBatchService } from '@blc-mono/redemptions/application/services/vaultBatch/UpdateVaultBatchService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-update-vaultBatch` });

/**
 * this is a stub
 * TODO: this will require DatabaseConnection, TransactionManager, Repository(s), etc
 */
const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideClass(UpdateVaultBatchService.key, UpdateVaultBatchService)
  .injectClass(UpdateVaultBatchController);

export const handler = controller.invoke;
