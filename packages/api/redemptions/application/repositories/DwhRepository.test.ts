import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { mockClient } from 'aws-sdk-client-mock';

import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';

import { DwhRepository } from './DwhRepository';

jest.useFakeTimers({
  now: new Date('2021-09-01T00:00:00.000Z'),
});

describe('DwhRepository', () => {
  const mockFirehoseClient = mockClient(FirehoseClient);

  afterEach(() => {
    mockFirehoseClient.reset();
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME];
    delete process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VAULT_CLICK_STREAM_NAME];
  });

  describe('logOfferView', () => {
    it('should send the correct data to the firehose stream', async () => {
      // Arrange
      const steamName = 'compViewStream';
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VIEW_STREAM_NAME] = steamName;
      const offerId = 1;
      const companyId = 2;
      const memberId = '3';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logOfferView(offerId, companyId, memberId);

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
  });

  describe('logRedemptionAttempt', () => {
    it('should send the correct data to the firehose stream', async () => {
      // Arrange
      const steamName = 'compClickStream';
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_CLICK_STREAM_NAME] = steamName;
      const offerId = 1;
      const companyId = 2;
      const memberId = '3';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logRedemptionAttempt(offerId, companyId, memberId);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compClickStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"cid":"2","oid_":1,"mid":"3","timedate":"2021-09-01T00:00:00.000Z","type":1,"origin":"offer_sheet"}"`,
      );
    });
  });

  describe('logVaultRedemption', () => {
    it('should send the correct data to the firehose stream', async () => {
      // Arrange
      const steamName = 'compVaultClickStream';
      process.env[RedemptionsStackEnvironmentKeys.DWH_FIREHOSE_COMP_VAULT_CLICK_STREAM_NAME] = steamName;
      const offerId = 1;
      const companyId = 2;
      const memberId = '3';
      mockFirehoseClient.on(PutRecordCommand);
      const dwhRepository = new DwhRepository();

      // Act
      await dwhRepository.logVaultRedemption(offerId, companyId, memberId);

      // Assert
      const calls = mockFirehoseClient.calls();
      expect(calls.length).toBe(1);
      const putCommand = calls[0].args[0] as PutRecordCommand;
      expect(putCommand.input.DeliveryStreamName).toBe('compVaultClickStream');
      const data = new TextDecoder().decode(putCommand.input.Record!.Data!);
      expect(data).toMatchInlineSnapshot(
        `"{"company_id":2,"offer_id":"1","member_id":3,"timedate":"2021-09-01T00:00:00.000Z","type":1}"`,
      );
    });
  });
});
