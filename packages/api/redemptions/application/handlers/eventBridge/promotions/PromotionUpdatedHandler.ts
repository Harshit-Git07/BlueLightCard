import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PromotionUpdateController } from '@blc-mono/redemptions/application/controllers/eventBridge/promotions/PromotionUpdateController';
import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { PromotionUpdateService } from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';
const logger: ILogger = new LambdaLogger({ serviceName: `redemptions-redeem-post` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(DatabaseConnection.key, connection)
  .provideValue(Logger.key, logger)
  .provideClass(SecretsManager.key, SecretsManager)
  // Repository
  .provideClass(LegacyVaultApiRepository.key, LegacyVaultApiRepository)
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  // API Service
  .provideClass(PromotionUpdateService.key, PromotionUpdateService)
  // Controller
  .injectClass(PromotionUpdateController);

export const handler = controller.invoke;
