import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultBatchCreatedController } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultBatchCreatedController';
import { VaultBatchService } from '@blc-mono/redemptions/application/services/email/AdminEmailService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-vault-batch-created` });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Repositories
  //todo: this a stub and will require further dev: https://bluelightcard.atlassian.net/browse/TR-630
  // API Service
  .provideClass(VaultBatchService.key, VaultBatchService)
  // Controller
  .injectClass(VaultBatchCreatedController);

/**
 * Handler for event bridge event when a vault batch is created.
 */
export const handler = controller.invoke;
