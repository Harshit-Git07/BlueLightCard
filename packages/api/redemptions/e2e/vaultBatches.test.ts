import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { eq, inArray } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, it, onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import { redemptionsTable, vaultBatchesTable, vaultCodesTable, vaultsTable } from '../libs/database/schema';
import { redemptionFactory } from '../libs/test/factories/redemption.factory';
import { vaultFactory } from '../libs/test/factories/vault.factory';
import { vaultBatchFactory } from '../libs/test/factories/vaultBatches.factory';
import { vaultCodeFactory } from '../libs/test/factories/vaultCode.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

describe('Vault Batch admin API tests', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  const defaultRedemption = redemptionFactory.build();
  const defaultVault = vaultFactory.build({ redemptionId: defaultRedemption.id });
  const defaultVaultBatch = vaultBatchFactory.build({ vaultId: defaultVault.id });
  const defaultVaultCodes = vaultCodeFactory.buildList(5, {
    vaultId: defaultVault.id,
    batchId: defaultVaultBatch.id,
    memberId: null,
  });

  const buildVault = () => {
    const redemption = redemptionFactory.build();
    const vault = vaultFactory.build({ redemptionId: redemption.id });

    return {
      vault,
      async insert() {
        await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
        await connectionManager.connection.db.insert(vaultsTable).values(vault);
      },
      async cleanup() {
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      },
    };
  };

  const buildVaultBatch = (vaultId: string) => {
    const vaultBatch = vaultBatchFactory.build({ vaultId });

    return {
      vaultBatch,
      async insert() {
        await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
      },
      async cleanup() {
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
      },
    };
  };

  const buildVaultCodes = (
    count: number,
    vaultCodeParams: NonNullable<Parameters<typeof vaultCodeFactory.build>[0]>,
  ) => {
    const vaultCodes = vaultCodeFactory.buildList(count, {
      vaultId: vaultCodeParams.vaultId,
      batchId: vaultCodeParams.batchId,
      memberId: null,
      ...vaultCodeParams,
    });

    return {
      vaultCodes,
      async insert() {
        await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCodes);
      },
      async cleanup() {
        await connectionManager.connection.db.delete(vaultCodesTable).where(
          inArray(
            vaultCodesTable.id,
            vaultCodes.map((code) => code.id),
          ),
        );
      },
    };
  };

  const buildVaultWithCodes = (
    numberOfCodes: number,
    vaultCodeParams?: Parameters<typeof vaultCodeFactory.build>[0],
  ) => {
    const { vault, ...vaultHooks } = buildVault();
    const { vaultBatch, ...vaultBatchHooks } = buildVaultBatch(vault.id);
    const { vaultCodes, ...vaultCodeHooks } = buildVaultCodes(numberOfCodes, {
      vaultId: vault.id,
      batchId: vaultBatch.id,
      ...vaultCodeParams,
    });

    return {
      vault,
      vaultBatch,
      vaultCodes,
      async insert() {
        await vaultHooks.insert();
        await vaultBatchHooks.insert();
        await vaultCodeHooks.insert();
      },
      async cleanup() {
        await vaultCodeHooks.cleanup();
        await vaultBatchHooks.cleanup();
        await vaultHooks.cleanup();
      },
    };
  };

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

  afterAll(async () => {
    await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.vaultId, defaultVault.id));
    await connectionManager.connection.db
      .delete(vaultBatchesTable)
      .where(eq(vaultBatchesTable.id, defaultVaultBatch.id));

    await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, defaultVault.id));
    await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, defaultRedemption.id));
  });

  describe('GET Vault Batches', () => {
    describe('API key authentication', () => {
      it('responds with an authorisation error if no key is provided', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch/my-vault-id`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        expect(result.status).toBe(403);
      });

      it('responds with an authorisation error if the wrong key is provided', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch/my-vault-id`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'probably-not-this-one',
          },
        });

        expect(result.status).toBe(403);
      });
    });

    it('returns a batch for a given Vault Id', async () => {
      const { vault, vaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(5);
      onTestFinished(vaultCodeHooks.cleanup);
      await vaultCodeHooks.insert();

      const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch/${vault.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      });
      const body = await result.json();

      expect(body).toStrictEqual({
        statusCode: 200,
        data: [
          {
            batchId: vaultBatch.id,
            vaultId: vaultBatch.vaultId,
            created: vaultBatch.created.toISOString(),
            expiry: vaultBatch.expiry.toISOString(),
            codesRemaining: 5,
          },
        ],
      });
    });

    it('returns each associated Vault batch', async () => {
      const { vault, vaultBatch: firstVaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(2);

      const { vaultBatch: secondVaultBatch, ...secondVaultBatchHooks } = buildVaultBatch(vault.id);
      const { ...secondBatchCodeListHooks } = buildVaultCodes(3, {
        vaultId: vault.id,
        batchId: secondVaultBatch.id,
      });

      onTestFinished(async () => {
        await secondBatchCodeListHooks.cleanup();
        await secondVaultBatchHooks.cleanup();
        await vaultCodeHooks.cleanup();
      });
      await vaultCodeHooks.insert();
      await secondVaultBatchHooks.insert();
      await secondBatchCodeListHooks.insert();

      const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch/${vault.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      });
      const body = await result.json();

      expect(body).toStrictEqual({
        statusCode: 200,
        data: [
          {
            batchId: firstVaultBatch.id,
            vaultId: firstVaultBatch.vaultId,
            created: firstVaultBatch.created.toISOString(),
            expiry: firstVaultBatch.expiry.toISOString(),
            codesRemaining: 2,
          },
          {
            batchId: secondVaultBatch.id,
            vaultId: secondVaultBatch.vaultId,
            created: secondVaultBatch.created.toISOString(),
            expiry: secondVaultBatch.expiry.toISOString(),
            codesRemaining: 3,
          },
        ],
      });
    });

    it('returns the number of unclaimed codes for a Vault batch', async () => {
      const { vault, vaultBatch, ...unclaimedVaultCodeHooks } = buildVaultWithCodes(4);
      const { ...claimedVaultCodeHooks } = buildVaultCodes(1, {
        vaultId: vault.id,
        batchId: vaultBatch.id,
        memberId: '100000',
      });

      onTestFinished(async () => {
        await claimedVaultCodeHooks.cleanup();
        await unclaimedVaultCodeHooks.cleanup();
      });
      await unclaimedVaultCodeHooks.insert();
      await claimedVaultCodeHooks.insert();

      const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch/${vault.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      });
      const body = await result.json();

      expect(body).toStrictEqual({
        statusCode: 200,
        data: [
          {
            batchId: vaultBatch.id,
            vaultId: vaultBatch.vaultId,
            created: vaultBatch.created.toISOString(),
            expiry: vaultBatch.expiry.toISOString(),
            codesRemaining: 4,
          },
        ],
      });
    });
  });

  describe('PATCH Vault Batches', () => {
    describe('API key authentication', () => {
      it('responds with an authorisation error if no key is provided', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            batchId: `vbt-${faker.string.uuid()}`,
            expiry: faker.date.future().toISOString(),
          }),
        });

        expect(result.status).toBe(403);
      });

      it('responds with an authorisation error if the wrong key is provided', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'probably-not-this-one',
          },
          body: JSON.stringify({
            batchId: `vbt-${faker.string.uuid()}`,
            expiry: faker.date.future().toISOString(),
          }),
        });

        expect(result.status).toBe(403);
      });

      it('responds with a bad request error if the body is invalid', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            batchId: `vbt-${faker.string.uuid()}`,
          }),
        });

        expect(result.status).toBe(400);
      });

      it('responds with a not found error if the batch does not exist', async () => {
        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            batchId: `vbt-non-existent`,
            expiry: faker.date.future().toISOString(),
          }),
        });

        expect(result.status).toBe(404);
      });

      it('responds with no content if the batch and codes are updated', async () => {
        await connectionManager.connection.db.insert(redemptionsTable).values(defaultRedemption);
        await connectionManager.connection.db.insert(vaultsTable).values(defaultVault);
        await connectionManager.connection.db.insert(vaultBatchesTable).values(defaultVaultBatch);
        await connectionManager.connection.db.insert(vaultCodesTable).values(defaultVaultCodes);

        const result = await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}batch`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body: JSON.stringify({
            batchId: defaultVaultBatch.id,
            expiry: faker.date.future().toISOString(),
          }),
        });

        expect(result.status).toStrictEqual(204);
      });
    });
  });
});
