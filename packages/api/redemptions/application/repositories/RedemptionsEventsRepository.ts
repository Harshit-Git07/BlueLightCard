import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { RedemptionEventDetailType, REDEMPTIONS_EVENT_SOURCE } from '@blc-mono/core/constants/redemptions';
import {
  MemberRedeemIntentEventDetail,
  MemberRedemptionEventDetail,
  MemberRetrievedRedemptionDetailsEventDetail,
} from '@blc-mono/core/schemas/redemptions';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

// TODO: Detail should not be passed in directly, the methods should have a separate type owned by the repository
export interface IRedemptionsEventsRepository {
  publishMemberRetrievedRedemptionDetailsEvent(detail: MemberRetrievedRedemptionDetailsEventDetail): Promise<void>;
  publishMemberRedeemIntentEvent(detail: MemberRedeemIntentEventDetail): Promise<void>;
  publishRedemptionEvent(detail: MemberRedemptionEventDetail): Promise<void>;
}

export class RedemptionsEventsRepository implements IRedemptionsEventsRepository {
  static readonly key = 'RedemptionsEventsRepository';

  public async publishMemberRetrievedRedemptionDetailsEvent(
    detail: MemberRetrievedRedemptionDetailsEventDetail,
  ): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Time: new Date(),
          EventBusName: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME),
          Source: REDEMPTIONS_EVENT_SOURCE,
          DetailType: RedemptionEventDetailType.MEMBER_RETRIEVED_REDEMPTION_DETAILS,
          Detail: JSON.stringify(detail satisfies MemberRetrievedRedemptionDetailsEventDetail),
        },
      ],
    });
    await client.send(command);
  }

  public async publishMemberRedeemIntentEvent(detail: MemberRedeemIntentEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Time: new Date(),
          EventBusName: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME),
          Source: REDEMPTIONS_EVENT_SOURCE,
          DetailType: RedemptionEventDetailType.MEMBER_REDEEM_INTENT,
          Detail: JSON.stringify(detail satisfies MemberRedeemIntentEventDetail),
        },
      ],
    });
    await client.send(command);
  }

  public async publishRedemptionEvent(detail: MemberRedemptionEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Time: new Date(),
          EventBusName: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME),
          Source: REDEMPTIONS_EVENT_SOURCE,
          DetailType: RedemptionEventDetailType.MEMBER_REDEMPTION,
          Detail: JSON.stringify(detail satisfies MemberRedemptionEventDetail),
        },
      ],
    });
    await client.send(command);
  }
}
