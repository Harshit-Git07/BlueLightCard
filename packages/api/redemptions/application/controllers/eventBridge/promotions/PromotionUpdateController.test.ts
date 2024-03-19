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
} from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { promotionUpdatedEvenWithOutMetaFactory } from '@blc-mono/redemptions/application/test/factories/promotionsEvents.factory';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

import { createTestLogger } from '../../../test/helpers/logger';

import { PromotionUpdateController } from './PromotionUpdateController';
jest.mock('@blc-mono/core/utils/fetch/httpRequest');

describe('PromotionUpdateController', () => {
  const mockedSecretsManager = {
    getSecretValue: jest.fn().mockResolvedValue({
      codeRedeemedData: 'NewVault/test',
      codeRedeemedPassword: 'sjDeKVBt^BxFzq8y',
      checkAmountIssuedData: 'NewVault/test',
      checkAmountIssuedPassword: 'sjDeKVBt^BxFzq8y',
      assignUserCodesData: 'NewVault/test',
      assignUserCodesPassword: 'sjDeKVBt^BxFzq8y',
      retrieveAllVaultsData: 'NewVault/test',
      retrieveAllVaultsPassword: 'sjDeKVBt^BxFzq8y',
    }),
  } as unknown as SecretsManager<Secrets>;

  beforeEach(() => {
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST = 'https://test.com';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH = '/test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT = 'test';
    process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER = 'test';
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_HOST;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT;
    delete process.env.REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER;
  });

  it(`Maps ${PromotionUpdateResults.PROMOTION_UPDATED_SUCCESS}  result correctly to response`, async () => {
    const logger: ILogger = createTestLogger();
    const connection = {
      db: {
        transaction: jest.fn().mockImplementation(() => {
          return [{}];
        }),
        update: jest.fn(),
      },
    } as unknown as DatabaseConnection;

    const redemptionRepository = new RedemptionsRepository(connection);
    const legacyVaultApiRepository = new LegacyVaultApiRepository(logger, mockedSecretsManager);

    const mockPromotionService = new PromotionUpdateService(logger, legacyVaultApiRepository, redemptionRepository);

    const results = new PromotionUpdateController(logger, mockPromotionService);
    const event = promotionUpdatedEvenWithOutMetaFactory.build({
      detail: {
        platform: 'BLC_UK',
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
              offerId: 1234,
              brand: 'BLC_UK',
              createdAt: '2021-08-10T14:00:00.000Z',
              managerId: 1234,
              alertBelow: 100,
              showQR: 1,
              vaultStatus: true,
              sk: 'test',
              linkId: event.detail.id,
              maxPerUser: 1,
              id: 'test',
            },
          ],
        },
      });
    });

    await results.handle(event);
    expect(logger.info).toHaveBeenCalledWith({ message: 'promotion updated' });
  });

  it(`Maps ${PromotionUpdateResults.PROMOTION_UPDATE_UNSUCCESSFUL}  response correctly`, async () => {
    const logger: ILogger = createTestLogger();

    const connection = {
      db: {
        transaction: jest.fn().mockImplementation(() => {
          return [];
        }),
        update: jest.fn(),
      },
    } as unknown as DatabaseConnection;

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
              offerId: 1234,
              brand: 'BLC_UK',
              createdAt: '2021-08-10T14:00:00.000Z',
              managerId: 1234,
              alertBelow: 100,
              showQR: 1,
              vaultStatus: true,
              sk: 'test',
              linkId: event.detail.id,
              maxPerUser: 1,
              id: 'test',
            },
          ],
        },
      });
    });

    const redemptionRepository = new RedemptionsRepository(connection);
    const legacyVaultApiRepository = new LegacyVaultApiRepository(logger, mockedSecretsManager);

    const mockPromotionService = new PromotionUpdateService(logger, legacyVaultApiRepository, redemptionRepository);
    const results = new PromotionUpdateController(logger, mockPromotionService);

    const event = promotionUpdatedEvenWithOutMetaFactory.build();
    await results.handle(event);
    expect(logger.error).toHaveBeenCalledWith({ message: 'no promotion updated' });
  });
});
