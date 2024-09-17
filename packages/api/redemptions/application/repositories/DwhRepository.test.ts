import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { mockClient } from 'aws-sdk-client-mock';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

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
  });

  describe('logOfferView', () => {
    it('should send the correct data to the compView (web) stream when the client type is web', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME] = 'compViewStream';
      const offerId = 1;
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
        `"{"cid":"2","oid_":1,"mid":"3","timedate":"2021-09-01T00:00:00.000Z","type":1,"origin":"offer_sheet"}"`,
      );
    });

    it('should send the correct data to the compAppView (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
      const offerId = 1;
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
        `"{"cid":"2","oid_":1,"mid":"3","timedate":"2021-09-01T00:00:00.000Z","type":5,"origin":"offer_sheet"}"`,
      );
    });

    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
        const offerId = 1;
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
      const offerId = 1;
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
        `"{"company_id":"2","offer_id":1,"member_id":"3","timedate":"2021-09-01T00:00:00.000Z","type":2,"origin":"offer_sheet"}"`,
      );
    });
    it('should send the correct data to the compAppClick (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compAppClickStream';
      const offerId = 1;
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
        `"{"company_id":"2","offer_id":1,"member_id":"3","timedate":"2021-09-01T00:00:00.000Z","type":4,"origin":"offer_sheet"}"`,
      );
    });
    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compClickStream';
        const offerId = 1;
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
      const offerId = 1;
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
      const offerId = 1;
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
        offerId: 1,
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
        offerId: 1,
      });

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logRedemption(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });
});
