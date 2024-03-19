import { eq } from 'drizzle-orm';
import { mocked } from 'jest-mock';

import { httpRequest } from '@blc-mono/core/utils/fetch/httpRequest';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import {
  LegacyVaultApiRepository,
  Secrets,
} from '@blc-mono/redemptions/application/repositories/LegacyVaultApiRepository';
import { RedemptionsRepository } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import {
  PromotionUpdateResults,
  PromotionUpdateService,
  RedemptionUpdate,
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import {
  promotionUpdatedEvenWithOutMetaFactory,
  vaultDependentEntityFactory,
} from '@blc-mono/redemptions/application/test/factories/promotionsEvents.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/application/test/helpers/database';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

jest.mock('@blc-mono/core/utils/fetch/httpRequest');

describe('PromotionUpdateService', () => {
  let database: RedemptionsTestDatabase;
  let dbconnection: DatabaseConnection;

  beforeAll(async () => {
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST = 'https://test.com';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT = 'test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER = 'test';
    database = await RedemptionsTestDatabase.start();
    dbconnection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database?.reset?.();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER;
    await database?.down?.();
    jest.clearAllMocks();
  });

  it(`Maps ${PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS}  result correctly to response`, async () => {
    const event = promotionUpdatedEvenWithOutMetaFactory.build();

    const mockMeta = {
      platform: 'BLC_UK' as const,
      dependentEntities: vaultDependentEntityFactory.buildList(1),
    };

    const mockURL = event.detail.link;

    await dbconnection.db
      .insert(redemptionsTable)
      .values([
        {
          id: 'to-be-updated',
          companyId: mockMeta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: mockMeta.dependentEntities[0].offerId,
          offerType: 'online',
          platform: mockMeta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        },
      ])
      .returning({
        id: redemptionsTable.id,
      });

    const mockedSecretsManager = {
      getSecretValue: jest.fn().mockReturnValue({
        retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
        retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
      }),
    } as unknown as SecretsManager<Secrets>;

    const logger: ILogger = createTestLogger();
    const redemptionRepository = new RedemptionsRepository(dbconnection);
    const legacyRepository = new LegacyVaultApiRepository(logger, mockedSecretsManager);

    const redemptionUpdate: RedemptionUpdate = {
      meta: {
        platform: mockMeta.platform,
        dependentEntities: mockMeta.dependentEntities,
      },
      url: mockURL,
      connection: 'direct',
      affiliate: 'awin',
      offerType: 'online',
      companyId: 1234,
    };

    await redemptionRepository.updateManyByOfferId(redemptionUpdate);

    const mockedResponse = {
      kind: PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS,
      payload: {
        message: 'promotion updated',
      },
    };
    legacyRepository.getVaultByLinkId = jest.fn().mockImplementation(() => mockMeta);

    const service = new PromotionUpdateService(logger, legacyRepository, redemptionRepository);
    const response = await service.handlePromotionUpdate(event);
    expect(response).toEqual(mockedResponse);
    const redemptions = await dbconnection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.offerId, mockMeta.dependentEntities[0].offerId))
      .execute();

    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].url).toBe(mockURL);
  });
  it(`Maps ${PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL}  response correctly incorrect offerId`, async () => {
    const unchangedMockUrl = 'https://example.com/old-url';

    const event = promotionUpdatedEvenWithOutMetaFactory.build({
      detail: {
        link: unchangedMockUrl,
      },
    });

    mocked(httpRequest).mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {
          success: true,
          data: [
            {
              terms: 'test',
              companyId: event.detail.companyId,
              companyName: '',
              offerId: 0,
              brand: 'BLC_UK',
              createdAt: '2021-08-10T14:00:00.000Z',
              managerId: 1234,
              alertBelow: 100,
              showQR: 1,
              vaultStatus: true,
              sk: 'test',
              linkId: event.detail.id,
              maxPerUser: 1,
              id: 'to-be-updated',
            },
          ],
        },
      });
    });

    const mockMeta = {
      platform: 'BLC_UK' as const,
      dependentEntities: vaultDependentEntityFactory.buildList(1),
    };

    await dbconnection.db
      .insert(redemptionsTable)
      .values([
        {
          id: 'to-be-updated',
          companyId: 1234,
          connection: 'direct',
          offerId: 1234,
          offerType: 'online',
          platform: mockMeta.platform,
          redemptionType: 'vault',
          url: unchangedMockUrl,
        },
      ])
      .returning({
        id: redemptionsTable.id,
      });

    const logger: ILogger = createTestLogger();
    const mockedSecretsManager = {
      getSecretValue: jest.fn().mockReturnValue({
        retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
        retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
      }),
    } as unknown as SecretsManager<Secrets>;

    const mockedResponse = {
      kind: PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL,
      payload: {
        message: 'no promotion updated',
      },
    };

    const redemptionRepository = new RedemptionsRepository(dbconnection);
    const legacyRepository = new LegacyVaultApiRepository(logger, mockedSecretsManager);

    const redemptionUpdate: RedemptionUpdate = {
      meta: {
        platform: mockMeta.platform,
        dependentEntities: mockMeta.dependentEntities,
      },
      url: unchangedMockUrl,
      connection: 'direct',
      affiliate: 'awin',
      offerType: 'online',
      companyId: 1234,
    };

    legacyRepository.getVaultByLinkId = jest.fn().mockImplementation(() => mockMeta);
    await redemptionRepository.updateManyByOfferId(redemptionUpdate as RedemptionUpdate);

    const service = new PromotionUpdateService(logger, legacyRepository, redemptionRepository);
    const response = await service.handlePromotionUpdate(event);
    expect(response).toEqual(mockedResponse);
    const redemptions = await dbconnection.db.select().from(redemptionsTable).execute();
    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].url).toBe(unchangedMockUrl);
  });

  it(`Should throw when there is no link`, async () => {
    const event = promotionUpdatedEvenWithOutMetaFactory.build({
      detail: {
        link: '',
      },
    });

    const mockMeta = {
      platform: 'BLC_UK' as const,
      dependentEntities: vaultDependentEntityFactory.buildList(2),
    };
    const unchangedMockUrl = 'https://example.com/old-url';
    const logger: ILogger = createTestLogger();

    await dbconnection.db
      .insert(redemptionsTable)
      .values([
        {
          id: 'to-be-updated',
          companyId: 1234,
          connection: 'direct',
          offerId: 1234,
          offerType: 'online',
          platform: mockMeta.platform,
          redemptionType: 'vault',
          url: unchangedMockUrl,
        },
        {
          companyId: 42,
          connection: 'direct',
          offerId: 1234,
          offerType: 'online',
          platform: mockMeta.platform,
          redemptionType: 'vault',
          url: unchangedMockUrl,
        },
      ])
      .returning({
        id: redemptionsTable.id,
      });

    const mockedSecretsManager = {
      getSecretValue: jest.fn().mockReturnValue({
        retrieveAllVaultsData: 'NewVault/retrieveAllVaults',
        retrieveAllVaultsPassword: 'sjDpKVBt^FxCzq8y',
      }),
    } as unknown as SecretsManager<Secrets>;

    const redemptionRepository = new RedemptionsRepository(dbconnection);
    const legacyRepository = new LegacyVaultApiRepository(logger, mockedSecretsManager);

    const redemptionUpdate: RedemptionUpdate = {
      meta: {
        platform: mockMeta.platform,
        dependentEntities: mockMeta.dependentEntities,
      },
      url: unchangedMockUrl,
      connection: 'direct',
      affiliate: 'awin',
      offerType: 'online',
      companyId: 1234,
    };
    await redemptionRepository.updateManyByOfferId(redemptionUpdate as RedemptionUpdate);
    const service = new PromotionUpdateService(logger, legacyRepository, redemptionRepository);
    await expect(service.handlePromotionUpdate(event)).rejects.toThrow();
  });
});
