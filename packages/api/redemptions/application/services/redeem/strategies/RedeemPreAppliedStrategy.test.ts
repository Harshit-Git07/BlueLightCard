import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemPreAppliedStrategy } from './RedeemPreAppliedStrategy';

function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
  return {
    publishMemberRedeemIntentEvent: jest.fn(),
    publishRedemptionEvent: jest.fn(),
    publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
    publishVaultBatchCreatedEvent: jest.fn(),
  };
}

const mockMemberRedemptionEventDetailBuilder: Partial<MemberRedemptionEventDetailBuilder> = {
  buildMemberRedemptionEventDetail: jest.fn(() => memberRedemptionEventDetailFactory.build()),
};

const defaultParams: RedeemParams = {
  brazeExternalUserId: faker.string.uuid(),
  companyName: faker.company.name(),
  memberId: faker.string.sample(8),
  offerName: faker.lorem.words(3),
  clientType: faker.helpers.arrayElement(['web', 'mobile']),
  memberEmail: faker.internet.url(),
};

describe('RedeemPreAppliedStrategy', () => {
  const testPreAppliedRedemption = redemptionConfigEntityFactory.build({
    redemptionType: 'preApplied',
  });

  function callPreAppliedRedeemStrategy(
    redemptionConfigEntity: RedemptionConfigEntity,
    logger: ILogger,
    overrides?: {
      redemptionEventsRepository?: IRedemptionsEventsRepository;
    },
  ) {
    const mockedRedemptionsEventsRepository =
      overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
    const service = new RedeemPreAppliedStrategy(
      mockedRedemptionsEventsRepository,
      as(mockMemberRedemptionEventDetailBuilder),
      logger,
    );

    return service.redeem(redemptionConfigEntity, defaultParams);
  }

  it('throws if no redemption URL is configured', async () => {
    const mockedSilentLogger = createSilentLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    const redemptionWithoutUrl = redemptionConfigEntityFactory.build({
      redemptionType: 'preApplied',
      url: undefined,
    });

    await expect(() =>
      callPreAppliedRedeemStrategy(redemptionWithoutUrl, mockedSilentLogger, {
        redemptionEventsRepository: mockedRedemptionsEventsRepository,
      }),
    ).rejects.toThrow('Redemption URL was missing but required for pre-applied redemption');
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).not.toHaveBeenCalled();
  });

  it('publishes member redemption event', async () => {
    const mockedLogger = createTestLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
    const mockMemberRedemptionEvent = {
      memberDetails: {
        memberId: defaultParams.memberId,
        brazeExternalUserId: defaultParams.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: testPreAppliedRedemption.id,
        redemptionType: 'preApplied',
        companyId: testPreAppliedRedemption.companyId,
        companyName: defaultParams.companyName,
        offerId: testPreAppliedRedemption.offerId,
        offerName: defaultParams.offerName,
        affiliate: testPreAppliedRedemption.affiliate,
        url: testPreAppliedRedemption.url,
        clientType: defaultParams.clientType,
      },
    };
    mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail = jest
      .fn()
      .mockReturnValue(mockMemberRedemptionEvent);

    const redeemedResult = await callPreAppliedRedeemStrategy(testPreAppliedRedemption, mockedLogger, {
      redemptionEventsRepository: mockedRedemptionsEventsRepository,
    });

    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith({
      memberDetails: {
        memberId: defaultParams.memberId,
        brazeExternalUserId: defaultParams.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: testPreAppliedRedemption.id,
        redemptionType: testPreAppliedRedemption.redemptionType,
        companyId: testPreAppliedRedemption.companyId,
        companyName: defaultParams.companyName,
        offerId: testPreAppliedRedemption.offerId,
        offerName: defaultParams.offerName,
        affiliate: testPreAppliedRedemption.affiliate,
        url: redeemedResult.redemptionDetails.url,
        clientType: defaultParams.clientType,
      },
    });
  });
});
