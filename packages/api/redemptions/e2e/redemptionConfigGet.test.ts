import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { GenericEntity, GenericsRepository } from '../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../application/repositories/RedemptionConfigCombinedRepository';
import {
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchEntity, VaultBatchesRepository } from '../application/repositories/VaultBatchesRepository';
import { VaultEntity, VaultsRepository } from '../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsIdE2E } from '../libs/database/schema';
import { genericEntityFactory } from '../libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '../libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '../libs/test/factories/vaultEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

let vaultsRepository: VaultsRepository;
let vaultBatchesRepository: VaultBatchesRepository;
let genericsRepository: GenericsRepository;
let redemptionConfigRepository: RedemptionConfigRepository;
let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

beforeAll(async () => {
  // eslint-disable-next-line no-console

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

  const APIGateway = new AWS.APIGateway();
  const keyLookup = `${process.env.SST_STAGE}-redemptions-admin`;
  apiKey = await new Promise((resolve) => {
    APIGateway.getApiKeys({ nameQuery: keyLookup, includeValues: true }, (_err, data) => {
      if (!data.items![0].value) {
        throw new Error('Unable to find API key: ' + keyLookup);
      }

      resolve(data.items![0].value);
    });
  });

  // Set a conservative timeout
}, 60_000);

afterAll(async () => {
  await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds(['1', '2', '3', '4', '5']);
  await connectionManager?.cleanup();
});

describe('redemption config admin API tests', () => {
  test.each([
    ['vault', '1'],
    ['vaultQR', '2'],
  ] as const)('GET /redemptions/{offerId} should return 200 for redemptionType %s', async (redemptionType, offerId) => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 216380 }),
      offerId,
      redemptionType: redemptionType,
      connection: 'affiliate',
      ...(redemptionType === 'vault' && { url: faker.internet.url() }),
      affiliate: 'awin',
    });

    const vaultEntity: VaultEntity = vaultEntityFactory.build({
      redemptionId: redemptionConfigEntity.id,
    });

    const vaultBatchEntityOne: VaultBatchEntity = vaultBatchEntityFactory.build({
      vaultId: vaultEntity.id,
      created: new Date('2021-01-01'),
    });
    const vaultBatchEntityTwo: VaultBatchEntity = vaultBatchEntityFactory.build({
      vaultId: vaultEntity.id,
      created: new Date('2021-02-01'),
    });
    const vaultBatchEntityThree: VaultBatchEntity = vaultBatchEntityFactory.build({
      vaultId: vaultEntity.id,
      created: new Date('2021-03-01'),
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntity);
    await vaultsRepository.create(vaultEntity);

    await vaultBatchesRepository.create(vaultBatchEntityOne);
    await vaultBatchesRepository.create(vaultBatchEntityTwo);
    await vaultBatchesRepository.create(vaultBatchEntityThree);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfigEntity.id,
        offerId: String(redemptionConfigEntity.offerId),
        redemptionType: redemptionType,
        connection: redemptionConfigEntity.connection,
        companyId: String(redemptionConfigEntity.companyId),
        affiliate: redemptionConfigEntity.affiliate,
        ...(redemptionType === 'vault' && { url: redemptionConfigEntity.url }),
        vault: {
          id: vaultEntity.id,
          alertBelow: vaultEntity.alertBelow,
          status: vaultEntity.status,
          maxPerUser: vaultEntity.maxPerUser,
          createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
          email: vaultEntity.email,
          integration: vaultEntity.integration,
          integrationId: String(vaultEntity.integrationId),
          batches: [
            {
              id: vaultBatchEntityOne.id,
              created: vaultBatchEntityOne.created.toISOString(),
              expiry: vaultBatchEntityOne.expiry.toISOString(),
            },
            {
              id: vaultBatchEntityTwo.id,
              created: vaultBatchEntityTwo.created.toISOString(),
              expiry: vaultBatchEntityTwo.expiry.toISOString(),
            },
            {
              id: vaultBatchEntityThree.id,
              created: vaultBatchEntityThree.created.toISOString(),
              expiry: vaultBatchEntityThree.expiry.toISOString(),
            },
          ],
        },
      },
    };
    expect(result.status).toBe(200);
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);

    await vaultBatchesRepository.deleteById(vaultBatchEntityOne.id);
    await vaultBatchesRepository.deleteById(vaultBatchEntityTwo.id);
    await vaultBatchesRepository.deleteById(vaultBatchEntityThree.id);

    await vaultsRepository.deleteById(vaultEntity.id);
    await redemptionConfigRepository.deleteById(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} should return 200 for redemptionType generic', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 216380 }),
      offerId: '3',
      redemptionType: 'generic',
      connection: 'affiliate',
      url: faker.internet.url(),
    });

    const genericEntity: GenericEntity = genericEntityFactory.build({
      id: faker.string.uuid(),
      code: faker.string.alphanumeric({ length: 8 }),
      redemptionId: redemptionConfigEntity.id,
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntity);
    await genericsRepository.createGeneric(genericEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfigEntity.id,
        offerId: String(redemptionConfigEntity.offerId),
        redemptionType: 'generic',
        connection: redemptionConfigEntity.connection,
        companyId: String(redemptionConfigEntity.companyId),
        affiliate: redemptionConfigEntity.affiliate,
        url: redemptionConfigEntity.url,
        generic: {
          id: genericEntity.id,
          code: genericEntity.code,
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);

    await genericsRepository.deleteById(genericEntity.id);
    await redemptionConfigRepository.deleteById(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} should return 200 for redemptionType ShowCard', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 216380 }),
      offerId: '4',
      redemptionType: 'showCard',
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfigEntity.id,
        offerId: String(redemptionConfigEntity.offerId),
        redemptionType: 'showCard',
        companyId: String(redemptionConfigEntity.companyId),
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);

    await redemptionConfigRepository.deleteById(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} should return correct redemptionConfig for redemptionType PreApplied', async () => {
    const redemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 216380 }),
      offerId: '5',
      redemptionType: 'preApplied',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfigEntity.id,
        offerId: String(redemptionConfigEntity.offerId),
        redemptionType: 'preApplied',
        connection: redemptionConfigEntity.connection,
        companyId: String(redemptionConfigEntity.companyId),
        affiliate: redemptionConfigEntity.affiliate,
        url: redemptionConfigEntity.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    expect(result.status).toBe(200);

    await redemptionConfigRepository.deleteById(redemptionConfigEntity.id);
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
