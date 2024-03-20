import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import {
  LegacyVaultApiRepository,
  Secrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionEventsRepository';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { RedeemController } from '../../../controllers/apiGateway/redeem/RedeemController';
import { RedemptionsRepository } from '../../../repositories/RedemptionsRepository';
import { RedeemService } from '../../../services/redeem/RedeemService';
import { RedeemStrategyResolver } from '../../../services/redeem/RedeemStrategyResolver';
import { RedeemGenericStrategy } from '../../../services/redeem/strategies/RedeemGenericStrategy';
import { RedeemPreAppliedStrategy } from '../../../services/redeem/strategies/RedeemPreAppliedStrategy';
import { RedeemShowCardStrategy } from '../../../services/redeem/strategies/RedeemShowCardStrategy';
import { RedeemVaultQrStrategy } from '../../../services/redeem/strategies/RedeemVaultQrStrategy';
import { RedeemVaultStrategy } from '../../../services/redeem/strategies/RedeemVaultStrategy';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-redeem-post` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(SecretsManager.key, SecretsManager<Secrets>)
  // Repositories
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  .provideClass(GenericsRepository.key, GenericsRepository)
  .provideClass(VaultsRepository.key, VaultsRepository)
  .provideClass(VaultCodesRepository.key, VaultCodesRepository)
  .provideClass(LegacyVaultApiRepository.key, LegacyVaultApiRepository)
  .provideClass(RedemptionEventsRepository.key, RedemptionEventsRepository)
  // Redemption strategies
  .provideClass(RedeemGenericStrategy.key, RedeemGenericStrategy)
  .provideClass(RedeemPreAppliedStrategy.key, RedeemPreAppliedStrategy)
  .provideClass(RedeemShowCardStrategy.key, RedeemShowCardStrategy)
  .provideClass(RedeemVaultQrStrategy.key, RedeemVaultQrStrategy)
  .provideClass(RedeemVaultStrategy.key, RedeemVaultStrategy)
  .provideClass(RedeemStrategyResolver.key, RedeemStrategyResolver)
  // API Service
  .provideClass(RedeemService.key, RedeemService)
  // Controller
  .injectClass(RedeemController);

/**
 * Handler for a REST API endpoint to redeem an offer.
 */
export const handler = controller.invoke;
