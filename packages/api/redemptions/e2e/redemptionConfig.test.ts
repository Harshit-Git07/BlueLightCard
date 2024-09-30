import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { eq } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, test } from 'vitest';

import { GenericEntity } from '../application/repositories/GenericsRepository';
import { RedemptionConfigEntity } from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchEntity } from '../application/repositories/VaultBatchesRepository';
import { VaultEntity } from '../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../libs/database/connection';
import {
  createRedemptionsIdE2E,
  genericsTable,
  redemptionsTable,
  vaultBatchesTable,
  vaultsTable,
} from '../libs/database/schema';
import { genericEntityFactory } from '../libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '../libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '../libs/test/factories/vaultEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

beforeAll(async () => {
  // eslint-disable-next-line no-console
  connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
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

describe('redemption config admin API tests', () => {
  test.each(['vault', 'vaultQR'] as const)(
    'GET /redemptions/{offerId} should return 200 for redemptionType %s',
    async (redemptionType) => {
      const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
        id: createRedemptionsIdE2E(),
        companyId: faker.number.int({ max: 1000000 }),
        offerId: faker.number.int({ max: 1000000 }),
        redemptionType: redemptionType,
        connection: 'affiliate',
        url: faker.internet.url(),
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

      await insertRedemptionInDatabase(redemptionConfigEntity);
      await insertVaultInDatabase(vaultEntity);
      await insertVaultBatchesInDatabase([vaultBatchEntityOne, vaultBatchEntityTwo, vaultBatchEntityThree]);

      const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

      expect(result.status).toBe(200);

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
          url: redemptionConfigEntity.url,
          vault: {
            id: vaultEntity.id,
            alertBelow: vaultEntity.alertBelow,
            status: vaultEntity.status,
            maxPerUser: vaultEntity.maxPerUser,
            createdAt: vaultEntity.created.toISOString(),
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
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);

      await deleteVaultBatchesFromDatabase([vaultBatchEntityOne.id, vaultBatchEntityTwo.id, vaultBatchEntityThree.id]);
      await deleteVaultFromDatabase(vaultEntity.id);
      await deleteRedemptionFromDatabase(redemptionConfigEntity.id);
    },
  );

  test('GET /redemptions/{offerId} should return 200 for redemptionType generic', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 1000000 }),
      offerId: faker.number.int({ max: 1000000 }),
      redemptionType: 'generic',
      connection: 'affiliate',
      url: faker.internet.url(),
    });

    const genericEntity: GenericEntity = genericEntityFactory.build({
      id: faker.string.uuid(),
      code: faker.string.alphanumeric({ length: 8 }),
      redemptionId: redemptionConfigEntity.id,
    });

    await insertRedemptionInDatabase(redemptionConfigEntity);
    await insertGenericInDatabase(genericEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    expect(result.status).toBe(200);

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

    await deleteGenericFromDatabase(genericEntity.id);
    await deleteRedemptionFromDatabase(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} should return 200 for redemptionType ShowCard', async () => {
    const redemptionConfigEntity: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 1000000 }),
      offerId: faker.number.int({ max: 1000000 }),
      redemptionType: 'showCard',
    });

    await insertRedemptionInDatabase(redemptionConfigEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    expect(result.status).toBe(200);

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

    await deleteRedemptionFromDatabase(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} should return correct redemptionConfig for redemptionType PreApplied', async () => {
    const redemptionConfigEntity = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: faker.number.int({ max: 1000000 }),
      offerId: faker.number.int({ max: 1000000 }),
      redemptionType: 'preApplied',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
    });

    await insertRedemptionInDatabase(redemptionConfigEntity);

    const result = await callRedemptionConfigEndpoint(redemptionConfigEntity.offerId);

    expect(result.status).toBe(200);

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

    await deleteRedemptionFromDatabase(redemptionConfigEntity.id);
  });

  test('GET /redemptions/{offerId} returns 404 if offerId can not be found', async () => {
    const result = await callRedemptionConfigEndpoint(faker.number.int({ max: 1000000 }));

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: 'No redemption found for the given offerId',
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });
});

async function insertRedemptionInDatabase(redemptionConfigEntity: RedemptionConfigEntity) {
  await connectionManager.connection.db.insert(redemptionsTable).values(redemptionConfigEntity);
}

async function deleteRedemptionFromDatabase(redemptionId: string) {
  await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemptionId));
}

async function insertGenericInDatabase(genericEntity: GenericEntity) {
  await connectionManager.connection.db.insert(genericsTable).values(genericEntity);
}

async function deleteGenericFromDatabase(genericId: string) {
  await connectionManager.connection.db.delete(genericsTable).where(eq(genericsTable.id, genericId));
}

async function insertVaultInDatabase(vaultEntity: VaultEntity) {
  await connectionManager.connection.db.insert(vaultsTable).values(vaultEntity);
}

async function deleteVaultFromDatabase(vaultId: string) {
  await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vaultId));
}

async function insertVaultBatchesInDatabase(vaultBatchEntities: VaultBatchEntity[]) {
  for (const vaultBatchEntity of vaultBatchEntities) {
    await insertVaultBatchInDatabase(vaultBatchEntity);
  }
}

async function insertVaultBatchInDatabase(vaultBatchEntity: VaultBatchEntity) {
  await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatchEntity);
}

async function deleteVaultBatchesFromDatabase(vaultBatchIds: string[]) {
  for (const vaultBatchId of vaultBatchIds) {
    await deleteVaultBatchFromDatabase(vaultBatchId);
  }
}

async function deleteVaultBatchFromDatabase(vaultBatchId: string) {
  await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatchId));
}

async function callRedemptionConfigEndpoint(offerId: number): Promise<Response> {
  const payload = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/redemptions/${offerId}`, payload);
}
