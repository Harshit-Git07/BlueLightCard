import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RunBallotController } from '@blc-mono/redemptions/application/controllers/eventBridge/ballot/RunBallotController';
import { BallotsRepository } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { RedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { BallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-run-ballot` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Repositiories
  .provideClass(BallotsRepository.key, BallotsRepository)
  .provideClass(RedemptionsEventsRepository.key, RedemptionsEventsRepository)
  // Services
  .provideClass(BallotService.key, BallotService)
  // Controller
  .injectClass(RunBallotController);

/**
 * Handler for running a single ballot for a redemption.
 */
export const handler = controller.invoke;
