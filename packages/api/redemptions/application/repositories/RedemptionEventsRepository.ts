import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import {
  RedemptionEventDetailType,
  REDEMPTIONS_EVENT_SOURCE,
} from '@blc-mono/redemptions/infrastructure/eventBridge/events/redemptions';

type RedemptionEventDetail = {
  memberDetails: {
    memberId: string;
    brazeExternalUserId: string;
  };
  redemptionDetails: {
    redemptionType: string;
    companyId: string;
    companyName: string;
    offerId: string;
    offerName: string;
    code: string;
    url: string;
  };
};

export interface IRedemptionEventsRepository {
  publishEvent(detailType: RedemptionEventDetailType, detail: RedemptionEventDetail): Promise<void>;
}

export class RedemptionEventsRepository implements IRedemptionEventsRepository {
  static readonly key = 'RedemptionEventsRepository';

  public async publishEvent(detailType: RedemptionEventDetailType, detail: RedemptionEventDetail): Promise<void> {
    const client = new EventBridgeClient();
    const command = new PutEventsCommand({
      Entries: [
        {
          Time: new Date(),
          EventBusName: getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME),
          Source: REDEMPTIONS_EVENT_SOURCE,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        },
      ],
    });
    await client.send(command);
  }
}
