import { PaymentFailedEvent, PaymentFailedEventSchema } from '@blc-mono/core/schemas/payments';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { DwhLoggingService, IDwhLoggingService } from '../../../services/DWH/dwhLoggingService';
import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class DwhPaymentFailedController extends EventBridgeController<PaymentFailedEvent> {
  static inject = [Logger.key, DwhLoggingService.key] as const;

  constructor(
    logger: ILogger,
    private readonly dwhLoggingService: IDwhLoggingService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<PaymentFailedEvent, Error> {
    return this.zodParseRequest(request, PaymentFailedEventSchema);
  }

  protected async handle(event: PaymentFailedEvent): Promise<void> {
    await this.dwhLoggingService.logPaymentFailed(event.detail);
  }
}
