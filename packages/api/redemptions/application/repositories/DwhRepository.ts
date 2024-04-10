import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';

import { getEnv } from '@blc-mono/core/utils/getEnv';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

export interface IDwhRepository {
  logOfferView(offerId: number, companyId: number, memberId: string): Promise<void>;
  logRedemptionAttempt(offerId: number, companyId: number, memberId: string): Promise<void>;
  logVaultRedemption(offerId: number, companyId: number, memberId: string): Promise<void>;
}

const APPLICATION_TYPE_WEB = 1;
const EVENT_ORIGIN_OFFER_SHEET = 'offer_sheet';

/**
 * Repository for logging events to the Data Warehouse
 */
export class DwhRepository implements IDwhRepository {
  static key = 'DwhRepository' as const;
  private client = new FirehoseClient();

  async logOfferView(offerId: number, companyId: number, memberId: string): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            cid: companyId.toString(),
            oid_: offerId,
            mid: memberId,
            timedate: new Date().toISOString(),
            // TODO: Handle mobile type for mobile hybrid?
            type: APPLICATION_TYPE_WEB,
            origin: EVENT_ORIGIN_OFFER_SHEET,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logRedemptionAttempt(offerId: number, companyId: number, memberId: string): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            cid: companyId.toString(),
            oid_: offerId,
            mid: memberId,
            timedate: new Date().toISOString(),
            // TODO: Handle mobile type for mobile hybrid?
            type: APPLICATION_TYPE_WEB,
            origin: EVENT_ORIGIN_OFFER_SHEET,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logVaultRedemption(offerId: number, companyId: number, memberId: string): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VAULT_CLICK_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            company_id: companyId,
            offer_id: offerId.toString(),
            member_id: memberId,
            timedate: new Date().toISOString(),
            // TODO: Handle mobile type for mobile hybrid?
            type: APPLICATION_TYPE_WEB,
          }),
        ),
      },
    });
    await this.client.send(command);
  }
}
