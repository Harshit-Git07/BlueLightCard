import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EmailService, IEmailService } from '@blc-mono/redemptions/application/services/email/EmailService';
import {
  RedemptionEventDetailType,
  REDEMPTIONS_EVENT_SOURCE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export const RedemptionTransactionalEmailEventDetailSchema = z.object({
  memberDetails: z.object({
    memberId: z.string(),
    brazeExternalUserId: z.string(),
  }),
  redemptionDetails: z.object({
    redemptionType: z.enum(redemptionTypeEnum.enumValues),
    companyId: z.string(),
    companyName: z.string(),
    offerId: z.string(),
    offerName: z.string(),
    code: z.string(),
    affiliate: z.string().nullable(),
    url: z.string(),
  }),
});
const RedemptionTransactionalEmailEventSchema = eventSchema(
  REDEMPTIONS_EVENT_SOURCE,
  z.enum([
    RedemptionEventDetailType.REDEEMED_GENERIC,
    RedemptionEventDetailType.REDEEMED_PRE_APPLIED,
    RedemptionEventDetailType.REDEEMED_SHOW_CARD,
    RedemptionEventDetailType.REDEEMED_VAULT,
    RedemptionEventDetailType.REDEEMED_VAULT_QR,
  ]),
  RedemptionTransactionalEmailEventDetailSchema,
);
export type RedemptionTransactionalEmailEvent = z.infer<typeof RedemptionTransactionalEmailEventSchema>;

export class RedemptionTransactionalEmailController extends EventBridgeController<RedemptionTransactionalEmailEvent> {
  static inject = [Logger.key, EmailService.key] as const;

  constructor(
    logger: ILogger,
    private emailService: IEmailService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<RedemptionTransactionalEmailEvent, Error> {
    return this.zodParseRequest(request, RedemptionTransactionalEmailEventSchema);
  }

  public async handle(event: RedemptionTransactionalEmailEvent): Promise<void> {
    await this.emailService.sendRedemptionTransactionEmail(event);
  }
}
