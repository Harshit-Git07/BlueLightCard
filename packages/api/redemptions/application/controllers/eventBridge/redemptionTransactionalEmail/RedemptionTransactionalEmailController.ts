import { z } from 'zod';

import { eventSchema } from '@blc-mono/core/schemas/event';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  RedemptionEventDetailType,
  REDEMPTIONS_EVENT_SOURCE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

const RedemptionTransactionalEmailEventDetailSchema = z.object({});
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
type RedemptionTransactionalEmailEvent = z.infer<typeof RedemptionTransactionalEmailEventSchema>;

export class RedemptionTransactionalEmailController extends EventBridgeController<RedemptionTransactionalEmailEvent> {
  static readonly inject = [Logger.key] as const;

  constructor(protected logger: ILogger) {
    super();
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<RedemptionTransactionalEmailEvent, Error> {
    return this.zodParseRequest(request, RedemptionTransactionalEmailEventSchema);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async handle(_: RedemptionTransactionalEmailEvent): Promise<void> {
    this.logger.info({
      message: 'NOT IMPLEMENTED',
    });
  }
}
