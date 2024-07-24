import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionPushNotificationController } from '@blc-mono/redemptions/application/controllers/eventBridge/redemptionPushNotification/RedemptionPushNotificationController';
import { PushNotificationRepository } from '@blc-mono/redemptions/application/repositories/PushNotificationRepository';
import { PushNotificationService } from '@blc-mono/redemptions/application/services/pushNotification/PushNotificationService';
import { BrazeEmailClientProvider } from '@blc-mono/redemptions/libs/Email/BrazeEmailClientProvider';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

const logger = new LambdaLogger({ serviceName: 'redemptions-redemption-push-notification' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Misc
  .provideClass(SecretsManager.key, SecretsManager)
  // Providers
  .provideClass(BrazeEmailClientProvider.key, BrazeEmailClientProvider)
  // Repositiories
  .provideClass(PushNotificationRepository.key, PushNotificationRepository)
  // Services
  .provideClass(PushNotificationService.key, PushNotificationService)
  // Controller
  .injectClass(RedemptionPushNotificationController);

/**
 * Handler for sending a push notification for a redemption
 */
export const handler = controller.invoke;
