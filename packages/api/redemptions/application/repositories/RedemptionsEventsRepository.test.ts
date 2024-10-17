import 'aws-sdk-client-mock-jest';

import {
  EventBridgeClient,
  EventBridgeClientResolvedConfig,
  PutEventsCommand,
  ServiceInputTypes,
  ServiceOutputTypes,
} from '@aws-sdk/client-eventbridge';
import { faker } from '@faker-js/faker';
import { afterEach, describe, it } from '@jest/globals';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';

import { ClientTypeSchema } from '@blc-mono/core/schemas/domain';
import {
  MemberRedemptionEventDetail,
  MemberRetrievedRedemptionDetailsEventDetail,
} from '@blc-mono/core/schemas/redemptions';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';
import { memberRedemptionEventFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';

import { VaultBatchCreatedEventDetail } from '../controllers/eventBridge/vaultBatch/VaultBatchCreatedController';

import { RedemptionsEventsRepository } from './RedemptionsEventsRepository';

describe('RedemptionsEventsRepository', () => {
  const eventBusName = 'test-event-bus-name';
  const repository = new RedemptionsEventsRepository();
  let mockEventBridgeClient: AwsStub<ServiceInputTypes, ServiceOutputTypes, EventBridgeClientResolvedConfig>;

  beforeEach(() => {
    mockEventBridgeClient = mockClient(EventBridgeClient);
    mockEventBridgeClient.on(PutEventsCommand);
    process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
  });

  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME];
  });

  describe('publishMemberRetrievedRedemptionDetailsEvent', () => {
    // Arrange
    const defaultPublishMemberRetrievedRedemptionDetail: MemberRetrievedRedemptionDetailsEventDetail = {
      memberDetails: {
        memberId: faker.number
          .int({
            min: 1,
            max: 1_000_000,
          })
          .toString(),
      },
      redemptionDetails: {
        redemptionType: faker.helpers.arrayElement(redemptionTypeEnum.enumValues),
        clientType: faker.helpers.arrayElement(Object.values(ClientTypeSchema.Values)),
        companyId: faker.number.int({
          min: 1,
          max: 1_000_000,
        }),
        offerId: faker.string.uuid(),
      },
    };

    it('should publish an event to the correct event bus', async () => {
      // Act
      await repository.publishMemberRetrievedRedemptionDetailsEvent(defaultPublishMemberRetrievedRedemptionDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
          }),
        ],
      });
    });

    it('should publish the correct event details', async () => {
      // Act
      await repository.publishMemberRetrievedRedemptionDetailsEvent(defaultPublishMemberRetrievedRedemptionDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetailString = firstCall.args[0].input.Entries!.at(0)!.Detail!;
      const receivedDetail = JSON.parse(receivedDetailString);
      expect(receivedDetail).toEqual({
        memberDetails: {
          memberId: defaultPublishMemberRetrievedRedemptionDetail.memberDetails.memberId,
        },
        redemptionDetails: {
          redemptionType: defaultPublishMemberRetrievedRedemptionDetail.redemptionDetails.redemptionType,
          clientType: defaultPublishMemberRetrievedRedemptionDetail.redemptionDetails.clientType,
          companyId: defaultPublishMemberRetrievedRedemptionDetail.redemptionDetails.companyId,
          offerId: defaultPublishMemberRetrievedRedemptionDetail.redemptionDetails.offerId,
        },
      });
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      mockEventBridgeClient.on(PutEventsCommand).rejects('test error');

      // Act
      const result = repository.publishMemberRetrievedRedemptionDetailsEvent(
        defaultPublishMemberRetrievedRedemptionDetail,
      );

      // Assert
      await expect(result).rejects.toThrow('test error');
    });
  });

  describe('publishVaultBatchCreatedEvent', () => {
    // Arrange
    const defaultPublishVaultBatchCreatedDetail: VaultBatchCreatedEventDetail = {
      batchId: faker.string.uuid(),
      vaultId: faker.string.uuid(),
      codeInsertFailArray: [],
      countCodeInsertFail: 0,
      countCodeInsertSuccess: 0,
      fileName: faker.system.fileName(),
    };

    it('should publish an event to the correct event bus', async () => {
      // Act
      await repository.publishVaultBatchCreatedEvent(defaultPublishVaultBatchCreatedDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
          }),
        ],
      });
    });

    it('should publish the correct event details', async () => {
      // Act
      await repository.publishVaultBatchCreatedEvent(defaultPublishVaultBatchCreatedDetail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetailString = firstCall.args[0].input.Entries!.at(0)!.Detail!;
      const receivedDetail = JSON.parse(receivedDetailString);
      expect(receivedDetail).toEqual(defaultPublishVaultBatchCreatedDetail);
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      mockEventBridgeClient.on(PutEventsCommand).rejects('test error');

      // Act
      const result = repository.publishVaultBatchCreatedEvent(defaultPublishVaultBatchCreatedDetail);

      // Assert
      await expect(result).rejects.toThrow('test error');
    });
  });

  describe('publishRedemptionEvent', () => {
    const createRedemptionDetails = () => memberRedemptionEventFactory.build().detail;

    it('publishes to the correct event bus', async () => {
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand);
      const detail: MemberRedemptionEventDetail = createRedemptionDetails();

      // Act
      await repository.publishRedemptionEvent(detail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      expect(mockEventBridgeClient).toHaveReceivedCommandWith(PutEventsCommand, {
        Entries: [
          expect.objectContaining({
            EventBusName: eventBusName,
          }),
        ],
      });
    });

    it('publishes the correct event details', async () => {
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand);
      const detail: MemberRedemptionEventDetail = createRedemptionDetails();

      // Act
      await repository.publishRedemptionEvent(detail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetail = JSON.parse(firstCall.args[0].input.Entries!.at(0)!.Detail ?? '');
      expect(receivedDetail).toStrictEqual(detail);
    });

    it('bubbles errors to the caller', async () => {
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand).rejects('test error');
      const detail = createRedemptionDetails();

      await expect(() => repository.publishRedemptionEvent(detail)).rejects.toThrow('test error');
    });
  });
});
