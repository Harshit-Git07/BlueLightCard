import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultThresholdEmailController } from '@blc-mono/redemptions/application/controllers/eventBridge/email/VaultThresholdEmailController';
import { AdminEmailRepository } from '@blc-mono/redemptions/application/repositories/AdminEmailRepository';
import { VaultCodesRepository } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { VaultThresholdService } from '@blc-mono/redemptions/application/services/vault/VaultThresholdService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SesClientProvider } from '@blc-mono/redemptions/libs/Email/SesClientProvider';

const logger = new LambdaLogger({ serviceName: `redemptions-redemption-admin-email` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Providers
  .provideClass(SesClientProvider.key, SesClientProvider)
  // Repositiories
  .provideClass(AdminEmailRepository.key, AdminEmailRepository)
  .provideClass(VaultCodesRepository.key, VaultCodesRepository)
  // Services
  .provideClass(VaultThresholdService.key, VaultThresholdService)
  // Controller
  .injectClass(VaultThresholdEmailController);

/**
 * Handler for sending an admin email for a redemption.
 */
export const handler = controller.invoke;
