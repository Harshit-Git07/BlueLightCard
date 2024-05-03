import 'aws-sdk-client-mock-jest';

import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { faker } from '@faker-js/faker';
import { afterEach, describe, it } from '@jest/globals';
import { mockClient } from 'aws-sdk-client-mock';

import { ClientTypeSchema } from '@blc-mono/core/schemas/domain';
import { MemberRetrievedRedemptionDetailsEventDetail } from '@blc-mono/core/schemas/redemptions';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { redemptionTypeEnum } from '@blc-mono/redemptions/libs/database/schema';

import { RedemptionsEventsRepository } from './RedemptionsEventsRepository';

describe('RedemptionsEventsRepository', () => {
  afterEach(() => {
    delete process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME];
  });

  describe('publishMemberRetrievedRedemptionDetailsEvent', () => {
    it('should publish an event to the correct event bus', async () => {
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand);
      const detail: MemberRetrievedRedemptionDetailsEventDetail = {
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
          offerId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      };

      // Act
      await repository.publishMemberRetrievedRedemptionDetailsEvent(detail);

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
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand);
      const detail: MemberRetrievedRedemptionDetailsEventDetail = {
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
          offerId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      };

      // Act
      await repository.publishMemberRetrievedRedemptionDetailsEvent(detail);

      // Assert
      expect(mockEventBridgeClient).toHaveReceivedCommandTimes(PutEventsCommand, 1);
      const firstCall = mockEventBridgeClient.commandCalls(PutEventsCommand)[0];
      const receivedDetail = JSON.parse(firstCall.args[0].input.Entries!.at(0)!.Detail!);
      expect(receivedDetail).toEqual({
        memberDetails: {
          memberId: detail.memberDetails.memberId,
        },
        redemptionDetails: {
          redemptionType: detail.redemptionDetails.redemptionType,
          clientType: detail.redemptionDetails.clientType,
          companyId: detail.redemptionDetails.companyId,
          offerId: detail.redemptionDetails.offerId,
        },
      });
    });

    it('should bubble errors to the caller', async () => {
      // Arrange
      const eventBusName = 'test-event-bus-name';
      process.env[RedemptionsStackEnvironmentKeys.REDEMPTIONS_EVENT_BUS_NAME] = eventBusName;
      const repository = new RedemptionsEventsRepository();
      const mockEventBridgeClient = mockClient(EventBridgeClient);
      mockEventBridgeClient.on(PutEventsCommand).rejects('test error');
      const detail: MemberRetrievedRedemptionDetailsEventDetail = {
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
          offerId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      };

      // Act
      const result = repository.publishMemberRetrievedRedemptionDetailsEvent(detail);

      // Assert
      expect(result).rejects.toThrow('test error');
    });
  });
});
