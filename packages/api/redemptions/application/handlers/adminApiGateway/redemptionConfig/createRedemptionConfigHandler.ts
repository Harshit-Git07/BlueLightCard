import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CreateRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/CreateRedemptionConfigController';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { CreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { RedemptionConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { RedemptionVaultConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionVaultConfigTransformer';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-create-redemptionConfig` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(RedemptionVaultConfigTransformer.key, RedemptionVaultConfigTransformer)
  .provideClass(RedemptionConfigTransformer.key, RedemptionConfigTransformer)
  .provideClass(RedemptionConfigRepository.key, RedemptionConfigRepository)
  .provideClass(CreateRedemptionConfigService.key, CreateRedemptionConfigService)
  .injectClass(CreateRedemptionConfigController);

export const handler = controller.invoke;
