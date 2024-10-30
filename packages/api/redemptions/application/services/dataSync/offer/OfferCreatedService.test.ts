import { as } from '@blc-mono/core/utils/testing';
import {
  parseAffiliate,
  parseConnection,
  parseOfferType,
  parseOfferUrl,
  parseRedemptionType,
} from '@blc-mono/redemptions/application/helpers/dataSync/offerLegacyToRedemptionConfig';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import {
  offerCreatedEventDetailFactory,
  offerCreatedEventFactory,
} from '../../../../libs/test/factories/offerEvents.factory';
import { OfferCreatedEvent } from '../../../controllers/eventBridge/offer/OfferCreatedController';
import { GenericsRepository, NewGenericEntity } from '../../../repositories/GenericsRepository';
import {
  NewRedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../../repositories/RedemptionConfigRepository';

import { OfferCreatedService } from './OfferCreatedService';

const mockRedemptionConfigRepository: Partial<RedemptionConfigRepository> = {};
const mockRedemptionConfigTransactionRepository: Partial<RedemptionConfigRepository> = {};

const mockGenericsRepository: Partial<GenericsRepository> = {};
const mockGenericsTransactionRepository: Partial<GenericsRepository> = {};

const mockTransactionManager: Partial<TransactionManager> = {
  withTransaction: jest.fn(),
};

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const offerCreatedService = new OfferCreatedService(
  as(mockRedemptionConfigRepository),
  as(mockGenericsRepository),
  as(stubTransactionManager),
);

const offerCreatedEvent: OfferCreatedEvent = offerCreatedEventFactory.build({
  detail: offerCreatedEventDetailFactory.build({ offerUrl: undefined, offerCode: undefined }),
});

describe('createOffer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockRedemptionConfigRepository.withTransaction = jest
      .fn()
      .mockReturnValue(mockRedemptionConfigTransactionRepository);
    mockGenericsRepository.withTransaction = jest.fn().mockReturnValue(mockGenericsTransactionRepository);
  });

  it('does not call genericsRepository.withTransaction if redemption type is generic but has no offerCode', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '1' });
    mockGenericsTransactionRepository.createGeneric = jest.fn();

    const offerCreatedEvent: OfferCreatedEvent = offerCreatedEventFactory.build({
      detail: offerCreatedEventDetailFactory.build({ offerUrl: 'someOfferUrl', offerCode: undefined }),
    });

    await offerCreatedService.createOffer(offerCreatedEvent);

    expect(mockGenericsRepository.withTransaction).not.toHaveBeenCalled();
    expect(mockGenericsTransactionRepository.createGeneric).not.toHaveBeenCalled();
  });

  it('does not call genericsRepository.withTransaction if redemption type is not generic', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '1' });
    mockGenericsTransactionRepository.createGeneric = jest.fn();

    await offerCreatedService.createOffer(offerCreatedEvent);

    expect(mockGenericsRepository.withTransaction).not.toHaveBeenCalled();
    expect(mockGenericsTransactionRepository.createGeneric).not.toHaveBeenCalled();
  });

  it('calls createGeneric if redemption type is generic', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '20' });
    mockGenericsTransactionRepository.createGeneric = jest.fn();

    const offerCreatedEvent: OfferCreatedEvent = offerCreatedEventFactory.build({
      detail: offerCreatedEventDetailFactory.build({ offerUrl: 'someOfferUrl', offerCode: 'someCode' }),
    });

    await offerCreatedService.createOffer(offerCreatedEvent);

    const expectedGenericData: NewGenericEntity = {
      redemptionId: '20',
      code: 'someCode',
    };

    expect(mockGenericsTransactionRepository.createGeneric).toHaveBeenCalledWith(expectedGenericData);
  });

  it('calls genericsRepository.withTransaction if redemption type is generic', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '1' });
    mockGenericsTransactionRepository.createGeneric = jest.fn();

    const offerCreatedEvent: OfferCreatedEvent = offerCreatedEventFactory.build({
      detail: offerCreatedEventDetailFactory.build({ offerUrl: 'someOfferUrl', offerCode: 'someCode' }),
    });

    await offerCreatedService.createOffer(offerCreatedEvent);

    expect(mockGenericsRepository.withTransaction).toHaveBeenCalled();
  });

  it('calls redemptionTransaction.createRedemption', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '1' });

    await offerCreatedService.createOffer(offerCreatedEvent);

    const { detail } = offerCreatedEvent;
    const expectedRedemptionData: NewRedemptionConfigEntity = {
      offerId: detail.offerId.toString(),
      companyId: detail.companyId,
      redemptionType: parseRedemptionType(detail.offerUrl, detail.offerCode).redemptionType,
      connection: parseConnection(detail.offerUrl).connection,
      affiliate: parseAffiliate(detail.offerUrl).affiliate,
      offerType: parseOfferType(detail.offerType).offerType,
      url: parseOfferUrl(detail.offerUrl).url,
    };

    expect(mockRedemptionConfigTransactionRepository.createRedemption).toHaveBeenCalledWith(expectedRedemptionData);
  });

  it('calls redemptionConfigRepository.withTransaction', async () => {
    mockRedemptionConfigTransactionRepository.createRedemption = jest.fn().mockResolvedValue({ id: '1' });

    await offerCreatedService.createOffer(offerCreatedEvent);

    expect(mockRedemptionConfigRepository.withTransaction).toHaveBeenCalled();
  });

  it('calls withTransaction', async () => {
    const offerCreatedService = new OfferCreatedService(
      as(mockRedemptionConfigRepository),
      as(mockGenericsRepository),
      as(mockTransactionManager),
    );

    await offerCreatedService.createOffer(offerCreatedEvent);

    expect(mockTransactionManager.withTransaction).toHaveBeenCalled();
  });
});
