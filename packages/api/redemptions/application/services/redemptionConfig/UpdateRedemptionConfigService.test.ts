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
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfig.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import { createSilentLogger, createTestLogger } from '@blc-mono/redemptions/libs/test/helpers/logger';

import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

import {
  UpdateGenericRedemptionSchema,
  UpdatePreAppliedRedemptionSchema,
  UpdateRedemptionConfigError,
  UpdateRedemptionConfigService,
  UpdateRedemptionConfigSuccess,
  UpdateShowCardRedemptionSchema,
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

  function getExpectedError(
    kind: 'Error' | 'RedemptionNotFound' | 'GenericNotFound',
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
});
