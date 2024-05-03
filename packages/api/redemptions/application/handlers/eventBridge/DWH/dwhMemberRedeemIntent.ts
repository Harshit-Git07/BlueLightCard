import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { DwhMemberRedeemIntentController } from '@blc-mono/redemptions/application/controllers/eventBridge/DWH/dwhMemberRedeemIntentController';
import { DwhRepository } from '@blc-mono/redemptions/application/repositories/DwhRepository';
import { DwhLoggingService } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';

const logger = new LambdaLogger({ serviceName: 'redemptions-dwh-member-redeem-intent' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Repositories
  .provideClass(DwhRepository.key, DwhRepository)
  // Service
  .provideClass(DwhLoggingService.key, DwhLoggingService)
  // Controller
  .injectClass(DwhMemberRedeemIntentController);

export const handler = controller.invoke;
