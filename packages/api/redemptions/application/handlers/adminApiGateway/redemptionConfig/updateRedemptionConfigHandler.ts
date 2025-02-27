import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { UpdateRedemptionConfigController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import { BallotsRepository } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { UpdateRedemptionConfigService } from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';
import { RedemptionBallotConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionBallotConfigTransformer';
import { RedemptionConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionConfigTransformer';
import { RedemptionVaultConfigTransformer } from '@blc-mono/redemptions/application/transformers/RedemptionVaultConfigTransformer';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-update-redemptionConfig` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(TransactionManager.key, TransactionManager)
  .provideClass(RedemptionConfigRepository.key, RedemptionConfigRepository)
  .provideClass(BallotsRepository.key, BallotsRepository)
  .provideClass(GenericsRepository.key, GenericsRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  .provideClass(VaultBatchesRepository.key, VaultBatchesRepository)
  .provideClass(RedemptionVaultConfigTransformer.key, RedemptionVaultConfigTransformer)
  .provideClass(RedemptionBallotConfigTransformer.key, RedemptionBallotConfigTransformer)
  .provideClass(RedemptionConfigTransformer.key, RedemptionConfigTransformer)
  .provideClass(UpdateRedemptionConfigService.key, UpdateRedemptionConfigService)
  .injectClass(UpdateRedemptionConfigController);

export const handler = controller.invoke;
