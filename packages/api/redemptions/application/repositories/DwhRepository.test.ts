import { FirehoseClient, PutRecordBatchCommand, PutRecordCommand } from '@aws-sdk/client-firehose';
import { faker } from '@faker-js/faker';
import { mockClient } from 'aws-sdk-client-mock';

import { ClientType } from '@blc-mono/core/schemas/domain';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { eagleEyeModelFactory, uniqodoModelFactory } from '@blc-mono/redemptions/libs/test/factories/callback.factory';

import { MemberRedemptionParamsDto } from '../services/DWH/dwhLoggingService';

import { DwhRepository, VaultBatchStockData, VaultStockData } from './DwhRepository';

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
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STOCK_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_BATCH_STOCK_STREAM_NAME];
    delete process.env.BRAND;
  });

  describe('logOfferView', () => {
    it('should send the correct data to the compView (web) stream when the client type is web', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME] = 'compViewStream';
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
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
      const data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        cid: companyId,
        oid_: offerId,
        mid: '3',
        timedate: '2021-09-01T00:00:00.000Z',
        type: 1,
        origin: 'offer_sheet',
      });
    });

    it('should send the correct data to the compAppView (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
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
      const data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        cid: companyId,
        oid_: offerId,
        mid: '3',
        timedate: '2021-09-01T00:00:00.000Z',
        type: 5,
        origin: 'offer_sheet',
      });
    });

    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_VIEW_STREAM_NAME] = 'compAppViewStream';
        const offerId = faker.string.uuid();
        const companyId = faker.string.uuid();
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
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
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
      const data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        company_id: companyId,
        offer_id: offerId,
        member_id: '3',
        timedate: '2021-09-01T00:00:00.000Z',
        type: 2,
        origin: 'offer_sheet',
      });
    });
    it('should send the correct data to the compAppClick (app) stream when the client type is mobile', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compAppClickStream';
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
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
      const data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        company_id: companyId,
        offer_id: offerId,
        member_id: '3',
        timedate: '2021-09-01T00:00:00.000Z',
        type: 4,
        origin: 'offer_sheet',
      });
    });
    it.each(['web', 'mobile'] satisfies ClientType[])(
      'should bubble exceptions from the firehose client to the caller when the client type is %s',
      async (clientType) => {
        // Arrange
        process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_APP_CLICK_STREAM_NAME] = 'compClickStream';
        const offerId = faker.string.uuid();
        const companyId = faker.string.uuid();
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
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_MEMBER_REDEMPTIONS_STREAM_NAME] = 'redemption';
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const code = 'code';
      const memberId = '3';
      const integration = 'uniqodo';
      const integrationId = 'uniqodo-id';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logVaultRedemption(offerId, companyId, memberId, code, integration, integrationId);
      await dwhRepository.logRedemptions({
        data: {
          offerId,
          companyId,
          memberId,
          code,
          integration,
          integrationId,
          redemptionType: 'vault',
          clientType: 'mobile',
          eventTime: '2024-12-05T00:00:00.000Z',
          vaultId: 'vault-id',
          brand: 'BLC_UK',
        },
      });

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(2);
      let putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('vaultStream');
      let data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        compid: companyId,
        code: 'code',
        uid: '3',
        whenrequested: '2021-09-01T00:00:00.000Z',
        offer_id: offerId,
        integration: 'uniqodo',
        integration_id: 'uniqodo-id',
      });
      putCommand = calls[1].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('redemption');
      data = JSON.parse(new TextDecoder().decode(putCommand.input.Record!.Data!));
      expect(data).toStrictEqual({
        company_id: companyId,
        code: 'code',
        member_id: '3',
        event_time: '2024-12-05T00:00:00.000Z',
        offer_id: offerId,
        vault_id: 'vault-id',
        client_type: 'mobile',
        brand: 'BLC_UK',
        origin: 'new stack',
        redemption_type: 'vault',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'vaultStream';
      const offerId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const code = 'code';
      const memberId = '3';
      const integration = 'uniqodo';
      const integrationId = faker.string.numeric(10);
      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');
      const dwhRepository = new DwhRepository();

      // Act
      const result = dwhRepository.logVaultRedemption(offerId, companyId, memberId, code, integration, integrationId);

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
      const companyId = faker.string.uuid();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'vault',
        clientType: 'mobile',
        code: 'code',
        companyId: companyId,
        memberId: '3',
        offerId: '1',
        integration: 'uniqodo',
        integrationId: 'uniqodo-id',
        eventTime: '2024-12-05T00:00:00.000Z',
        vaultId: 'vault-id',
        brand: 'BLC_UK',
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
        companyid: companyId,
        memberid: '3',
        offerid: '1',
        origin: 'new stack',
        integration: 'uniqodo',
        integration_id: 'uniqodo-id',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();
      const companyId = faker.string.uuid();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'vault',
        clientType: 'mobile',
        code: 'code',
        companyId: companyId,
        memberId: '3',
        offerId: '1',
        integration: 'uniqodo',
        integrationId: 'uniqodo-id',
        vaultId: '2',
        brand: 'BLC_UK',
        eventTime: '2024-12-05T00:00:00.000Z',
      });

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logRedemption(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logRedemptions', () => {
    it('should send the correct data to the redemption stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_MEMBER_REDEMPTIONS_STREAM_NAME] = 'firehose-redemption';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();
      const companyId = faker.string.uuid();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'generic',
        clientType: 'mobile',
        code: 'code',
        companyId: companyId,
        memberId: '3',
        offerId: '1',
        eventTime: '2024-12-09T00:00:00.000Z',
        brand: 'BLC_UK',
      });

      // Act
      await dwhRepository.logRedemptions(dto);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('firehose-redemption');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data);

      expect(JSON.parse(data)).toStrictEqual({
        redemption_type: 'generic',
        client_type: 'mobile',
        code: 'code',
        event_time: '2024-12-09T00:00:00.000Z',
        company_id: companyId,
        member_id: '3',
        offer_id: '1',
        origin: 'new stack',
        brand: 'BLC_UK',
        vault_id: '',
      });
    });
    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STREAM_NAME] = 'firehose-redemptions';
      const dwhRepository = new DwhRepository();
      const companyId = faker.string.uuid();

      const dto = new MemberRedemptionParamsDto({
        redemptionType: 'generic',
        clientType: 'mobile',
        code: 'code',
        companyId: companyId,
        memberId: '3',
        offerId: '1',
        brand: 'BLC_UK',
        eventTime: '2024-12-09T00:00:00.000Z',
      });

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logRedemptions(dto);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logCallbackEagleEyeVaultRedemption', () => {
    const testStreamName = 'firehose-callback';
    const testEagleEyeData = eagleEyeModelFactory.build();

    it('should send the correct data to the callback stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME] = testStreamName;
      process.env.BRAND = 'BLC_UK';
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
        offer_id: testEagleEyeData.accountTransactionId,
        company_id: testEagleEyeData.consumerId,
        brand: process.env.BRAND,
        member_id: testEagleEyeData.memberId,
        code: testEagleEyeData.tokenId,
        order_value: testEagleEyeData.parentUnitId.toString(),
        event_time: testEagleEyeData.eventTime,
        currency: testEagleEyeData.location.incomingIdentifier,
        integration_type: 'eagleeye',
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME] = testStreamName;
      process.env.BRAND = 'BLC_UK';
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
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_INTEGRATION_STREAM_NAME] = testStreamName;
      process.env.BRAND = 'DDS_UK';
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
        offer_id: testUniqodoData.offer_id,
        company_id: testUniqodoData.merchant_id,
        brand: process.env.BRAND,
        member_id: testUniqodoData.member_id,
        code: testUniqodoData.code,
        order_value: testUniqodoData.order_value,
        event_time: testUniqodoData.redeemed_at,
        integration_type: 'uniqodo',
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault stream', async () => {
      // Arrange
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_CALLBACK_STREAM_NAME] = testStreamName;
      process.env.BRAND = 'DDS_UK';
      const dwhRepository = new DwhRepository();

      mockFirehoseClient.on(PutRecordCommand).rejects('reject stream');

      // Act
      const result = dwhRepository.logCallbackUniqodoVaultRedemption(testUniqodoData);

      // Assert
      await expect(result).rejects.toThrow();
    });
  });

  describe('logVaultStock', () => {
    const vaultStockStream = 'vault-stock-stream';
    const vaultStockTestBrand = 'BLC_UK';
    const vaultStockData = [
      {
        vaultId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
        manager: faker.internet.email(),
        unclaimed: faker.number.int({ min: 1, max: 1000 }),
        isActive: 'true',
        vaultProvider: 'whoever',
      },
    ] satisfies VaultStockData[];

    it('should send data to the vault stock stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STOCK_STREAM_NAME] = vaultStockStream;
      process.env.BRAND = vaultStockTestBrand;
      mockFirehoseClient.on(PutRecordBatchCommand);
      const dwhRepository = new DwhRepository();
      await dwhRepository.logVaultStock(vaultStockData);

      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putRecordBatchCommand = calls[0].args[0] as PutRecordBatchCommand;
      expect(putRecordBatchCommand.input.DeliveryStreamName).toBe(vaultStockStream);
      const data = new TextDecoder().decode(putRecordBatchCommand.input.Records![0].Data);
      expect(JSON.parse(data)).toStrictEqual({
        vault_id: vaultStockData[0].vaultId,
        offer_id: vaultStockData[0].offerId,
        company_id: vaultStockData[0].companyId,
        brand: vaultStockTestBrand,
        manager: vaultStockData[0].manager,
        unclaimed: vaultStockData[0].unclaimed,
        update_time: '2021-09-01T00:00:00.000Z',
        is_active: vaultStockData[0].isActive,
        vault_provider: vaultStockData[0].vaultProvider,
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault stock stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_STOCK_STREAM_NAME] = vaultStockStream;
      process.env.BRAND = vaultStockTestBrand;
      const dwhRepository = new DwhRepository();

      mockFirehoseClient.on(PutRecordBatchCommand).rejects('reject stream');

      const result = dwhRepository.logVaultStock(vaultStockData);
      await expect(result).rejects.toThrow();
    });
  });

  describe('logVaultBatchStock', () => {
    const vaultBatchStockStream = 'vault-batch-stock-stream';
    const vaultBatchStockTestBrand = 'BLC_UK';
    const vaultBatchStockData = [
      {
        batchId: faker.string.uuid(),
        offerId: faker.string.uuid(),
        companyId: faker.string.uuid(),
        batchExpires: new Date('2029-12-31T23:59:59.999Z'),
        batchCount: faker.number.int({ min: 1, max: 1000 }),
      },
    ] satisfies VaultBatchStockData[];

    it('should send data to the vault batch stock stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_BATCH_STOCK_STREAM_NAME] = vaultBatchStockStream;
      process.env.BRAND = vaultBatchStockTestBrand;
      mockFirehoseClient.on(PutRecordBatchCommand);
      const dwhRepository = new DwhRepository();
      await dwhRepository.logVaultBatchStock(vaultBatchStockData);

      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putRecordBatchCommand = calls[0].args[0] as PutRecordBatchCommand;
      expect(putRecordBatchCommand.input.DeliveryStreamName).toBe(vaultBatchStockStream);
      const data = new TextDecoder().decode(putRecordBatchCommand.input.Records![0].Data);
      expect(JSON.parse(data)).toStrictEqual({
        batch_id: vaultBatchStockData[0].batchId,
        offer_id: vaultBatchStockData[0].offerId,
        company_id: vaultBatchStockData[0].companyId,
        brand: vaultBatchStockTestBrand,
        batch_expires: vaultBatchStockData[0].batchExpires.toISOString(),
        batch_count: vaultBatchStockData[0].batchCount,
        update_time: '2021-09-01T00:00:00.000Z',
      });
    });

    it('should bubble exceptions from the firehose client to the caller unable to reach vault batch stock stream', async () => {
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_VAULT_BATCH_STOCK_STREAM_NAME] = vaultBatchStockStream;
      process.env.BRAND = vaultBatchStockTestBrand;
      const dwhRepository = new DwhRepository();

      mockFirehoseClient.on(PutRecordBatchCommand).rejects('reject stream');

      const result = dwhRepository.logVaultBatchStock(vaultBatchStockData);
      await expect(result).rejects.toThrow();
    });
  });
});
