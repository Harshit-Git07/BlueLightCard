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
import { UnsuccessfulBallotController } from '../../../controllers/eventBridge/ballot/UnsuccessfulBallotController';
import { EmailRepository } from '../../../repositories/EmailRepository';
import { EmailService } from '../../../services/email/EmailService';
import { RedemptionCustomAttributeTransformer } from '../../../transformers/RedemptionCustomAttributeTransformer';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-run-unsuccessful-ballot` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const unsuccessfulBallotController = createInjector()
  .provideValue(DatabaseConnection.key, connection)
  .provideValue(Logger.key, logger)
  .provideClass(TransactionManager.key, TransactionManager)
  .provideClass(SecretsManager.key, SecretsManager)
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  .provideClass(RedemptionCustomAttributeTransformer.key, RedemptionCustomAttributeTransformer)
  .provideClass(BallotsRepository.key, BallotsRepository)
  .provideClass(EmailRepository.key, EmailRepository)
  .provideClass(BallotEntriesRepository.key, BallotEntriesRepository)
  .provideClass(RedemptionsEventsRepository.key, RedemptionsEventsRepository)
  .provideClass(EmailService.key, EmailService)
  .provideClass(BallotService.key, BallotService)
  .injectClass(UnsuccessfulBallotController);
export const unsuccessfulBallotHandler = unsuccessfulBallotController.invoke;
