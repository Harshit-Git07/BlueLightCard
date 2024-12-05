import { endOfDay, set, startOfDay } from 'date-fns';

import { as } from '@blc-mono/core/utils/testing';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { ballotEntryStatusEnum } from '../../../libs/database/schema';
import { BallotEntriesEntity, IBallotEntriesRepository } from '../../repositories/BallotEntriesRepository';
import { BallotEntity, IBallotsRepository } from '../../repositories/BallotsRepository';
import { IRedemptionsEventsRepository } from '../../repositories/RedemptionsEventsRepository';
import { RedemptionCustomAttributeTransformer } from '../../transformers/RedemptionCustomAttributeTransformer';
import { IEmailService, UserWithAttribute } from '../email/EmailService';

import { BallotService } from './BallotService';

describe('BallotService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const dummyUsersWithAttributes: UserWithAttribute[] = [
    {
      external_id: 'dummyExternalId',
      dummyCustomAttribute: true,
    },
  ];

  const mockBallotsRepository = (ballots: { id: string }[] | undefined): Partial<IBallotsRepository> => ({
    findBallotsForDrawDate: jest.fn().mockResolvedValue(ballots),
    findOneById: jest.fn().mockResolvedValue(ballots?.[0]),
    updateBallotStatus: jest.fn(),
  });

  const mockBallotsEntriesRepository = (ballotEntries: { id: string }[]): Partial<IBallotEntriesRepository> => ({
    findByBallotIdAndStatus: jest.fn().mockResolvedValue(ballotEntries),
    findMemberIdsByBallotIdAndStatusWithLimitAndOffset: jest
      .fn()
      .mockImplementationOnce(() => Array(75).fill(ballotEntries[0]))
      .mockImplementationOnce(() => Array(50).fill(ballotEntries[1]))
      .mockImplementationOnce(() => []),
    updateManyBatchEntriesInArray: jest.fn(),
    updateManyBatchEntriesNotInArray: jest.fn(),
    withTransaction: jest.fn(),
  });

  const mockRedemptionsEventsRepository = (): Partial<IRedemptionsEventsRepository> => ({
    publishRunBallotEvent: jest.fn(),
    publishSuccessfulBallotEvent: jest.fn(),
    publishUnsuccessfulBallotEvent: jest.fn(),
  });

  const mockEmailService = (): Partial<IEmailService> => ({
    setCustomAttributes: jest.fn(),
  });

  const mockCustomAttributeTransformer: Partial<RedemptionCustomAttributeTransformer> = {
    transformToUsersWithCustomAttributes: jest.fn().mockReturnValue(dummyUsersWithAttributes),
  };

  const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

  const transactionManager: Partial<TransactionManager> = {
    withTransaction(callback) {
      return callback(as(mockDatabaseTransactionOperator));
    },
  };

  const ballot: BallotEntity = {
    id: 'ballotId1',
    drawDate: new Date(),
    redemptionId: 'someRedemptionId',
    totalTickets: 2,
    eventDate: new Date(),
    offerName: 'someOfferName',
    created: new Date(),
    status: 'pending',
  };

  const mockDateRange = (): [Date, Date] => [startOfDay(new Date()), endOfDay(new Date())];

  describe('when searching for ballots and ballots are found', () => {
    it('should publish event for each ballot id', async () => {
      const dateRange = mockDateRange();
      const ballots = [{ id: 'ballotId1' }, { id: 'ballotId1' }];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

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
      const ballots = [] as { id: string }[];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await service.findBallotsForDrawDate();

      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledTimes(1);
      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledWith(...dateRange);

      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledTimes(0);
    });
  });

  describe('when publishing events fails', () => {
    it('should continue to publish events for other ballots', async () => {
      const dateRange = mockDateRange();
      const ballots = [{ id: 'ballotId1' }, { id: 'ballotId1' }];
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(ballots);
      const eventsRepository = mockRedemptionsEventsRepository();
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await service.findBallotsForDrawDate();

      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledTimes(1);
      expect(ballotsRepository.findBallotsForDrawDate).toHaveBeenCalledWith(...dateRange);

      expect(eventsRepository.publishRunBallotEvent).toHaveBeenCalledTimes(2);
    });
  });

  describe('when running ballot for a single ballot and ballot not found', () => {
    it('should throw an error, ballot not found', async () => {
      const dateOfRun = new Date();
      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository(undefined);
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await expect(service.runSingleBallot('ballotId1', dateOfRun)).rejects.toThrow('No ballot found');
    });
  });

  describe('when running ballot for a single ballot and ballot is not pending', () => {
    it('should throw an error, ballot is not pending', async () => {
      const dateOfRun = new Date();
      ballot.status = 'drawing';

      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository([ballot]);
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const customAttributeTransformer = mockCustomAttributeTransformer;

      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(customAttributeTransformer),
      );

      await expect(service.runSingleBallot('ballotId1', dateOfRun)).rejects.toThrow('Ballot is not in a pending state');
    });
  });

  describe('when running ballot for a single ballot and ballot is not ready to run', () => {
    it('should throw an error, ballot not ready', async () => {
      const dateOfRun = new Date();
      const drawDate = set(new Date(), { hours: 21, minutes: 59, seconds: 59 });
      ballot.drawDate = drawDate;
      ballot.status = 'pending';

      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository([ballot]);
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await expect(service.runSingleBallot('ballotId1', dateOfRun)).rejects.toThrow(
        'This ballot is not ready to run, the current date is not the draw date or not after 10pm',
      );
    });
  });

  describe('when running ballot for a single ballot and no ballot entries are found', () => {
    it('should throw an error, no pending ballot entries', async () => {
      const dateOfRun = set(new Date(), { hours: 22, minutes: 1, seconds: 0 });
      const drawDate = set(new Date(), { hours: 22, minutes: 0, seconds: 0 });
      ballot.drawDate = drawDate;
      ballot.status = 'pending';

      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository([ballot]);
      const ballotsEntriesRepository = mockBallotsEntriesRepository([]);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await expect(service.runSingleBallot('ballotId1', dateOfRun)).rejects.toThrow('No pending ballot entries found');
    });
  });

  describe('when running ballot for a single valid ballot', () => {
    it('should complete the ballot run', async () => {
      const dateOfRun = set(new Date(), { hours: 22, minutes: 1, seconds: 0 });
      const drawDate = set(new Date(), { hours: 22, minutes: 0, seconds: 0 });
      ballot.drawDate = drawDate;
      ballot.status = 'pending';

      const ballotEntry: BallotEntriesEntity = {
        id: 'ballotEntryId1',
        ballotId: 'ballotId1',
        status: 'pending',
        created: new Date(),
        entryDate: new Date(),
        memberId: 'memberId1',
      };

      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository([ballot]);
      const ballotsEntriesRepository = mockBallotsEntriesRepository([ballotEntry]);
      ballotsEntriesRepository.withTransaction = jest.fn().mockReturnValue(ballotsEntriesRepository);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      await service.runSingleBallot('ballotId1', dateOfRun);

      expect(ballotsRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(ballotsEntriesRepository.findByBallotIdAndStatus).toHaveBeenCalledTimes(1);

      expect(ballotsEntriesRepository.updateManyBatchEntriesInArray).toHaveBeenCalledTimes(1);
      expect(ballotsEntriesRepository.updateManyBatchEntriesNotInArray).toHaveBeenCalledTimes(1);

      expect(eventsRepository.publishSuccessfulBallotEvent).toHaveBeenCalledTimes(1);
      expect(eventsRepository.publishUnsuccessfulBallotEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('when notifying entries of ballot outcome', () => {
    it('should batch db calls then transform the results for the email service', async () => {
      const ballotEntryStatus = ballotEntryStatusEnum.enumValues[3];
      const ballotId = 'ballotId1';
      const memberId = 'memberId';
      const ballotEntries: BallotEntriesEntity[] = [
        {
          id: 'ballotEntryId1',
          ballotId: ballotId,
          status: 'pending',
          created: new Date(),
          entryDate: new Date(),
          memberId: memberId,
        },
      ];

      const mockedLogger = createTestLogger();
      const ballotsRepository = mockBallotsRepository([ballot]);
      const ballotsEntriesRepository = mockBallotsEntriesRepository(ballotEntries);
      ballotsEntriesRepository.withTransaction = jest.fn().mockReturnValue(ballotsEntriesRepository);
      const eventsRepository = mockRedemptionsEventsRepository();
      const emailService = mockEmailService();
      const service = new BallotService(
        mockedLogger,
        as(ballotsRepository),
        as(eventsRepository),
        as(ballotsEntriesRepository),
        as(transactionManager),
        as(emailService),
        as(mockCustomAttributeTransformer),
      );

      const expectedLog = {
        message: `All set custom attribute promises resolved`,
        context: { message: `BallotService.notifyEntriesOfBallotOutcome: ${ballotEntryStatus}` },
      };

      await service.notifyEntriesOfBallotOutcome(ballotId, ballotEntryStatus);

      expect(ballotsEntriesRepository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset).toHaveBeenCalledTimes(3);
      expect(mockCustomAttributeTransformer.transformToUsersWithCustomAttributes).toHaveBeenCalledTimes(2);
      expect(emailService.setCustomAttributes).toHaveBeenNthCalledWith(1, dummyUsersWithAttributes);
      expect(emailService.setCustomAttributes).toHaveBeenNthCalledWith(2, dummyUsersWithAttributes);
      expect(mockedLogger.info).toHaveBeenCalledWith(expectedLog);
    });
  });
});
