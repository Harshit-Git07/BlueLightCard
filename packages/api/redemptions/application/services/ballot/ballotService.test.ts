import { endOfDay, startOfDay } from 'date-fns';

import { as } from '@blc-mono/core/utils/testing';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IBallotsRepository } from '../../repositories/BallotsRepository';
import { IRedemptionsEventsRepository } from '../../repositories/RedemptionsEventsRepository';

import { BallotService } from './BallotService';

describe('BallotService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBallotsRepository = (ballots: string[]): Partial<IBallotsRepository> => ({
    findBallotsForDrawDate: jest.fn().mockResolvedValue(ballots),
  });

  const mockRedemptionsEventsRepository = (): Partial<IRedemptionsEventsRepository> => ({
    publishRunBallotEvent: jest.fn(),
  });

  const mockDateRange = (): [Date, Date] => [startOfDay(new Date()), endOfDay(new Date())];

  describe('when searching for ballots and ballots are found', () => {
    it('should publish event for each ballot id', async () => {
      const dateRange = mockDateRange();
      const ballots = ['ballotId1', 'ballotId2'] as string[];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();
      const service = new BallotService(mockedLogger, as(ballotsRepository), as(eventsRepository));

      await service.findBallotsForDrawDate();

      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledTimes(1);
      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledWith(...dateRange);

      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledTimes(2);
      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledWith(ballots[0]);
      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledWith(ballots[1]);
    });
  });

  describe('when searching for ballots and no ballots are found', () => {
    it('should not publish any events', async () => {
      const dateRange = mockDateRange();
      const ballots = [] as string[];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();
      const service = new BallotService(mockedLogger, as(ballotsRepository), as(eventsRepository));

      await service.findBallotsForDrawDate();

      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledTimes(1);
      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledWith(...dateRange);

      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('when publishing events fails', () => {
    it('should continue to publish events for other ballots', async () => {
      const dateRange = mockDateRange();
      const ballots = ['ballotId1', 'ballotId1'] as string[];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();

      eventsRepository.publishRunBallotEvent = jest.fn().mockRejectedValueOnce(new Error());

      const service = new BallotService(mockedLogger, as(ballotsRepository), as(eventsRepository));

      await service.findBallotsForDrawDate();

      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledTimes(1);
      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledWith(...dateRange);

      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledTimes(2);
    });
  });
});
