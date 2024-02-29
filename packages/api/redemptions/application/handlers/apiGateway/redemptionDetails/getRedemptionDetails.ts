import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionDetailsController } from '@blc-mono/redemptions/application/controllers/apiGateway/redemptionDetails/RedemptionDetailsController';
import { RedemptionDetailsService } from '@blc-mono/redemptions/application/services/redemptionDetails/RedemptionDetailsService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { RedemptionsRepository } from '../../../repositories/RedemptionsRepository';

const logger = new LambdaLogger({ serviceName: 'redemptions-redeem-post' });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Repositories
  .provideClass(RedemptionsRepository.key, RedemptionsRepository)
  // API Service
  .provideClass(RedemptionDetailsService.key, RedemptionDetailsService)
  // Controller
  .injectClass(RedemptionDetailsController);

/**
 * Handler for a REST API endpoint to redeem an offer.
 */
export const handler = controller.invoke;
