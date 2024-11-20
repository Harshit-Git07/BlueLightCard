import { PaymentSucceededEvent, PaymentSucceededEventSchema } from '@blc-mono/core/schemas/payments';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { DwhLoggingService, IDwhLoggingService } from '../../../services/DWH/dwhLoggingService';
import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class DwhPaymentSucceededController extends EventBridgeController<PaymentSucceededEvent> {
  static inject = [Logger.key, DwhLoggingService.key] as const;

  constructor(
    logger: ILogger,
    private readonly dwhLoggingService: IDwhLoggingService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<PaymentSucceededEvent, Error> {
    return this.zodParseRequest(request, PaymentSucceededEventSchema);
  }

  protected async handle(event: PaymentSucceededEvent): Promise<void> {
    await this.dwhLoggingService.logPaymentSucceeded(event.detail);
  }
}
