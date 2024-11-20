import { PaymentInitiatedEvent, PaymentInitiatedEventSchema } from '@blc-mono/core/schemas/payments';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { DwhLoggingService, IDwhLoggingService } from '../../../services/DWH/dwhLoggingService';
import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class DwhPaymentIntentController extends EventBridgeController<PaymentInitiatedEvent> {
  static inject = [Logger.key, DwhLoggingService.key] as const;

  constructor(
    logger: ILogger,
    private readonly dwhLoggingService: IDwhLoggingService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<PaymentInitiatedEvent, Error> {
    return this.zodParseRequest(request, PaymentInitiatedEventSchema);
  }

  protected async handle(event: PaymentInitiatedEvent): Promise<void> {
    await this.dwhLoggingService.logPaymentIntent(event.detail);
  }
}
