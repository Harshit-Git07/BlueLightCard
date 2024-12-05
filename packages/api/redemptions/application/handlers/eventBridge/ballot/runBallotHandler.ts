import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RunBallotController } from '@blc-mono/redemptions/application/controllers/eventBridge/ballot/RunBallotController';
import { BallotEntriesRepository } from '@blc-mono/redemptions/application/repositories/BallotEntriesRepository';
import { BallotsRepository } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { RedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { BallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { BrazeEmailClientProvider } from '../../../../libs/Email/BrazeEmailClientProvider';
import { SecretsManager } from '../../../../libs/SecretsManager/SecretsManager';
import { EmailRepository } from '../../../repositories/EmailRepository';
import { EmailService } from '../../../services/email/EmailService';
import { RedemptionCustomAttributeTransformer } from '../../../transformers/RedemptionCustomAttributeTransformer';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-run-ballot` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const runBallotController = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  // Managers
  .provideClass(SecretsManager.key, SecretsManager)
  .provideClass(TransactionManager.key, TransactionManager)
  // Transformers
  .provideClass(RedemptionCustomAttributeTransformer.key, RedemptionCustomAttributeTransformer)
  // Providers
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  // Repositories
  .provideClass(EmailRepository.key, EmailRepository)
  .provideClass(BallotsRepository.key, BallotsRepository)
  .provideClass(RedemptionsEventsRepository.key, RedemptionsEventsRepository)
  .provideClass(BallotEntriesRepository.key, BallotEntriesRepository)
  // Services
  .provideClass(EmailService.key, EmailService)
  .provideClass(BallotService.key, BallotService)
  // Controller
  .injectClass(RunBallotController);

export const ballotHandler = runBallotController.invoke;
