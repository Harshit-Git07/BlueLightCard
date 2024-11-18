import { PaymentSucceededEvent, PaymentSucceededEventSchema } from '@blc-mono/core/schemas/payments';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EmailService, IEmailService } from '@blc-mono/orders/application/services/email/EmailService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class PaymentSucceededEmailController extends EventBridgeController<PaymentSucceededEvent> {
  static inject = [Logger.key, EmailService.key] as const;

  constructor(
    logger: ILogger,
    private emailService: IEmailService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<PaymentSucceededEvent, Error> {
    return this.zodParseRequest(request, PaymentSucceededEventSchema);
  }

  public async handle(event: PaymentSucceededEvent): Promise<void> {
    await this.emailService.sendPaymentSucceededEmail(event.detail);
  }
}
