import { faker } from '@faker-js/faker';

import { COMPARE, GIFTCARD, PREAPPLIED, VERIFY } from '@blc-mono/core/constants/redemptions';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemAffiliateStrategy } from './RedeemAffiliateStrategy';

function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
  return {
    publishMemberRedeemIntentEvent: jest.fn(),
    publishRedemptionEvent: jest.fn(),
    publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
    publishVaultBatchCreatedEvent: jest.fn(),
    publishRunBallotEvent: jest.fn(),
  };
}

const defaultParams: RedeemParams = {
  brazeExternalUserId: faker.string.uuid(),
  companyName: faker.company.name(),
  memberId: faker.string.sample(8),
  offerName: faker.lorem.words(3),
  clientType: faker.helpers.arrayElement(['web', 'mobile']),
  memberEmail: faker.internet.url(),
};

const mockMemberRedemptionEventDetailBuilder: Partial<MemberRedemptionEventDetailBuilder> = {
  buildMemberRedemptionEventDetail: jest.fn(),
};

describe.each([COMPARE, GIFTCARD, PREAPPLIED, VERIFY])('%s Affiliate Redemption Strategy', (redemptionType) => {
  const testAffiliateRedemption = redemptionConfigEntityFactory.build({
    redemptionType: redemptionType,
  });

  function callAffiliateRedeemStrategy(
    redemptionConfigEntity: RedemptionConfigEntity,
    logger: ILogger,
    overrides?: {
      redemptionEventsRepository?: IRedemptionsEventsRepository;
    },
  ) {
    const mockedRedemptionsEventsRepository =
      overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
    const service = new RedeemAffiliateStrategy(
      mockedRedemptionsEventsRepository,
      as(mockMemberRedemptionEventDetailBuilder),
      logger,
    );

    return service.redeem(redemptionConfigEntity, defaultParams);
  }

  it('fails to redeem if no redemption URL is configured', async () => {
    // Arrange
    const mockedSilentLogger = createSilentLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    const redemptionWithoutUrl = redemptionConfigEntityFactory.build({
      redemptionType: 'giftCard',
      url: undefined,
    });

    // Act & Assert
    await expect(() =>
      callAffiliateRedeemStrategy(redemptionWithoutUrl, mockedSilentLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      }),
    ).rejects.toThrow('Redemption URL was missing but required for giftCard Affiliate redemption');
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).not.toHaveBeenCalled();
  });

  it('publishes a member redemption event', async () => {
    // Arrange
    const mockedLogger = createTestLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);

    const mockMemberRedemptionEvent = {
      memberDetails: {
        memberId: defaultParams.memberId,
        brazeExternalUserId: defaultParams.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: testAffiliateRedemption.id,
        redemptionType: redemptionType,
        companyId: testAffiliateRedemption.companyId,
        companyName: defaultParams.companyName,
        offerId: testAffiliateRedemption.offerId,
        offerName: defaultParams.offerName,
        code: '',
        affiliate: testAffiliateRedemption.affiliate,
        url: testAffiliateRedemption.url,
        clientType: defaultParams.clientType,
      },
    };
    mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail = jest
      .fn()
      .mockReturnValue(mockMemberRedemptionEvent);

    // Act
    const redeemedResult = await callAffiliateRedeemStrategy(testAffiliateRedemption, mockedLogger, {
      redemptionEventsRepository: mockedRedemptionsEventsRepository,
    });

    // Assert
    expect(redeemedResult.kind).toBe('Ok');
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(mockMemberRedemptionEvent);
  });
});
