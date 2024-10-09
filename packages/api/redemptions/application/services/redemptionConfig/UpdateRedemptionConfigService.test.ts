import { faker } from '@faker-js/faker';

import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { ParsedRequest } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import {
  GenericsRepository,
  IGenericsRepository,
} from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { Integration, Status } from '@blc-mono/redemptions/libs/database/schema';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfig.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultsRepository } from '../../repositories/VaultsRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import {
  UpdateGenericRedemptionSchema,
  UpdatePreAppliedRedemptionSchema,
  UpdateRedemptionConfigError,
  UpdateRedemptionConfigService,
  UpdateRedemptionConfigSuccess,
  UpdateShowCardRedemptionSchema,
  UpdateVaultRedemptionSchema,
} from './UpdateRedemptionConfigService';

describe('UpdateRedemptionConfigService', () => {
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterAll(async () => {
    await database?.down?.();
  });

  const testRedemptionId = `rdm-${faker.string.uuid()}`;

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
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'vault',
    connection: 'direct',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    vault: {
      id: testVaultId,
      alertBelow: 1000,
      status: 'active' as Status,
      maxPerUser: 5,
      createdAt: '2024-12-12',
      email: faker.internet.email(),
      integration: 'eagleEye' as Integration,
      integrationId: faker.string.numeric(8),
    },
  } satisfies UpdateVaultRedemptionSchema;

  const testVaultRedemptionConfig: RedemptionConfig = {
    ...testVaultBody,
    offerId: String(testVaultBody.offerId),
    companyId: String(testVaultBody.companyId),
    vault: {
      ...testVaultBody.vault,
      batches: [
        {
          ...testVaultBatchBody,
          created: testVaultBatchBody.created.toISOString(),
          expiry: testVaultBatchBody.expiry.toISOString(),
        },
      ],
    },
  };

  const testGenericId = `gnr-${faker.string.uuid()}`;

  const testGenericBody = {
    id: testRedemptionId,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'generic',
    connection: 'direct',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    generic: {
      id: testGenericId,
      code: 'DISCOUNT_CODE_01',
    },
  } satisfies UpdateGenericRedemptionSchema;

  const testGenericRedemptionConfig: RedemptionConfig = {
    ...testGenericBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  const testPreAppliedBody = {
    id: testRedemptionId,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'preApplied',
    connection: 'none',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
    url: 'https://www.whatever.com/',
  } satisfies UpdatePreAppliedRedemptionSchema;

  const testPreAppliedRedemptionConfig: RedemptionConfig = {
    ...testPreAppliedBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  const testShowCardBody = {
    id: testRedemptionId,
    offerId: faker.number.int({ max: 1000000 }),
    redemptionType: 'showCard',
    connection: 'none',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
  } satisfies UpdateShowCardRedemptionSchema;

  const testShowCardRedemptionConfig: RedemptionConfig = {
    ...testShowCardBody,
    offerId: String(testGenericBody.offerId),
    companyId: String(testGenericBody.companyId),
  };

  const mockRedemptionConfigRepository: Partial<IRedemptionConfigRepository> = {};
  const mockGenericsRepository: Partial<IGenericsRepository> = {};
  const mockVaultsRepository: Partial<IVaultsRepository> = {};
  const mockVaultBatchesRepository: Partial<IVaultBatchesRepository> = {};
  const mockRedemptionConfigTransformer: Partial<RedemptionConfigTransformer> = {};

  function mockRedemptionConfigExist(exist: boolean): void {
    const value = exist
      ? redemptionConfigFactory.build({
          id: testRedemptionId,
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
    kind: 'Error' | 'RedemptionNotFound' | 'GenericNotFound' | 'VaultNotFound',
    message: string,
  ): UpdateRedemptionConfigError {
    return {
      kind: kind,
      data: {
        message: `Redemption Config Update - ${message}: ${testRedemptionId}`,
      },
    };
  }

  /**
   * pass createSilentLogger for test errors, and createTestLogger for success
   * keeps terminal clean when test errors
   * terminal should be clean for success - if not, then there is something that needs fixing
   *
   * @param logger
   * @param request
   */
  async function callService(
    logger: ILogger,
    request: ParsedRequest,
  ): Promise<UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError> {
    const transactionManager = new TransactionManager(connection);
    const service = new UpdateRedemptionConfigService(
      logger,
      mockRedemptionConfigRepository as RedemptionConfigRepository,
      mockGenericsRepository as GenericsRepository,
      mockVaultsRepository as VaultsRepository,
      mockVaultBatchesRepository as VaultBatchesRepository,
      mockRedemptionConfigTransformer as RedemptionConfigTransformer,
      transactionManager,
    );
    return await service.updateRedemptionConfig(request.body);
  }

  it('should return kind "RedemptionNotFound" when the redemptions record does not exist', async () => {
    mockRedemptionConfigExist(false);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testGenericBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('RedemptionNotFound', 'redemptionId does not exist');
    expect(actual).toEqual(expected);
  });

  it('should return kind "GenericNotFound" when the generic offer generics record does not exist', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testGenericBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'GenericNotFound',
      "generic record does not exist with corresponding id's",
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the generic offer generics record fails to update', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testGenericBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'generics record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the generic offer redemption record fails to update', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(false);
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testGenericBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the generic offer redemptions and generic records update correctly', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericExist(true);
    mockGenericsUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: Number(testGenericBody.offerId),
      redemptionType: testGenericBody.redemptionType,
      connection: testGenericBody.connection,
      companyId: Number(testGenericBody.companyId),
      affiliate: testGenericBody.affiliate,
      url: testGenericBody.url,
      offerType: 'online',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(testGenericRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(createTestLogger(), {
      body: testGenericBody,
    });

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testGenericRedemptionConfig);
  });

  it('should return kind "Error" when the preApplied offer redemption record fails to update', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(false);
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testPreAppliedBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the preApplied offer redemptions record updates correctly', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: Number(testPreAppliedBody.offerId),
      redemptionType: testPreAppliedBody.redemptionType,
      connection: testPreAppliedBody.connection,
      companyId: Number(testPreAppliedBody.companyId),
      affiliate: testPreAppliedBody.affiliate,
      url: testPreAppliedBody.url,
      offerType: 'online',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(testPreAppliedRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(createTestLogger(), {
      body: testPreAppliedBody,
    });

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testPreAppliedRedemptionConfig);
  });

  it('should return kind "Error" when the showCard offer redemption record fails to update', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(false);
    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testShowCardBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'redemption record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the showCard offer redemptions record updates correctly', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: Number(testShowCardBody.offerId),
      redemptionType: testShowCardBody.redemptionType,
      connection: testShowCardBody.connection,
      companyId: Number(testShowCardBody.companyId),
      affiliate: testShowCardBody.affiliate,
      url: null,
      offerType: 'in-store',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest
      .fn()
      .mockReturnValue(testShowCardRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(createTestLogger(), {
      body: testShowCardBody,
    });

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testShowCardRedemptionConfig);
  });

  it('should return kind "VaultNotFound" when the vault offer vaults record does not exist', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testVaultBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError(
      'VaultNotFound',
      "vault record does not exist with corresponding id's",
    );
    expect(actual).toEqual(expected);
  });

  it('should return kind "Error" when the vault offer vaults record fails to update', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(true);
    mockVaultUpdateSucceeds(false);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigTransaction();

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(
      createSilentLogger(),
      {
        body: testVaultBody,
      },
    );

    const expected: UpdateRedemptionConfigError = getExpectedError('Error', 'vault record failed to update');
    expect(actual).toEqual(expected);
  });

  it('should return kind "Ok" when the vault offer redemptions and vault records update correctly', async () => {
    mockRedemptionConfigExist(true);

    //mock repo(s) responses/resolves that execute inside transactionManager(s)
    mockVaultExist(true);
    mockVaultBatches();
    mockVaultFindOneById();
    mockVaultUpdateSucceeds(true);
    mockGenericTransaction();
    mockVaultTransaction();

    mockRedemptionConfigUpdateSucceeds(true, {
      id: testRedemptionId,
      offerId: Number(testVaultBody.offerId),
      redemptionType: testVaultBody.redemptionType,
      connection: testVaultBody.connection,
      companyId: Number(testVaultBody.companyId),
      affiliate: testVaultBody.affiliate,
      url: testVaultBody.url,
      offerType: 'online',
    });
    mockRedemptionConfigTransaction();

    mockRedemptionConfigTransformer.transformToRedemptionConfig = jest.fn().mockReturnValue(testVaultRedemptionConfig);

    const actual: UpdateRedemptionConfigSuccess | UpdateRedemptionConfigError = await callService(createTestLogger(), {
      body: testVaultBody,
    });

    expect(actual.kind).toEqual('Ok');
    expect(actual.data).toEqual(testVaultRedemptionConfig);
  });
});
