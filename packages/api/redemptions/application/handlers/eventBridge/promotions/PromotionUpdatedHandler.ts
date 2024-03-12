import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PromotionUpdateController } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import {
  LegacyVaultApiRepository,
  vaultSecrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { PromotionUpdateService } from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManger } from '@blc-mono/redemptions/libs/SecretsManger/SecretsManger';
const logger: ILogger = new LambdaLogger({ serviceName: `redemptions-redeem-post` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

export const handler = createInjector()
  .provideValue(DatabaseConnection.key, connection)
  .provideValue(Logger.key, logger)
  .provideClass(SecretsManger.key, SecretsManger<vaultSecrets>)
  .provideClass(LegacyVaultApiRepository.key, LegacyVaultApiRepository)
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  .provideClass(PromotionUpdateService.key, PromotionUpdateService)
  .injectClass(PromotionUpdateController).invoke;
