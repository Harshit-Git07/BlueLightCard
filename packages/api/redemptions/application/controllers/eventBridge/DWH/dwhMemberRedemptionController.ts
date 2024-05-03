import { MemberRedemptionEvent, MemberRedemptionEventSchema } from '@blc-mono/core/schemas/redemptions';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  DwhLoggingService,
  IDwhLoggingService,
} from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class DwhMemberRedemptionController extends EventBridgeController<MemberRedemptionEvent> {
  static inject = [Logger.key, DwhLoggingService.key] as const;

  constructor(
    logger: ILogger,
    private readonly dwhMemberRetrievedRedemptionService: IDwhLoggingService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<MemberRedemptionEvent, Error> {
    return this.zodParseRequest(request, MemberRedemptionEventSchema);
  }

  protected async handle(event: MemberRedemptionEvent): Promise<void> {
    await this.dwhMemberRetrievedRedemptionService.logMemberRedemption({
      code: event.detail.redemptionDetails.code,
      companyId: event.detail.redemptionDetails.companyId,
      memberId: event.detail.memberDetails.memberId,
      offerId: event.detail.redemptionDetails.offerId,
      redemptionType: event.detail.redemptionDetails.redemptionType,
    });
  }
}
