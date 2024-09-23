import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { UpdateRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import { UpdateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfig';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-update-redemptionConfig` });

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideClass(UpdateRedemptionConfigService.key, UpdateRedemptionConfigService)
  .injectClass(UpdateRedemptionConfigController);

export const handler = controller.invoke;
