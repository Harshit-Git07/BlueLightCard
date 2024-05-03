import { MemberRedeemIntentEvent, MemberRedeemIntentEventSchema } from '@blc-mono/core/schemas/redemptions';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  DwhLoggingService,
  IDwhLoggingService,
} from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class DwhMemberRedeemIntentController extends EventBridgeController<MemberRedeemIntentEvent> {
  static inject = [Logger.key, DwhLoggingService.key] as const;

  constructor(
    logger: ILogger,
    private readonly dwhMemberRetrievedRedemptionService: IDwhLoggingService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<MemberRedeemIntentEvent, Error> {
    return this.zodParseRequest(request, MemberRedeemIntentEventSchema);
  }

  protected async handle(event: MemberRedeemIntentEvent): Promise<void> {
    await this.dwhMemberRetrievedRedemptionService.logMemberRedemptionIntentToDwh({
      clientType: event.detail.redemptionDetails.clientType,
      companyId: event.detail.redemptionDetails.companyId,
      memberId: event.detail.memberDetails.memberId,
      offerId: event.detail.redemptionDetails.offerId,
    });
  }
}
