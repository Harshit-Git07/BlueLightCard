import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemShowCardStrategy } from './RedeemShowCardStrategy';

describe('Redemption Strategies', () => {
  const defaultParams: RedeemParams = {
    brazeExternalUserId: faker.string.uuid(),
    companyName: faker.company.name(),
    memberId: faker.string.sample(8),
    offerName: faker.lorem.words(3),
    clientType: faker.helpers.arrayElement(['web', 'mobile']),
    memberEmail: faker.internet.url(),
  };

  function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
    return {
      publishMemberRedeemIntentEvent: jest.fn(),
      publishRedemptionEvent: jest.fn(),
      publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
      publishVaultBatchCreatedEvent: jest.fn(),
      publishRunBallotEvent: jest.fn(),
      publishSuccessfulBallotEvent: jest.fn(),
      publishUnsuccessfulBallotEvent: jest.fn(),
    };
  }

  const mockMemberRedemptionEventDetailBuilder = new MemberRedemptionEventDetailBuilder();

  describe('RedeemShowCardStrategy', () => {
    const testShowCardRedemption = redemptionConfigEntityFactory.build({
      redemptionType: 'showCard',
    });

    function callShowCardRedeemStrategy(
      redemptionConfigEntity: RedemptionConfigEntity,
      logger: ILogger,
      overrides?: {
        redemptionEventsRepository?: IRedemptionsEventsRepository;
      },
    ) {
      const mockedRedemptionsEventsRepository =
        overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
      const service = new RedeemShowCardStrategy(
        mockedRedemptionsEventsRepository,
        mockMemberRedemptionEventDetailBuilder,
        logger,
      );

      return service.redeem(redemptionConfigEntity, defaultParams);
    }

    it('publishes member redemption event', async () => {
      // Arrange
      const mockedLogger = createTestLogger();
      const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
      mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

      // Act
      await callShowCardRedeemStrategy(testShowCardRedemption, mockedLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      });

      // Assert
      expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
        memberDetails: {
          memberId: defaultParams.memberId,
          brazeExternalUserId: defaultParams.brazeExternalUserId,
        },
        redemptionDetails: {
          redemptionId: testShowCardRedemption.id,
          redemptionType: testShowCardRedemption.redemptionType,
          companyId: testShowCardRedemption.companyId,
          companyName: defaultParams.companyName,
          offerId: testShowCardRedemption.offerId,
          offerName: defaultParams.offerName,
          affiliate: testShowCardRedemption.affiliate,
          clientType: defaultParams.clientType,
        },
      });
    });
  });
});
