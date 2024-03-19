import { createInjector } from 'typed-inject';

import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { SpotifyController } from '@blc-mono/redemptions/application/controllers/apiGateway/proxy/SpotifyController';
import {
  LegacyVaultApiRepository,
  Secrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { SpotifyService } from '@blc-mono/redemptions/application/services/proxy/SpotifyService';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'spotify';
const logger = new LambdaLogger({ serviceName: `${service}-spotify-post` });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideClass(SecretsManager.key, SecretsManager<Secrets>)
  // Repository
  .provideClass(LegacyVaultApiRepository.key, LegacyVaultApiRepository)
  // API Service
  .provideClass(SpotifyService.key, SpotifyService)
  // Controller
  .injectClass(SpotifyController);

/**
 * Handler for a REST API endpoint to redeem an offer.
 */
export const handler = controller.invoke;
