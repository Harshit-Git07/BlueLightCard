import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';

import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

export type ClientType = 'web' | 'mobile';

export interface IDwhRepository {
  logOfferView(offerId: number, companyId: number, memberId: string, clientType: ClientType): Promise<void>;
  logRedemptionAttempt(offerId: number, companyId: number, memberId: string, clientType: ClientType): Promise<void>;
  logVaultRedemption(offerId: number, companyId: number, memberId: string, code: string): Promise<void>;
}

const EVENT_ORIGIN_OFFER_SHEET = 'offer_sheet';
const CLIENT_TYPE_WEB = 'web' satisfies ClientType;
const CLIENT_TYPE_APP = 'mobile' satisfies ClientType;

/**
 * Repository for logging events to the Data Warehouse
 */
export class DwhRepository implements IDwhRepository {
  static key = 'DwhRepository' as const;

  private client = new FirehoseClient();

  async logOfferView(offerId: number, companyId: number, memberId: string, clientType: ClientType): Promise<void> {
    const APPLICATION_TYPE_WEB = 1;
    const APPLICATION_TYPE_APP = 5;
    const [streamName, type] = (() => {
      switch (clientType) {
        case CLIENT_TYPE_WEB:
          return [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME, APPLICATION_TYPE_WEB];
        case CLIENT_TYPE_APP:
          return [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME, APPLICATION_TYPE_APP];
        default:
          exhaustiveCheck(clientType, 'unknown client type');
      }
    })();

    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(streamName),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            cid: companyId.toString(),
            oid_: offerId,
            mid: memberId,
            timedate: new Date().toISOString(),
            type,
            origin: EVENT_ORIGIN_OFFER_SHEET,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logRedemptionAttempt(
    offerId: number,
    companyId: number,
    memberId: string,
    clientType: ClientType,
  ): Promise<void> {
    const APPLICATION_TYPE_WEB = 2;
    const APPLICATION_TYPE_APP = 4;
    const [streamName, type] = (() => {
      switch (clientType) {
        case CLIENT_TYPE_WEB:
          return [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME, APPLICATION_TYPE_WEB];
        case CLIENT_TYPE_APP:
          return [RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME, APPLICATION_TYPE_APP];
        default:
          exhaustiveCheck(clientType, 'unknown client type');
      }
    })();
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(streamName),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            company_id: companyId.toString(),
            offer_id: offerId,
            member_id: memberId,
            timedate: new Date().toISOString(),
            type,
            origin: EVENT_ORIGIN_OFFER_SHEET,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logVaultRedemption(offerId: number, companyId: number, memberId: string, code: string): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            compid: companyId.toString(),
            code,
            uid: memberId,
            whenrequested: new Date().toISOString(),
            offer_id: offerId.toString(),
          }),
        ),
      },
    });
    await this.client.send(command);
  }
}
