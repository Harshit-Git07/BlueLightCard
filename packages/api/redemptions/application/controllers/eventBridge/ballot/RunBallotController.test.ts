import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { RedemptionsBallotEvents } from '@blc-mono/redemptions/infrastructure/eventBridge/events/ballot';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { UnknownEventBridgeEvent } from '../EventBridgeController';

import { RunBallotController } from './RunBallotController';

describe('RunBallotController', () => {
  describe('invoke', () => {
    it('should invoke the handle method', async () => {
      const testLogger = createTestLogger();
      const ballotService = {
        findBallotsForDrawDate: jest.fn(),
        runSingleBallot: jest.fn(),
        notifyEntriesOfBallotOutcome: jest.fn(),
      } satisfies IBallotService;
      const controller = new RunBallotController(testLogger, ballotService);
      const mockEvent = {
        source: RedemptionsBallotEvents.BALLOT_RUN,
        'detail-type': RedemptionsBallotEvents.BALLOT_RUN_DETAIL,
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {
          ballotId: faker.string.uuid(),
        },
      } satisfies UnknownEventBridgeEvent;

      await controller.invoke(mockEvent);
    });
  });
});
