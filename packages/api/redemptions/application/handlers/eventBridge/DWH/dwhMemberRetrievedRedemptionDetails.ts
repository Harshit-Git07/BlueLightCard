import { createInjector } from 'typed-inject';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Logger } from '@blc-mono/core/utils/logger/logger';
import { DwhMemberRetrievedRedemptionController } from '@blc-mono/redemptions/application/controllers/eventBridge/DWH/dwhMemberRetrievedRedemptionDetails';
import { DwhRepository } from '@blc-mono/redemptions/application/repositories/DwhRepository';
import { DwhLoggingService } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';

const logger = new LambdaLogger({ serviceName: 'redemptions-dwh-member-retrieved-redemption-details' });

const controller = createInjector()
  // Common
  .provideValue(Logger.key, logger)
  // Repositories
  .provideClass(DwhRepository.key, DwhRepository)
  // Service
  .provideClass(DwhLoggingService.key, DwhLoggingService)
  // Controller
  .injectClass(DwhMemberRetrievedRedemptionController);

export const handler = controller.invoke;
