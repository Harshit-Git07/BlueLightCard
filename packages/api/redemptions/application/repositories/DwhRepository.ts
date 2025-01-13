import { FirehoseClient, PutRecordBatchCommand, PutRecordCommand } from '@aws-sdk/client-firehose';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberRedemptionParamsDto } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { EagleEyeModel, UniqodoModel } from '@blc-mono/redemptions/libs/models/postCallback';

export interface IDwhRepository {
  logOfferView(offerId: string, companyId: string, memberId: string, clientType: ClientType): Promise<void>;
  logRedemptionAttempt(offerId: string, companyId: string, memberId: string, clientType: ClientType): Promise<void>;
  logVaultRedemption(
    offerId: string,
    companyId: string,
    memberId: string,
    code: string,
    integration: string | null | undefined,
    integrationId: string | null | undefined,
  ): Promise<void>;
  logRedemption(dto: MemberRedemptionParamsDto): Promise<void>;
  logRedemptions(dto: MemberRedemptionParamsDto): Promise<void>;
  logCallbackEagleEyeVaultRedemption(data: EagleEyeModel): Promise<void>;
  logCallbackUniqodoVaultRedemption(data: UniqodoModel): Promise<void>;
  logVaultStock(vaultStockData: VaultStockData[]): Promise<void>;
  logVaultBatchStock(vaultBatchStockData: VaultBatchStockData[]): Promise<void>;
}

export type VaultStockData = {
  vaultId: string;
  offerId: string;
  companyId: string;
  manager: string;
  unclaimed: number;
  isActive: string;
  vaultProvider: string;
};

export type VaultBatchStockData = {
  batchId: string;
  offerId: string;
  companyId: string;
  batchExpires: Date;
  batchCount: number;
};

const EVENT_ORIGIN_OFFER_SHEET = 'offer_sheet';
const CLIENT_TYPE_WEB = 'web' satisfies ClientType;
const CLIENT_TYPE_APP = 'mobile' satisfies ClientType;

/**
 * Repository for logging events to the Data Warehouse
 */
export class DwhRepository implements IDwhRepository {
  static key = 'DwhRepository' as const;

  private readonly client = new FirehoseClient();

  async logOfferView(offerId: string, companyId: string, memberId: string, clientType: ClientType): Promise<void> {
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
            cid: companyId,
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
    offerId: string,
    companyId: string,
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
            company_id: companyId,
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

  async logVaultRedemption(
    offerId: string,
    companyId: string,
    memberId: string,
    code: string,
    integration: string | null,
    integrationId: string | null,
  ): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            compid: companyId,
            code,
            uid: memberId,
            whenrequested: new Date().toISOString(),
            offer_id: offerId.toString(),
            integration: integration,
            integration_id: integrationId,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logRedemption(dto: MemberRedemptionParamsDto) {
    const firehoseClient = new FirehoseClient();
    const firehoseCommand = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            companyid: dto.data.companyId,
            code: dto.data.code ?? '',
            memberid: dto.data.memberId,
            actiontime: new Date().toISOString(),
            offerid: dto.data.offerId.toString(),
            redemptiontype: dto.data.redemptionType,
            clienttype: dto.data.clientType,
            integration: dto.data.integration,
            integration_id: dto.data.integrationId,
            origin: 'new stack',
            ballot_id: dto.data.ballotId,
          }),
        ),
      },
    });
    await firehoseClient.send(firehoseCommand);
  }

  async logRedemptions(dto: MemberRedemptionParamsDto) {
    const firehoseClient = new FirehoseClient();
    const firehoseCommand = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_MEMBER_REDEMPTIONS_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            redemption_type: dto.data.redemptionType,
            client_type: dto.data.clientType,
            code: dto.data.code ?? '',
            event_time: dto.data.eventTime,
            company_id: dto.data.companyId,
            member_id: dto.data.memberId,
            offer_id: dto.data.offerId.toString(),
            origin: 'new stack',
            brand: dto.data.brand,
            vault_id: dto.data.vaultId ?? '',
          }),
        ),
      },
    });
    await firehoseClient.send(firehoseCommand);
  }

  async logCallbackEagleEyeVaultRedemption(data: EagleEyeModel): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            offer_id: data.accountTransactionId,
            company_id: data.consumerId?.toString(),
            brand: getBrandFromEnv(),
            member_id: data.memberId?.toString(),
            code: data.tokenId,
            order_value: data.parentUnitId.toString(),
            currency: data.location.incomingIdentifier?.toString(),
            event_time: data.eventTime,
            integration_type: 'eagleeye',
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logCallbackUniqodoVaultRedemption(data: UniqodoModel): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            offer_id: data.offer_id,
            company_id: data.merchant_id?.toString(),
            brand: getBrandFromEnv(),
            member_id: data.member_id?.toString(),
            code: data.code,
            order_value: data.order_value,
            event_time: data.redeemed_at,
            integration_type: 'uniqodo',
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logVaultStock(vaultStockData: VaultStockData[]): Promise<void> {
    const brand = getBrandFromEnv();
    const updateTime = new Date().toISOString();
    const records = [];
    for (const vaultStockDataItem of vaultStockData) {
      const data = Buffer.from(
        JSON.stringify({
          vault_id: vaultStockDataItem.vaultId,
          offer_id: vaultStockDataItem.offerId,
          company_id: vaultStockDataItem.companyId,
          brand: brand,
          manager: vaultStockDataItem.manager,
          unclaimed: vaultStockDataItem.unclaimed,
          update_time: updateTime,
          is_active: vaultStockDataItem.isActive,
          vault_provider: vaultStockDataItem.vaultProvider,
        }),
      );
      records.push({ Data: data });
    }

    const command = new PutRecordBatchCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STOCK_STREAM_NAME),
      Records: records,
    });
    await this.client.send(command);
  }

  async logVaultBatchStock(vaultBatchStockData: VaultBatchStockData[]): Promise<void> {
    const brand = getBrandFromEnv();
    const updateTime = new Date().toISOString();
    const records = [];
    for (const vaultBatchStockDataItem of vaultBatchStockData) {
      const data = Buffer.from(
        JSON.stringify({
          batch_id: vaultBatchStockDataItem.batchId,
          offer_id: vaultBatchStockDataItem.offerId,
          company_id: vaultBatchStockDataItem.companyId,
          brand: brand,
          batch_expires: vaultBatchStockDataItem.batchExpires,
          batch_count: vaultBatchStockDataItem.batchCount,
          update_time: updateTime,
        }),
      );
      records.push({ Data: data });
    }

    const command = new PutRecordBatchCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_BATCH_STOCK_STREAM_NAME),
      Records: records,
    });
    await this.client.send(command);
  }
}
