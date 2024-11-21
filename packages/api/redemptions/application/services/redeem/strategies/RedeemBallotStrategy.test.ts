import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { IBallotEntriesRepository } from '@blc-mono/redemptions/application/repositories/BallotEntriesRepository';
import { IBallotsRepository } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { ballotEntryStatusEnum } from '@blc-mono/redemptions/libs/database/schema';
import {
  ballotActiveEntityFactory,
  ballotEndedEntityFactory,
} from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createSilentLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemBallotStrategy } from './RedeemBallotStrategy';

describe('BallotRedemptioStrategy', () => {
  const defaultParams: RedeemParams = {
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.company.name(),
    memberId: '12345',
    offerName: faker.lorem.words(3),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
    memberEmail: faker.internet.url(),
  };

  function mockEventsRepository(): IRedemptionsEventsRepository {
    return {
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
      publishRunBallotEvent: jest.fn(),
    };
  }

  function mockBallotsRepository(): IBallotsRepository {
    return {
      withTransaction: jest.fn(),
      findOneByRedemptionId: jest.fn(),
      findOneById: jest.fn(),
      findBallotsForDrawDate: jest.fn(),
      create: jest.fn(),
    };
  }

  function mockBallotEntriesRepository(): IBallotEntriesRepository {
    return {
      create: jest.fn(),
      withTransaction: jest.fn(),
      findOneByBallotAndMemberId: jest.fn(),
      findOneById: jest.fn(),
    };
  }

  const mockMemberRedemptionEventDetailBuilder: Partial<MemberRedemptionEventDetailBuilder> = {
    buildMemberRedemptionEventDetail: jest.fn(() => memberRedemptionEventDetailFactory.build()),
  };

  describe('RedeemBallotStrategy', () => {
    const testBallotRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'ballot',
    });

    function callBallotStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        ballotsRepository?: IBallotsRepository;
        ballotEntriesRepository?: IBallotEntriesRepository;
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository = overrides?.redemptionEventsRepository || mockEventsRepository();
      const mockedBallotsRepository = overrides?.ballotsRepository || mockBallotsRepository();
      const mockedBallotEntriesRepository = overrides?.ballotEntriesRepository || mockBallotEntriesRepository();
      const service = new RedeemBallotStrategy(
        mockedBallotsRepository,
        mockedBallotEntriesRepository,
        mockedRedemptionsEventsRepository,
        as(mockMemberRedemptionEventDetailBuilder),
        logger,
      );
      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('should return an error when ballot does not exist', async () => {
      const mockedSilentLogger = createSilentLogger();
      const mockedBallotsRepository = mockBallotsRepository();
      mockedBallotsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(undefined);

      await expect(() =>
        callBallotStrategy(testBallotRedemption, mockedSilentLogger, {
          ballotsRepository: as(mockedBallotsRepository),
        }),
      ).rejects.toThrow('ballot not found');
    });

    it('should return an error when ballot entry is after 21:30', async () => {
      const mockedSilentLogger = createSilentLogger();
      const missingBallot = ballotEndedEntityFactory().build();
      const mockedBallotsRepository = mockBallotsRepository();

      mockedBallotsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(missingBallot);

      await expect(() =>
        callBallotStrategy(testBallotRedemption, mockedSilentLogger, {
          ballotsRepository: as(mockedBallotsRepository),
        }),
      ).rejects.toThrow('ballot has expired');
    });

    it('Should return an error if member attempts to redeem ballot more than once', async () => {
      const mockedSilentLogger = createSilentLogger();
      const ballot = ballotActiveEntityFactory().build();
      const mockedBallotsRepository = mockBallotsRepository();
      const mockedBallotEntriesRepository = mockBallotEntriesRepository();

      mockedBallotsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(ballot);
      mockedBallotEntriesRepository.findOneByBallotAndMemberId = jest.fn().mockResolvedValue(ballot);

      await expect(() =>
        callBallotStrategy(testBallotRedemption, mockedSilentLogger, {
          ballotsRepository: as(mockedBallotsRepository),
          ballotEntriesRepository: as(mockedBallotEntriesRepository),
        }),
      ).rejects.toThrow('member has already entered ballot');
    });

    it('Should save ballot and publish member redemption event', async () => {
      const date = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(date);
      const mockedSilentLogger = createSilentLogger();
      const ballot = ballotActiveEntityFactory().build();
      const mockedBallotsRepository = mockBallotsRepository();
      const mockedBallotEntriesRepository = mockBallotEntriesRepository();
      const mockedRedemptionsEventsRepository = mockEventsRepository();

      mockedBallotsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(ballot);
      mockedBallotEntriesRepository.findOneByBallotAndMemberId = jest.fn().mockResolvedValue(undefined);
      mockedBallotEntriesRepository.create = jest.fn().mockResolvedValue(undefined);
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      const mockMemberRedemptionEvent = {
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testBallotRedemption.id,
          redemptionType: 'ballot',
          companyId: testBallotRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testBallotRedemption.offerId,
          offerName: defaultParams.offerName,
          affiliate: testBallotRedemption.affiliate,
          url: testBallotRedemption.url,
          clientType: defaultParams.clientType,
        },
      };

      mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail = jest
        .fn()
        .mockReturnValue(mockMemberRedemptionEvent);

      await callBallotStrategy(testBallotRedemption, mockedSilentLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
        ballotEntriesRepository: as(mockedBallotEntriesRepository),
        ballotsRepository: mockedBallotsRepository,
      });

      expect(mockedBallotEntriesRepository.create).toHaveBeenCalledWith({
        ballotId: ballot.id,
        entryDate: date,
        memberId: defaultParams.memberId,
        status: ballotEntryStatusEnum.enumValues[0],
      });

      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testBallotRedemption.id,
          redemptionType: testBallotRedemption.redemptionType,
          companyId: testBallotRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testBallotRedemption.offerId,
          offerName: defaultParams.offerName,
          affiliate: testBallotRedemption.affiliate,
          clientType: defaultParams.clientType,
          url: testBallotRedemption.url,
        },
      });
    });
  });
});
