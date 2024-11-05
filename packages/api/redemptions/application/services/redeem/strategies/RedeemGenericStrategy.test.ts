import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { IGenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { IRedemptionsEventsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsEventsRepository';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { memberRedemptionEventDetailFactory } from '@blc-mono/redemptions/libs/test/factories/memberRedemptionEvent.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedeemParams } from './IRedeemStrategy';
import { MemberRedemptionEventDetailBuilder } from './MemberRedemptionEventDetailBuilder';
import { RedeemGenericStrategy } from './RedeemGenericStrategy';

function mockRedemptionsEventsRepository(): IRedemptionsEventsRepository {
  return {
    publishMemberRedeemIntentEvent: jest.fn(),
    publishRedemptionEvent: jest.fn(),
    publishMemberRetrievedRedemptionDetailsEvent: jest.fn(),
    publishVaultBatchCreatedEvent: jest.fn(),
  };
}

function mockGenericsRepository(): Partial<IGenericsRepository> {
  return {
    deleteByRedemptionId: jest.fn(),
    updateByRedemptionId: jest.fn(),
    updateOneById: jest.fn(),
    createGeneric: jest.fn(),
    findOneByRedemptionId: jest.fn(),
    withTransaction: jest.fn(),
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

describe('RedeemGenericStrategy', () => {
  const testGenericRedemption = redemptionConfigEntityFactory.build({
    redemptionType: 'generic',
  });
  const genericEntity = genericEntityFactory.build({
    redemptionId: testGenericRedemption.id,
  });

  function callGenericRedeemStrategy(
    redemptionConfigEntity: RedemptionConfigEntity,
    logger: ILogger,
    overrides?: {
      redemptionEventsRepository?: IRedemptionsEventsRepository;
      genericsRepository?: IGenericsRepository;
    },
  ) {
    const mockedRedemptionsEventsRepository =
      overrides?.redemptionEventsRepository || mockRedemptionsEventsRepository();
    const genericsRepository = overrides?.genericsRepository || mockGenericsRepository();

    const service = new RedeemGenericStrategy(
      as(genericsRepository),
      as(mockedRedemptionsEventsRepository),
      as(mockMemberRedemptionEventDetailBuilder),
      logger,
    );

    return service.redeem(redemptionConfigEntity, defaultParams);
  }

  it('throws when no generic is found', async () => {
    const mockedSilentLogger = createSilentLogger();
    const mockedGenericsRepository = mockGenericsRepository();
    mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(null);

    await expect(() =>
      callGenericRedeemStrategy(testGenericRedemption, mockedSilentLogger, {
        genericsRepository: as(mockedGenericsRepository),
      }),
    ).rejects.toThrow();
  });

  it('returns kind equals to "Ok" when a generic is found', async () => {
    const mockedLogger = createTestLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
    const mockedGenericsRepository = mockGenericsRepository();
    mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(genericEntity);

    const result = await callGenericRedeemStrategy(testGenericRedemption, mockedLogger, {
      genericsRepository: as(mockedGenericsRepository),
      redemptionEventsRepository: mockedRedemptionsEventsRepository,
    });

    expect(result.kind).toBe('Ok');
    expect(result.redemptionType).toEqual('generic');
    expect(result.redemptionDetails.code).toEqual(genericEntity.code);
    expect(result.redemptionDetails.url).toEqual(testGenericRedemption.url);
  });

  it('publishes a redemption event', async () => {
    const mockedLogger = createTestLogger();
    const mockedRedemptionsEventsRepository = mockRedemptionsEventsRepository();
    mockedRedemptionsEventsRepository.publishRedemptionEvent = jest.fn().mockResolvedValue(undefined);
    const mockedGenericsRepository = mockGenericsRepository();
    mockedGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(genericEntity);
    const mockMemberRedemptionEvent = {
      memberDetails: {
        memberId: defaultParams.memberId,
        brazeExternalUserId: defaultParams.brazeExternalUserId,
      },
      redemptionDetails: {
        redemptionId: testGenericRedemption.id,
        redemptionType: 'generic',
        companyId: testGenericRedemption.companyId,
        companyName: defaultParams.companyName,
        offerId: testGenericRedemption.offerId,
        offerName: defaultParams.offerName,
        code: genericEntity.code,
        affiliate: testGenericRedemption.affiliate,
        url: testGenericRedemption.url,
        clientType: defaultParams.clientType,
      },
    };
    mockMemberRedemptionEventDetailBuilder.buildMemberRedemptionEventDetail = jest
      .fn()
      .mockReturnValue(mockMemberRedemptionEvent);

    const result = await callGenericRedeemStrategy(testGenericRedemption, mockedLogger, {
      redemptionEventsRepository: mockedRedemptionsEventsRepository,
      genericsRepository: as(mockedGenericsRepository),
    });

    expect(result.kind).toBe('Ok');
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledTimes(1);
    expect(mockedRedemptionsEventsRepository.publishRedemptionEvent).toHaveBeenCalledWith(mockMemberRedemptionEvent);
  });
});
