import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { GetRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/GetRedemptionConfigController';
import { GetRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/GetRedemptionConfigService';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-get-redemption` });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)

  // API Service
  .provideClass(GetRedemptionConfigService.key, GetRedemptionConfigService)

  .injectClass(GetRedemptionConfigController);

export const handler = controller.invoke;
