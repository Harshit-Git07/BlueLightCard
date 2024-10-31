import { faker } from '@faker-js/faker';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, onTestFinished, test } from 'vitest';

import { GenericsRepository } from '../../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../../application/repositories/RedemptionConfigCombinedRepository';
import { RedemptionConfigRepository } from '../../application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '../../application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '../../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../../libs/database/connection';
import { getApiKey } from '../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../helpers/database';
import { buildRedemptionConfig } from '../helpers/redemptionConfig';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

let vaultsRepository: VaultsRepository;
let vaultBatchesRepository: VaultBatchesRepository;
let genericsRepository: GenericsRepository;
let redemptionConfigRepository: RedemptionConfigRepository;
let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

beforeAll(async () => {
  apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
});

beforeAll(async () => {
  connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);

  vaultsRepository = new VaultsRepository(connectionManager.connection);
  vaultBatchesRepository = new VaultBatchesRepository(connectionManager.connection);
  genericsRepository = new GenericsRepository(connectionManager.connection);
  redemptionConfigRepository = new RedemptionConfigRepository(connectionManager.connection);
  redemptionRepositoryHelper = new RedemptionConfigCombinedRepository(
    redemptionConfigRepository,
    vaultsRepository,
    vaultBatchesRepository,
    genericsRepository,
  );

  // Set a conservative timeout
}, 60_000);

afterAll(async () => {
  await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds(['1', '2', '3', '4', '5']);
  await connectionManager?.cleanup();
});

describe('GET Redemption Config', () => {
  test.each([
    ['vault', '1'],
    ['vaultQR', '2'],
  ] as const)('returns config with vault info for redemptionType %s', async (redemptionType, offerId) => {
    const { redemptionConfig, vault, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      offerId,
      redemptionType: redemptionType,
      connection: 'affiliate',
      ...(redemptionType === 'vault' && { url: faker.internet.url() }),
      affiliate: 'awin',
    }).addVault();
    const { batches } = redemptionConfigHooks
      .addBatch({ created: new Date('2021-01-01') })
      .addBatch({ created: new Date('2021-02-01') })
      .addBatch({ created: new Date('2021-03-01') });

    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const vaultRedemptionConfig = redemptionConfig!;
    const result = await callRedemptionConfigEndpoint(vaultRedemptionConfig.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: vaultRedemptionConfig.id,
        offerId: vaultRedemptionConfig.offerId,
        redemptionType: redemptionType,
        connection: vaultRedemptionConfig.connection,
        companyId: vaultRedemptionConfig.companyId,
        affiliate: vaultRedemptionConfig.affiliate,
        ...(redemptionType === 'vault' && { url: vaultRedemptionConfig.url }),
        vault: {
          id: vault.id,
          alertBelow: vault.alertBelow,
          status: vault.status,
          maxPerUser: vault.maxPerUser,
          createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
          email: vault.email,
          integration: vault.integration,
          integrationId: String(vault.integrationId),
          batches: [
            {
              id: batches[0].id,
              created: new Date('2021-01-01').toISOString(),
              expiry: batches[0].expiry.toISOString(),
            },
            {
              id: batches[1].id,
              created: new Date('2021-02-01').toISOString(),
              expiry: batches[1].expiry.toISOString(),
            },
            {
              id: batches[2].id,
              created: new Date('2021-03-01').toISOString(),
              expiry: batches[2].expiry.toISOString(),
            },
          ],
        },
      },
    };
    expect(result.status).toBe(200);
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  test('GET /redemptions/{offerId} should return 200 for redemptionType generic', async () => {
    const { redemptionConfig, generic, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      offerId: '3',
      redemptionType: 'generic',
      connection: 'affiliate',
      url: faker.internet.url(),
    }).addGeneric();

    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const result = await callRedemptionConfigEndpoint(redemptionConfig.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'generic',
        connection: redemptionConfig.connection,
        companyId: redemptionConfig.companyId,
        affiliate: redemptionConfig.affiliate,
        url: redemptionConfig.url,
        generic: {
          id: generic.id,
          code: generic.code,
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);

    await genericsRepository.deleteById(generic.id);
    await redemptionConfigRepository.deleteById(redemptionConfig.id);
  });

  test('GET /redemptions/{offerId} should return 200 for redemptionType ShowCard', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      offerId: '4',
      redemptionType: 'showCard',
    });

    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const result = await callRedemptionConfigEndpoint(redemptionConfig.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'showCard',
        companyId: redemptionConfig.companyId,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);

    await redemptionConfigRepository.deleteById(redemptionConfig.id);
  });

  test('GET /redemptions/{offerId} should return correct redemptionConfig for redemptionType PreApplied', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      offerId: '4',
      redemptionType: 'preApplied',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
    });

    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const result = await callRedemptionConfigEndpoint(redemptionConfig.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'preApplied',
        connection: redemptionConfig.connection,
        companyId: redemptionConfig.companyId,
        affiliate: redemptionConfig.affiliate,
        url: redemptionConfig.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);
  });

  test('GET /redemptions/{offerId} returns 404 if offerId can not be found', async () => {
    const result = await callRedemptionConfigEndpoint(faker.string.uuid());

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: 'No redemption found for the given offerId',
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(404);
  });
});

async function callRedemptionConfigEndpoint(offerId: string): Promise<Response> {
  const payload = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/redemptions/${offerId}`, payload);
}
