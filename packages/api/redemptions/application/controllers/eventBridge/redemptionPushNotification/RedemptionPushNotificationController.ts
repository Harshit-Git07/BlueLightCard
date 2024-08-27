import { MemberRedemptionEvent, MemberRedemptionEventSchema } from '@blc-mono/core/schemas/redemptions';
import { Result } from '@blc-mono/core/types/result';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import {
  IPushNotificationService,
  PushNotificationService,
} from '@blc-mono/redemptions/application/services/pushNotification/PushNotificationService';

import { EventBridgeController, UnknownEventBridgeEvent } from '../EventBridgeController';

export class RedemptionPushNotificationController extends EventBridgeController<MemberRedemptionEvent> {
  static inject = [Logger.key, PushNotificationService.key] as const;

  constructor(
    logger: ILogger,
    private pushNotificationService: IPushNotificationService,
  ) {
    super(logger);
  }

  protected parseRequest(request: UnknownEventBridgeEvent): Result<MemberRedemptionEvent, Error> {
    return this.zodParseRequest(request, MemberRedemptionEventSchema);
  }

  public async handle(event: MemberRedemptionEvent): Promise<void> {
    const { memberDetails, redemptionDetails } = event.detail;
    if (redemptionDetails.clientType === 'mobile') {
      const redemptionDetailsUrl = redemptionDetails.redemptionType !== 'showCard' ? redemptionDetails.url : undefined;
      await this.pushNotificationService.sendRedemptionPushNotification(
        redemptionDetails.companyName,
        memberDetails.brazeExternalUserId,
        redemptionDetails.redemptionType,
        redemptionDetailsUrl,
      );
    }
  }
}
