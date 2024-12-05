import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { BallotEntriesRepository } from '@blc-mono/redemptions/application/repositories/BallotEntriesRepository';
import { BallotsRepository } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { RedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { BallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { BrazeEmailClientProvider } from '../../../../libs/Email/BrazeEmailClientProvider';
import { SecretsManager } from '../../../../libs/SecretsManager/SecretsManager';
import { SuccessfulBallotController } from '../../../controllers/eventBridge/ballot/SuccessfulBallotController';
import { EmailRepository } from '../../../repositories/EmailRepository';
import { EmailService } from '../../../services/email/EmailService';
import { RedemptionCustomAttributeTransformer } from '../../../transformers/RedemptionCustomAttributeTransformer';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-run-successful-ballot` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const successfulBallotController = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Managers
  .provideClass(SecretsManager.key, SecretsManager)
  .provideClass(TransactionManager.key, TransactionManager)
  // Providers
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  // Transformers
  .provideClass(RedemptionCustomAttributeTransformer.key, RedemptionCustomAttributeTransformer)
  // Repositories
  .provideClass(EmailRepository.key, EmailRepository)
  .provideClass(BallotsRepository.key, BallotsRepository)
  .provideClass(RedemptionsEventsRepository.key, RedemptionsEventsRepository)
  .provideClass(BallotEntriesRepository.key, BallotEntriesRepository)
  // Services
  .provideClass(EmailService.key, EmailService)
  .provideClass(BallotService.key, BallotService)
  // Controller
  .injectClass(SuccessfulBallotController);

/**
 * Handler for running a single ballot for a redemption.
 */
export const successfulBallotHandler = successfulBallotController.invoke;
