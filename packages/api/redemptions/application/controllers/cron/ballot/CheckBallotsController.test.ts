import { faker } from '@faker-js/faker';
import { describe } from '@jest/globals';

import { UnknownScheduledEvent } from '@blc-mono/redemptions/application/controllers/cron/CronController';
import { IBallotService } from '@blc-mono/redemptions/application/services/ballot/BallotService';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { CheckBallotsController } from './CheckBallotsController';

describe('CheckBallotsController', () => {
  describe('invoke', () => {
    it('should invoke the handle method', async () => {
      const testLogger = createTestLogger();
      const ballotService = {
        findBallotsForDrawDate: jest.fn(),
        runSingleBallot: jest.fn(),
        notifyEntriesOfBallotOutcome: jest.fn(),
      } satisfies IBallotService;
      const controller = new CheckBallotsController(testLogger, ballotService);
      const mockEvent = {
        source: 'aws.events',
        'detail-type': 'Scheduled Event',
        account: faker.string.numeric(),
        id: faker.string.uuid(),
        time: faker.date.recent().toISOString(),
        region: faker.helpers.arrayElement(['eu-west-2', 'ap-southeast-2']),
        resources: [],
        version: faker.string.numeric(),
        detail: {},
      } satisfies UnknownScheduledEvent;

      await controller.invoke(mockEvent);

      expect(ballotService.findBallotsForDrawDate).toHaveBeenCalled();
    });
  });
});
