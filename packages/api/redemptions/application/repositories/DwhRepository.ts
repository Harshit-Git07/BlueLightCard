import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberRedemptionParamsDto } from '@blc-mono/redemptions/application/services/DWH/dwhLoggingService';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { EagleEyeModel, UniqodoModel } from '@blc-mono/redemptions/libs/models/postCallback';

export interface IDwhRepository {
  logOfferView(offerId: number, companyId: number, memberId: string, clientType: ClientType): Promise<void>;
  logRedemptionAttempt(offerId: number, companyId: number, memberId: string, clientType: ClientType): Promise<void>;
  logVaultRedemption(offerId: number, companyId: number, memberId: string, code: string): Promise<void>;
  logRedemption(dto: MemberRedemptionParamsDto): Promise<void>;
  logCallbackEagleEyeVaultRedemption(data: EagleEyeModel): Promise<void>;
  logCallbackUniqodoVaultRedemption(data: UniqodoModel): Promise<void>;
}

const EVENT_ORIGIN_OFFER_SHEET = 'offer_sheet';
const CLIENT_TYPE_WEB = 'web' satisfies ClientType;
const CLIENT_TYPE_APP = 'mobile' satisfies ClientType;

/**
 * Repository for logging events to the Data Warehouse
 */
export class DwhRepository implements IDwhRepository {
  static key = 'DwhRepository' as const;

  private readonly client = new FirehoseClient();

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

  async logRedemption(dto: MemberRedemptionParamsDto) {
    const firehoseClient = new FirehoseClient();
    const firehoseCommand = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            companyid: dto.data.companyId.toString(),
            code: dto.data.code ?? '',
            memberid: dto.data.memberId,
            actiontime: new Date().toISOString(),
            offerid: dto.data.offerId.toString(),
            redemptiontype: dto.data.redemptionType,
            clienttype: dto.data.clientType,
            origin: 'new stack',
          }),
        ),
      },
    });
    await firehoseClient.send(firehoseCommand);
  }

  async logCallbackEagleEyeVaultRedemption(data: EagleEyeModel): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            account_id: data.accountId,
            account_status: data.accountStatus,
            account_type_id: data.accountTypeId,
            account_transaction_id: data.accountTransactionId,
            account_type: data.accountType,
            account_sub_type: data.accountSubType,
            balances: {
              available: data.balances.available,
              refundable: data.balances.refundable,
            },
            issuer_id: data.issuerId,
            resource_id: data.resourceId,
            resource_type: data.resourceType,
            token: data.token,
            token_dates: {
              start: data.tokenDates.start,
              end: data.tokenDates.end,
            },
            token_id: data.tokenId,
            token_status: data.tokenStatus,
            consumer_id: data.consumerId,
          }),
        ),
      },
    });
    await this.client.send(command);
  }

  async logCallbackUniqodoVaultRedemption(data: UniqodoModel): Promise<void> {
    const command = new PutRecordCommand({
      DeliveryStreamName: getEnv(RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME),
      Record: {
        Data: Buffer.from(
          JSON.stringify({
            claim: {
              expires_at: data.claim.expiresAt,
              code: data.claim.code,
              created_at: data.claim.createdAt,
              deactivated_at: data.claim.deactivatedAt,
              linked_unique_reference: data.claim.linkedUniqueReference,
              promotion_id: data.claim.promotionId,
            },
            promotion: {
              id: data.promotion.id,
              status: data.promotion.status,
              code_type: data.promotion.codeType,
              timezone: data.promotion.timezone,
              redemptions_per_code: data.promotion.redemptionsPerCode,
              title: data.promotion.title,
              reward_type: data.promotion.rewardType,
              reward: {
                type: data.promotion.reward.type,
                amount: data.promotion.reward.amount,
                discount_type: data.promotion.reward.discountType,
                up_to_maximum_of: data.promotion.reward.upToMaximumOf,
                product_exclusion_rule: data.promotion.reward.productExclusionRule,
              },
              available_to_claim: data.promotion.availableToClaim,
              available_to_redeem: data.promotion.availableToRedeem,
              start_date: data.promotion.startDate,
              end_date: data.promotion.endDate,
              terms: data.promotion.terms,
              code_expiry: data.promotion.codeExpiry,
              code_expiry_unit: data.promotion.codeExpiryUnit,
            },
            customer: data.customer,
          }),
        ),
      },
    });
    await this.client.send(command);
  }
}
