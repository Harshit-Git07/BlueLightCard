import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { GetRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/GetRedemptionConfigController';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { GetRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/GetRedemptionConfigService';
import { RedemptionConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { RedemptionVaultConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionVaultConfigTransformer';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-get-redemption` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_ONLY);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)

  // Repositories
  .provideClass(RedemptionConfigRepository.key, RedemptionConfigRepository)
  .provideClass(GenericsRepository.key, GenericsRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)

  // Transformers
  .provideClass(RedemptionVaultConfigTransformer.key, RedemptionVaultConfigTransformer)
  .provideClass(RedemptionConfigTransformer.key, RedemptionConfigTransformer)

  // API Service
  .provideClass(GetRedemptionConfigService.key, GetRedemptionConfigService)

  .injectClass(GetRedemptionConfigController);

export const handler = controller.invoke;
