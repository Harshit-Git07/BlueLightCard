import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CreateRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/CreateRedemptionConfigController';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { CreateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/CreateRedemptionConfigService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-create-redemptionConfig` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  .provideClass(CreateRedemptionConfigService.key, CreateRedemptionConfigService)
  .injectClass(CreateRedemptionConfigController);

export const handler = controller.invoke;
