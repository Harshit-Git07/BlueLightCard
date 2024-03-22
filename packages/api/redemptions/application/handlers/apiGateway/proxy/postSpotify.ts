import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { SpotifyController } from '@blc-mono/redemptions/application/controllers/apiGateway/proxy/SpotifyController';
import { LegacyVaultApiRepository } from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { SpotifyService } from '@blc-mono/redemptions/application/services/proxy/SpotifyService';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const logger = new LambdaLogger({ serviceName: 'redemptions-postSpotify' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  .provideClass(SecretsManager.key, SecretsManager)
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
