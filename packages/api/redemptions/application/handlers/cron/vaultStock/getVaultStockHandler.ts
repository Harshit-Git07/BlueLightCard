import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { GetVaultStockController } from '@blc-mono/redemptions/application/controllers/cron/vaultStock/GetVaultStockController';
import { GetVaultStockService } from '@blc-mono/redemptions/application/services/vaultStock/GetVaultStockService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-getVaultStock` });

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideClass(GetVaultStockService.key, GetVaultStockService)
  .injectClass(GetVaultStockController);

export const handler = controller.invoke;
