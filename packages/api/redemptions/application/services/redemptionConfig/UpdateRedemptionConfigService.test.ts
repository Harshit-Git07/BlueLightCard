import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { as } from '@blc-mono/core/utils/testing';
import { IGenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
} from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import {
  DatabaseTransactionOperator,
  TransactionManager,
} from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { Integration, RedemptionType, Status } from '@blc-mono/redemptions/libs/database/schema';
import {
  PatchRedemptionConfigGenericModel,
  PatchRedemptionConfigShowCardModel,
  PatchRedemptionConfigVaultModel,
} from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';
import { affiliateFactory } from '@blc-mono/redemptions/libs/test/factories/affiliate.factory';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IVaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import {
  UpdateRedemptionConfigError,
  UpdateRedemptionConfigService,
  UpdateRedemptionConfigSuccess,
} from './UpdateRedemptionConfigService';

const testRedemptionId = `rdm-${faker.string.uuid()}`;
const testOfferId = faker.string.uuid();
const testCompanyId = faker.string.uuid();
const testGenericId = `gnr-${faker.string.uuid()}`;
const testVaultId = `vlt-${faker.string.uuid()}`;
const testVaultBatchId = `vbt-${faker.string.uuid()}`;

const testVaultBatchBody = vaultBatchEntityFactory.build({
  id: testVaultBatchId,
  vaultId: testVaultId,
  created: new Date(),
  expiry: new Date(),
});

const testVaultBody = {
  id: testRedemptionId,
  offerId: testOfferId,
  redemptionType: 'vault',
  connection: 'direct',
  companyId: testCompanyId,
  affiliate: 'awin',
  url: 'https://www.awin1.com/',
  vault: {
    id: testVaultId,
    alertBelow: 1000,
    status: 'active' as Status,
    maxPerUser: 5,
    email: faker.internet.email(),
    integration: 'eagleeye' as Integration,
    integrationId: faker.string.numeric(8),
  },
} satisfies PatchRedemptionConfigVaultModel;

const testVaultRedemptionConfig: RedemptionConfig = {
  ...testVaultBody,
  offerId: testOfferId,
  companyId: testCompanyId,
  vault: {
    ...testVaultBody.vault,
    createdAt: 'someDate',
    batches: [
      {
        ...testVaultBatchBody,
        created: testVaultBatchBody.created.toISOString(),
        expiry: testVaultBatchBody.expiry.toISOString(),
      },
    ],
  },
};

const testGenericBody = {
  id: testRedemptionId,
  offerId: testOfferId,
  redemptionType: 'generic',
  connection: 'direct',
  companyId: testCompanyId,
  affiliate: 'awin',
  url: 'https://www.awin1.com/',
  generic: {
    id: testGenericId,
    code: 'DISCOUNT_CODE_01',
  },
} satisfies PatchRedemptionConfigGenericModel;

const testGenericRedemptionConfig: RedemptionConfig = {
  ...testGenericBody,
  offerId: String(testOfferId),
  companyId: testCompanyId,
};

const testShowCardBody = {
  id: testRedemptionId,
  offerId: testOfferId,
  redemptionType: 'showCard',
  connection: 'none',
  companyId: testCompanyId,
  affiliate: null,
} satisfies PatchRedemptionConfigShowCardModel;

const testShowCardRedemptionConfig: RedemptionConfig = {
  ...testShowCardBody,
  offerId: testOfferId,
  companyId: testCompanyId,
};

const mockRedemptionConfigRepository: Partial<IRedemptionConfigRepository> = {};
const mockGenericsRepository: Partial<IGenericsRepository> = {};
const mockVaultsRepository: Partial<IVaultsRepository> = {};
const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {};
const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {};

const stubTransactionManager: Partial<TransactionManager> = {
  withTransaction(callback) {
    return callback(as(mockDatabaseTransactionOperator));
  },
};

const mockDatabaseTransactionOperator: Partial<DatabaseTransactionOperator> = {};

const mockLogger: ILogger = createTestLogger();

const updateRedemptionConfigService = new UpdateRedemptionConfigService(
  mockLogger,
  as(mockRedemptionConfigRepository),
  as(mockGenericsRepository),
  as(mockVaultsRepository),
  as(mockVaultBatchesRepository),
  as(mockRedemptionConfigTransformer),
  as(stubTransactionManager),
);

describe('UpdateRedemptionConfigService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return kind "UrlPayloadOfferIdMismatch" when the offerId in the URL and payload do not match', async () => {
    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
        ...testGenericBody,
        offerId: testOfferId + 1,
      });

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'UrlPayloadOfferIdMismatch',
      'offerId in URL and payload do not match',
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "RedemptionNotFound" when the redemptions record does not exist', async () => {
    mockRedemptionConfigExist(false);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testGenericBody);

    const expected: UpdateRedemptionConfigError = getExpectedError('RedemptionNotFound', 'redemptionId does not exist');
    expect(actual).toEqual(expected);
  });

  it('should return kind "RedemptionOfferCompanyIdMismatch" when the payload offerId/companyId do not match the redemptions record offerId/companyId', async () => {
    mockRedemptionConfigExist(true);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
        ...testGenericBody,
        companyId: testCompanyId + 1,
      });

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'RedemptionOfferCompanyIdMismatch',
      'offerId/companyId do not match for this redemption',
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "RedemptionTypeMismatch" when the payload redemption type do not match the redemptions record redemption type', async () => {
    mockRedemptionConfigExist(true, 'vault');

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
        ...testVaultBody,
        redemptionType: 'showCard',
      });

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'RedemptionTypeMismatch',
      'redemption type do not match for this redemption',
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "GenericCodeEmpty" when the request payload contains a blank string for the generics code value', async () => {
    mockRedemptionConfigExist(true, 'generic');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
        ...testGenericBody,
        generic: { id: testGenericBody.generic.id, code: '' },
      });

    const expected: UpdateRedemptionConfigError = getExpectedError('GenericCodeEmpty', 'generic code cannot be blank');
    expect(actual).toEqual(expected);
  });

  it('should return kind "GenericNotFound" when the generic offer generics record does not exist', async () => {
    mockRedemptionConfigExist(true, 'generic');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testGenericBody);

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'GenericNotFound',
      "generic record does not exist with corresponding id's",
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the generic offer generics record fails to update', async () => {
    mockRedemptionConfigExist(true, 'generic');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testGenericBody);

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'generics record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the generic offer redemption record fails to update', async () => {
    mockRedemptionConfigExist(true, 'generic');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(false);
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testGenericBody);

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the generic offer redemptions and generic records update correctly', async () => {
    mockRedemptionConfigExist(true, 'generic');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: testGenericBody.offerId,
      redemptionType: testGenericBody.redemptionType,
      connection: testGenericBody.connection,
      companyId: testGenericBody.companyId,
      affiliate: testGenericBody.affiliate,
      url: testGenericBody.url,
      offerType: 'online',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(testGenericRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testGenericBody);

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testGenericRedemptionConfig);
  });

  it.each(['preApplied', 'giftCard', 'creditCard', 'verify'] as const)(
    'should return kind "Error" when %s offer redemption record fails to update',
    async (redemptionType) => {
      const testPayloadFactory = affiliateFactory.build({
        redemptionType: redemptionType,
        id: testRedemptionId,
        offerId: testOfferId,
        companyId: testCompanyId,
      });

      mockRedemptionConfigExist(true, redemptionType);

      //mock repo(s) responses/resolves that execute inside transactionManager(s)
      mockGenericTransaction();
      mockVaultTransaction();

      mockRedemptionConfigUpdateSucceeds(false);
      mockRedemptionConfigTransaction();

      const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
        await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testPayloadFactory);

      const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
      expect(actual).toEqual(expected);
    },
  );

  it.each(['preApplied', 'giftCard', 'creditCard', 'verify'] as const)(
    'should return kind "Ok" when %s redemption record updates correctly',
    async (redemptionType) => {
      const testPayloadFactory = affiliateFactory.build({
        redemptionType: redemptionType,
        id: testRedemptionId,
        offerId: testOfferId,
        companyId: testCompanyId,
      });
      const testAffiliateRedemptionConfig = {
        ...testPayloadFactory,
        offerId: testOfferId,
        companyId: testCompanyId,
      };
      mockRedemptionConfigExist(true, redemptionType);

      //mock repo(s) responses/resolves that execute inside transactionManager(s)
      mockGenericTransaction();
      mockVaultTransaction();

      mockRedemptionConfigUpdateSucceeds(true, {
        id: testPayloadFactory.id,
        offerId: testPayloadFactory.offerId,
        redemptionType: testPayloadFactory.redemptionType,
        connection: testPayloadFactory.connection,
        companyId: testPayloadFactory.companyId,
        affiliate: testPayloadFactory.affiliate,
        url: testPayloadFactory.url,
        offerType: 'online',
      });
      mockRedemptionConfigTransaction();

      mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
        .fn()
        .mockReturnValue(testAffiliateRedemptionConfig);

      const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
        await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testPayloadFactory);

      expect(actual.kind).toEqual('Ok');
      expect(actual.data).toEqual(testAffiliateRedemptionConfig);
    },
  );

  it('should return kind "Error" when the showCard offer redemption record fails to update', async () => {
    mockRedemptionConfigExist(true, 'showCard');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(false);
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testShowCardBody);

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the showCard offer redemptions record updates correctly', async () => {
    mockRedemptionConfigExist(true, 'showCard');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: testShowCardBody.offerId,
      redemptionType: testShowCardBody.redemptionType,
      connection: testShowCardBody.connection,
      companyId: testShowCardBody.companyId,
      affiliate: testShowCardBody.affiliate,
      url: null,
      offerType: 'in-store',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(testShowCardRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testShowCardBody);

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testShowCardRedemptionConfig);
  });

  it('should return kind "VaultNotFound" when the vault offer vaults record does not exist', async () => {
    mockRedemptionConfigExist(true, 'vault');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testVaultBody);

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'VaultNotFound',
      "vault record does not exist with corresponding id's",
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the vault offer vaults record fails to update', async () => {
    mockRedemptionConfigExist(true, 'vault');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(true);
    mockVaultUpdateSucceeds(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), testVaultBody);

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'vault record failed to update');
    expect(actual).toEqual(expected);
  });

  it.each([
    [faker.string.uuid(), 'uniqodo' as const],
    [faker.string.uuid(), 'eagleeye' as const],
    [null, null],
  ])(
    'should return kind "Ok" when the vault offer redemptions and vault records update correctly',
    async (integrationId: string | null, integration: 'uniqodo' | 'eagleeye' | null) => {
      mockRedemptionConfigExist(true, 'vault');

      //mock repo(s) responses/resolves that execute inside transactionManager(s)
      mockVaultExist(true);
      mockVaultBatches();
      mockVaultFindOneById();
      mockVaultUpdateSucceeds(true);
      mockVaultTransaction();

      mockRedemptionConfigUpdateSucceeds(true, {
        id: testRedemptionId,
        offerId: testVaultBody.offerId,
        redemptionType: testVaultBody.redemptionType,
        connection: testVaultBody.connection,
        companyId: testVaultBody.companyId,
        affiliate: testVaultBody.affiliate,
        url: testVaultBody.url,
        offerType: 'online',
      });
      mockRedemptionConfigTransaction();

      mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
        .fn()
        .mockReturnValue(testVaultRedemptionConfig);

      const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
        await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
          ...testVaultBody,
          vault: { ...testVaultBody.vault, integrationId, integration },
        });

      expect(actual.kind).toEqual('Ok');
      expect(actual.data).toEqual(testVaultRedemptionConfig);
    },
  );

  it('should return kind "MaxPerUserError" when the maxPerUser is less than 1', async () => {
    mockRedemptionConfigExist(true, 'vault');

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(true);
    mockVaultBatches();
    mockVaultFindOneById();
    mockVaultUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: testVaultBody.offerId,
      redemptionType: testVaultBody.redemptionType,
      connection: testVaultBody.connection,
      companyId: testVaultBody.companyId,
      affiliate: testVaultBody.affiliate,
      url: testVaultBody.url,
      offerType: 'online',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(testVaultRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError =
      await updateRedemptionConfigService.updateRedemptionConfig(String(testOfferId), {
        ...testVaultBody,
        vault: { ...testVaultBody.vault, maxPerUser: 0 },
      });

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'MaxPerUserError',
      'max limit per user cannot be less than 1',
    );

    expect(actual).toEqual(expected);
  });
});

function mockRedemptionConfigExist(exist: boolean, redemptionType: RedemptionType = 'preApplied'): void {
  const value = exist
    ? redemptionConfigEntityFactory.build({
        id: testRedemptionId,
        offerId: testOfferId,
        companyId: testCompanyId,
        redemptionType: redemptionType,
      })
    : null;
  mockRedemptionConfigRepository.findOneById = jest.fn().mockResolvedValue(value);
}

function mockRedemptionConfigUpdateSucceeds(success: boolean, record?: RedemptionConfigEntity): void {
  const value = success ? record : null;
  mockRedemptionConfigRepository.updateOneById = jest.fn().mockResolvedValue(value);
}

function mockRedemptionConfigTransaction(): void {
  mockRedemptionConfigRepository.withTransaction = jest.fn().mockReturnValue(mockRedemptionConfigRepository);
}

function mockGenericExist(exist: boolean): void {
  const value = exist
    ? genericEntityFactory.build({
        id: testGenericId,
        redemptionId: testRedemptionId,
      })
    : null;
  mockGenericsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(value);
}

function mockGenericsUpdateSucceeds(success: boolean): void {
  const value = success
    ? genericEntityFactory.build({
        id: testGenericId,
        redemptionId: testRedemptionId,
        code: testGenericBody.generic.code,
      })
    : null;
  mockGenericsRepository.updateOneById = jest.fn().mockResolvedValue(value);
}

function mockGenericTransaction(): void {
  mockGenericsRepository.withTransaction = jest.fn().mockReturnValue(mockGenericsRepository);
}

function mockVaultExist(exist: boolean): void {
  const value = exist
    ? vaultEntityFactory.build({
        id: testVaultId,
        redemptionId: testRedemptionId,
      })
    : null;
  mockVaultsRepository.findOneByRedemptionId = jest.fn().mockResolvedValue(value);
}

function mockVaultBatches(): void {
  mockVaultBatchesRepository.findByVaultId = jest.fn().mockResolvedValue(testVaultBatchBody);
}

function mockVaultUpdateSucceeds(success: boolean): void {
  const value = success
    ? vaultEntityFactory.build({
        id: testVaultId,
      })
    : null;
  mockVaultsRepository.updateOneById = jest.fn().mockResolvedValue(value);
}

function mockVaultFindOneById(): void {
  const value = vaultEntityFactory.build({
    id: testVaultId,
  });
  mockVaultsRepository.findOneById = jest.fn().mockResolvedValue(value);
}

function mockVaultTransaction(): void {
  mockVaultsRepository.withTransaction = jest.fn().mockReturnValue(mockVaultsRepository);
}

function getExpectedError(
  kind:
    | 'Error'
    | 'UrlPayloadOfferIdMismatch'
    | 'RedemptionNotFound'
    | 'RedemptionOfferCompanyIdMismatch'
    | 'RedemptionTypeMismatch'
    | 'GenericNotFound'
    | 'GenericCodeEmpty'
    | 'VaultNotFound'
    | 'MaxPerUserError',
  message: string,
): UpdateRedemptionConfigError {
  return {
    kind: kind,
    data: {
      message: `Redemption Config Update - ${message}: ${testRedemptionId}`,
    },
  };
}
