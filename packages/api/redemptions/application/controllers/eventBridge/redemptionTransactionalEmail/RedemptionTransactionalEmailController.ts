import { MemberRedemptionEvent, MemberRedemptionEventSchema } from '@blc-mono/core/schemas/redemptions';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EmailService, IEmailService } from '@blc-mono/redemptions/application/services/email/EmailService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class RedemptionTransactionalEmailController extends EventBridgeController<MemberRedemptionEvent> {
  static inject = [Logger.key, EmailService.key] as const;

  constructor(
    logger: ILogger,
    private emailService: IEmailService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<MemberRedemptionEvent, Error> {
    return this.zodParseRequest(request, MemberRedemptionEventSchema);
  }

  public async handle(event: MemberRedemptionEvent): Promise<void> {
    await this.emailService.sendRedemptionTransactionEmail(event);
  }
}
