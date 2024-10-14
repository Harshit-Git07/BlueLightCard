import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { CallbackController } from '@blc-mono/redemptions/application/controllers/adminApiGateway/callback/CallbackController';
import { DwhRepository } from '@blc-mono/redemptions/application/repositories/DwhRepository';
import { CallbackService } from '@blc-mono/redemptions/application/services/callback/CallbackService';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-post-callback` });
const connection = await DatabaseConnection.fromEnvironmentVariables(DatabaseConnectionType.READ_WRITE);

const controller = createInjector()
  // General
  .provideValue(Logger.key, logger)
  .provideValue(DatabaseConnection.key, connection)
  .provideClass(SecretsManager.key, SecretsManager)
  // Repositories
  .provideClass(DwhRepository.key, DwhRepository)
  // Services
  .provideClass(CallbackService.key, CallbackService)
  // Controller
  .injectClass(CallbackController);

export const handler = controller.invoke;
