import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { ballotEntryStatusEnum } from '../../../../libs/database/schema';
import { UnknownEventBridgeEvent } from '../EventBridgeController';

import { UnsuccessfulBallotController } from './UnsuccessfulBallotController';

describe('UnsuccessfulBallotController', () => {
  describe('invoke', () => {
    it('should invoke the handle method', async () => {
      const fakeBallotId = faker.string.uuid();
      const testLogger = createTestLogger();
      const ballotService = {
        findBallotsForDrawDate: jest.fn(),
        runSingleBallot: jest.fn(),
        notifyEntriesOfBallotOutcome: jest.fn(),
      } satisfies IBallotService;
      const controller = new UnsuccessfulBallotController(testLogger, ballotService);
      const mockEvent = {
        source: RedemptionsBallotEvents.BALLOT_UNSUCCESSFUL,
        'detail-type': RedemptionsBallotEvents.BALLOT_RUN_DETAIL,
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {
          ballotId: fakeBallotId,
        },
      } satisfies UnknownEventBridgeEvent;

      await controller.invoke(mockEvent);
      expect(ballotService.notifyEntriesOfBallotOutcome).toHaveBeenCalledWith(
        fakeBallotId,
        ballotEntryStatusEnum.enumValues[1],
      );
    });
  });
});
