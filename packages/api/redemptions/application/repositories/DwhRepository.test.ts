import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { mockClient } from 'aws-sdk-client-mock';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { eagleEyeModelFactory, uniqodoModelFactory } from '@blc-mono/redemptions/libs/test/factories/callback.factory';

import { MemberRedemptionParamsDto } from '../services/DWH/dwhLoggingService';

import { DwhRepository } from './DwhRepository';

jest.useFakeTimers({
  now: new Date('2021-09-01T00:00:00.000Z'),
});

describe('DwhRepository', () => {
  const mockFirehoseClient = mockClient(FirehoseClient);

  afterEach(() => {
    mockFirehoseClient.reset();
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME];
  });

  describe('logOfferView', () => {
    it('should send the correct data to the compView (web) stream when the client type is web', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME] = 'compViewStream';
      const offerId = '1';
      const companyId = 2;
      const memberId = '3';
      const clientType: ClientType = 'web';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logOfferView(offerId, companyId, memberId, clientType);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compViewStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"cid":"2","oid_":"1","mid":"3","timedate":"2021-09-01T00:00:00.000Z","type":1,"origin":"offer_sheet"}"`,
      );
    });

    it('should send the correct data to the compAppView (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
      const offerId = '1';
      const companyId = 2;
      const memberId = '3';
      const clientType: ClientType = 'mobile';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logOfferView(offerId, companyId, memberId, clientType);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compAppViewStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"cid":"2","oid_":"1","mid":"3","timedate":"2021-09-01T00:00:00.000Z","type":5,"origin":"offer_sheet"}"`,
      );
    });

    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
        const offerId = '1';
        const companyId = 2;
        const memberId = '3';
        mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');
        const dwhRepository = new DwhRepository();

        // Act
        const result = dwhRepository.logOfferView(offerId, companyId, memberId, clientType);

        // Assert
        await expect(result).rejects.toThrow();
      },
    );
  });

  describe('logRedemptionAttempt', () => {
    it('should send the correct data to the compClick (web) stream when the client type is web', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME] = 'compClickStream';
      const offerId = '1';
      const companyId = 2;
      const memberId = '3';
      const clientType = 'web';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logRedemptionAttempt(offerId, companyId, memberId, clientType);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compClickStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"company_id":"2","offer_id":"1","member_id":"3","timedate":"2021-09-01T00:00:00.000Z","type":2,"origin":"offer_sheet"}"`,
      );
    });
    it('should send the correct data to the compAppClick (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compAppClickStream';
      const offerId = '1';
      const companyId = 2;
      const memberId = '3';
      const clientType = 'mobile';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logRedemptionAttempt(offerId, companyId, memberId, clientType);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compAppClickStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"company_id":"2","offer_id":"1","member_id":"3","timedate":"2021-09-01T00:00:00.000Z","type":4,"origin":"offer_sheet"}"`,
      );
    });
    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compClickStream';
        const offerId = '1';
        const companyId = 2;
        const memberId = '3';
        mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');
        const dwhRepository = new DwhRepository();

        // Act
        const result = dwhRepository.logOfferView(offerId, companyId, memberId, clientType);

        // Assert
        await expect(result).rejects.toThrow();
      },
    );
  });

  describe('logVaultRedemption', () => {
    it('should send the correct data to the vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'vaultStream';
      const offerId = '1';
      const companyId = 2;
      const code = 'code';
      const memberId = '3';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logVaultRedemption(offerId, companyId, memberId, code);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('vaultStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"compid":"2","code":"code","uid":"3","whenrequested":"2021-09-01T00:00:00.000Z","offer_id":"1"}"`,
      );
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'vaultStream';
      const offerId = '1';
      const companyId = 2;
      const code = 'code';
      const memberId = '3';
      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');
      const dwhRepository = new DwhRepository();

      // Act
      const result = dwhRepository.logVaultRedemption(offerId, companyId, memberId, code);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logRedemption', () => {
    it('should send the correct data to the redemption stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_REDEMPTIONS_STREAM_NAME] = 'firehose-redemptions';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'vault',
        clientType: 'mobile',
        code: 'code',
        companyId: 2,
        memberId: '3',
        offerId: '1',
      });

      // Act
      await dwhRepository.logRedemption(dto);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('firehose-redemptions');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);

      expect(JSON.parse(data)).toStrictEqual({
        redemptiontype: 'vault',
        clienttype: 'mobile',
        code: 'code',
        actiontime: '2021-09-01T00:00:00.000Z',
        companyid: '2',
        memberid: '3',
        offerid: '1',
        origin: 'new stack',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'vault',
        clientType: 'mobile',
        code: 'code',
        companyId: 2,
        memberId: '3',
        offerId: '1',
      });

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logRedemption(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logCallbackEagleEyeVaultRedemption', () => {
    const testStreamName = 'firehose-callback';
    const testEagleEyeData = eagleEyeModelFactory.build();

    it('should send the correct data to the callback stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME] = testStreamName;
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logCallbackEagleEyeVaultRedemption(testEagleEyeData);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe(testStreamName);
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);
      expect(JSON.parse(data)).toStrictEqual({
        account_id: testEagleEyeData.accountId,
        account_status: testEagleEyeData.accountStatus,
        account_type_id: testEagleEyeData.accountTypeId,
        account_transaction_id: testEagleEyeData.accountTransactionId,
        account_type: testEagleEyeData.accountType,
        account_sub_type: testEagleEyeData.accountSubType,
        balances: {
          available: testEagleEyeData.balances.available,
          refundable: testEagleEyeData.balances.refundable,
        },
        issuer_id: testEagleEyeData.issuerId,
        resource_id: testEagleEyeData.resourceId,
        resource_type: testEagleEyeData.resourceType,
        token: testEagleEyeData.token,
        token_dates: {
          start: testEagleEyeData.tokenDates.start,
          end: testEagleEyeData.tokenDates.end,
        },
        token_id: testEagleEyeData.tokenId,
        token_status: testEagleEyeData.tokenStatus,
        consumer_id: testEagleEyeData.consumerId,
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME] = testStreamName;
      const dwhRepository = new DwhRepository();

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logCallbackEagleEyeVaultRedemption(testEagleEyeData);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logCallbackUniqodoVaultRedemption', () => {
    const testStreamName = 'firehose-callback';
    const testUniqodoData = uniqodoModelFactory.build();

    it('should send the correct data to the callback stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME] = testStreamName;
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logCallbackUniqodoVaultRedemption(testUniqodoData);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe(testStreamName);
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);
      expect(JSON.parse(data)).toStrictEqual({
        claim: {
          expires_at: testUniqodoData.claim.expiresAt,
          code: testUniqodoData.claim.code,
          created_at: testUniqodoData.claim.createdAt,
          deactivated_at: testUniqodoData.claim.deactivatedAt,
          linked_unique_reference: testUniqodoData.claim.linkedUniqueReference,
          promotion_id: testUniqodoData.claim.promotionId,
        },
        promotion: {
          id: testUniqodoData.promotion.id,
          status: testUniqodoData.promotion.status,
          code_type: testUniqodoData.promotion.codeType,
          timezone: testUniqodoData.promotion.timezone,
          redemptions_per_code: testUniqodoData.promotion.redemptionsPerCode,
          title: testUniqodoData.promotion.title,
          reward_type: testUniqodoData.promotion.rewardType,
          reward: {
            type: testUniqodoData.promotion.reward.type,
            amount: testUniqodoData.promotion.reward.amount,
            discount_type: testUniqodoData.promotion.reward.discountType,
            up_to_maximum_of: testUniqodoData.promotion.reward.upToMaximumOf,
            product_exclusion_rule: testUniqodoData.promotion.reward.productExclusionRule,
          },
          available_to_claim: testUniqodoData.promotion.availableToClaim,
          available_to_redeem: testUniqodoData.promotion.availableToRedeem,
          start_date: testUniqodoData.promotion.startDate,
          end_date: testUniqodoData.promotion.endDate,
          terms: testUniqodoData.promotion.terms,
          code_expiry: testUniqodoData.promotion.codeExpiry,
          code_expiry_unit: testUniqodoData.promotion.codeExpiryUnit,
        },
        customer: testUniqodoData.customer,
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME] = testStreamName;
      const dwhRepository = new DwhRepository();

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logCallbackUniqodoVaultRedemption(testUniqodoData);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
