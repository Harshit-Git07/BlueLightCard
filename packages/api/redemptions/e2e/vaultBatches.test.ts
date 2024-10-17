import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { eq, inArray } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, it, onTestFinished, test } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import {
  createRedemptionsIdE2E,
  createVaultBatchesIdE2E,
  createVaultIdE2E,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '../libs/database/schema';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '../libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '../libs/test/factories/vaultCodeEntity.factory';
import { vaultEntityFactory } from '../libs/test/factories/vaultEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

describe('Vault Batch admin API tests', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  const buildRedemptionForPostMethod = (companyId: number, offerId: string) => {
    const redemption = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      companyId: companyId,
      offerId: offerId,
      redemptionType: 'vault',
      connection: 'direct',
      url: faker.internet.url(),
    });

    return {
      redemption,
      async insert() {
        await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      },
      async cleanup() {
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      },
    };
  };

  const buildVaultForPostMethod = (
    redemptionParams: NonNullable<Parameters<typeof redemptionConfigEntityFactory.build>[0]>,
  ) => {
    const redemption = redemptionConfigEntityFactory.build(redemptionParams);
    const vault = vaultEntityFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemption.id,
    });

    return {
      vault,
      async insert() {
        await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
        await connectionManager.connection.db.insert(vaultsTable).values(vault);
      },
      async cleanup() {
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.vaultId, vault.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      },
    };
  };

  const buildVault = () => {
    const redemption = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
    });
    const vault = vaultEntityFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemption.id,
    });

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
    const vaultBatch = vaultBatchEntityFactory.build({
      id: createVaultBatchesIdE2E(),
      vaultId,
    });

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
    vaultCodeParams: NonNullable<Parameters<typeof vaultCodeEntityFactory.build>[0]>,
  ) => {
    const vaultCodes = vaultCodeEntityFactory.buildList(count, {
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
    vaultCodeParams?: Parameters<typeof vaultCodeEntityFactory.build>[0],
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

  async function callBatchEndpoint(method: string, path: string, key?: string, body?: object): Promise<Response> {
    const payload = {
      method: method,
      headers: {
        ...(key !== undefined && { 'X-API-Key': key }),
        'Content-Type': 'application/json',
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}${path}`, payload);
  }

  const apiCall = {
    get: callBatchEndpoint.bind(null, 'GET'),
    post: callBatchEndpoint.bind(null, 'POST'),
    patch: callBatchEndpoint.bind(null, 'PATCH'),
    delete: callBatchEndpoint.bind(null, 'DELETE'),
  };

  describe('API key authentication', () => {
    test.each([
      { path: 'vaults/vlt-abcd/batches', method: 'post', key: undefined },
      { path: 'vaults/vlt-abcd/batches', method: 'get', key: undefined },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'patch', key: undefined },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'delete', key: undefined },
      { path: 'vaults/vlt-abcd/batches', method: 'post', key: '' },
      { path: 'vaults/vlt-abcd/batches', method: 'get', key: '' },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'patch', key: '' },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'delete', key: '' },
    ] as const)(`$method: authorisation error for no key`, async (params): Promise<void> => {
      const result = await apiCall[params.method](params.path);
      expect(result.status).toBe(403);
    });

    test.each([
      { path: 'vaults/vlt-abcd/batches', method: 'get' },
      { path: 'vaults/vlt-abcd/batches', method: 'post' },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'patch' },
      { path: 'vaults/vlt-abcd/batches/vbt-efgh', method: 'delete' },
    ] as const)(`$method: authorisation error for invalid key`, async (params): Promise<void> => {
      const result = await apiCall[params.method](params.path, 'invalid-api-key');
      expect(result.status).toBe(403);
    });
  });

  describe('POST Vault Batches', () => {
    test.each([
      {
        vaultId: 'vault#BLC',
        message: 'legacy vaultId is incorrectly formatted',
      },
      {
        vaultId: 'vault#12345#BLC',
        message: 'legacy vaultId is missing companyId and/or offerId',
      },
      {
        vaultId: 'vault#12345-67890#BLC',
        message: 'redemption does not exist for legacy vault',
      },
      {
        vaultId: 'vlt-123-456-789-000',
        message: 'vault does not exist for standard vaultId',
      },
    ])(`returns 404 for $message: $vaultId`, async (params): Promise<void> => {
      const body = {
        vaultId: params.vaultId,
        expiry: faker.date.future().toISOString(),
      };
      const urlVaultId = encodeURIComponent(params.vaultId);

      const result = await apiCall.post(`vaults/${urlVaultId}/batches`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 404,
        data: {
          message: `CreateVaultBatch - ${params.message} (vaultId=${params.vaultId})`,
        },
      });
    });

    it('returns 404 error when legacy vaultId vaults record does not exist', async () => {
      const companyId = 12345;
      const offerId = '67890';
      const { ...RedemptionHooks } = buildRedemptionForPostMethod(companyId, offerId);
      onTestFinished(RedemptionHooks.cleanup);
      await RedemptionHooks.insert();

      const legacyVaultId = `vault#${companyId}-${offerId}#BLC`;
      const body = {
        vaultId: legacyVaultId,
        expiry: faker.date.future().toISOString(),
      };
      const urlVaultId = encodeURIComponent(legacyVaultId);

      const result = await apiCall.post(`vaults/${urlVaultId}/batches`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 404,
        data: {
          message: `CreateVaultBatch - vault does not exist for legacy vault redemptionId (vaultId=${legacyVaultId})`,
        },
      });
    });

    it('returns 200 when legacy vaultId redemptions and vault exists', async () => {
      const companyId = 12345;
      const offerId = '67890';
      const { ...VaultHooks } = buildVaultForPostMethod({
        id: createRedemptionsIdE2E(),
        companyId: companyId,
        offerId: offerId,
        redemptionType: 'vault',
        connection: 'direct',
        url: faker.internet.url(),
      });
      onTestFinished(VaultHooks.cleanup);
      await VaultHooks.insert();

      const legacyVaultId = `vault#${companyId}-${offerId}#BLC`;
      const body = {
        vaultId: legacyVaultId,
        expiry: faker.date.future().toISOString(),
      };
      const urlVaultId = encodeURIComponent(legacyVaultId);

      const result = await apiCall.post(`vaults/${urlVaultId}/batches`, apiKey, body);

      expect(result.status).toStrictEqual(200);
    });

    it('returns 200 when standard vaultId vaults record exists', async () => {
      const { vault, ...VaultHooks } = buildVaultForPostMethod({
        id: createRedemptionsIdE2E(),
        redemptionType: 'vault',
        connection: 'direct',
        url: faker.internet.url(),
      });
      onTestFinished(VaultHooks.cleanup);
      await VaultHooks.insert();

      const body = {
        vaultId: vault.id,
        expiry: faker.date.future().toISOString(),
      };

      const result = await apiCall.post(`vaults/${vault.id}/batches`, apiKey, body);

      expect(result.status).toStrictEqual(200);
    });
  });

  describe('GET Vault Batches', () => {
    it('returns a batch for a given Vault Id', async () => {
      const { vault, vaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(5);
      onTestFinished(vaultCodeHooks.cleanup);
      await vaultCodeHooks.insert();

      const result = await apiCall.get(`vaults/${vault.id}/batches`, apiKey);
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

      const result = await apiCall.get(`vaults/${vault.id}/batches`, apiKey);
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

      const result = await apiCall.get(`vaults/${vault.id}/batches`, apiKey);
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
    it('responds with a bad request error if the body is invalid', async () => {
      const { vault, ...vaultHooks } = buildVault();
      onTestFinished(vaultHooks.cleanup);

      await vaultHooks.insert();
      const body = {
        batchId: `vbt-${faker.string.uuid()}`,
      };

      const result = await apiCall.patch(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);

      expect(result.status).toBe(400);
    });

    it('responds with a not found error if the batch does not exist', async () => {
      const { vault, ...vaultHooks } = buildVault();
      onTestFinished(vaultHooks.cleanup);

      await vaultHooks.insert();

      const body = {
        batchId: `vbt-non-existent`,
        expiry: faker.date.future().toISOString(),
      };

      const result = await apiCall.patch(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);

      expect(result.status).toBe(404);
    });

    it('responds with no content if the batch and codes are updated', async () => {
      const { vault, vaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(5);
      onTestFinished(vaultCodeHooks.cleanup);
      await vaultCodeHooks.insert();

      const body = {
        batchId: vaultBatch.id,
        expiry: faker.date.future().toISOString(),
      };

      const result = await apiCall.patch(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);

      expect(result.status).toStrictEqual(204);
    });
  });

  describe('DELETE Vault Batches', () => {
    const delMsg = 'Vault Batch Delete -';

    it('returns 404 if batch ID does not exist', async () => {
      const { vault, ...vaultHooks } = buildVault();
      onTestFinished(vaultHooks.cleanup);

      await vaultHooks.insert();

      const body = {
        batchId: `vbt-non-existent`,
      };

      const result = await apiCall.delete(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 404,
        data: {
          message: `${delMsg} the vault batch does not exist`,
        },
      });
    });

    it('returns 200 if batch ID exists and does not have claimed or unclaimed codes', async () => {
      const { vault, ...vaultHooks } = buildVault();
      const { vaultBatch, ...vaultBatchHooks } = buildVaultBatch(vault.id);

      onTestFinished(async () => {
        await vaultBatchHooks.cleanup();
        await vaultHooks.cleanup();
      });
      await vaultHooks.insert();
      await vaultBatchHooks.insert();

      const body = {
        batchId: vaultBatch.id,
      };

      const result = await apiCall.delete(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 200,
        data: {
          vaultBatchId: vaultBatch.id,
          vaultBatchDeleted: true,
          vaultCodesDeleted: false,
          countCodesDeleted: 0,
          message: `${delMsg} there are no codes to delete, batch successfully deleted`,
        },
      });
    });

    it('returns 200 if batch ID exists and only has unclaimed codes', async () => {
      const unclaimedCodesCount = 1000;
      const { vault, vaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(unclaimedCodesCount);

      onTestFinished(async () => {
        await vaultCodeHooks.cleanup();
      });
      await vaultCodeHooks.insert();

      const body = {
        batchId: vaultBatch.id,
      };

      const result = await apiCall.delete(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 200,
        data: {
          vaultBatchId: vaultBatch.id,
          vaultBatchDeleted: true,
          vaultCodesDeleted: true,
          countCodesDeleted: unclaimedCodesCount,
          message: `${delMsg} the batch and codes were successfully deleted`,
        },
      });
    });

    it('returns 200 if batch ID exists and has claimed and unclaimed codes', async () => {
      const unclaimedCodesCount = 997;
      const { vault, vaultBatch, ...unclaimedVaultCodeHooks } = buildVaultWithCodes(unclaimedCodesCount);

      const claimedCodesCount = 3;
      const { ...claimedVaultCodeHooks } = buildVaultCodes(claimedCodesCount, {
        vaultId: vault.id,
        batchId: vaultBatch.id,
        memberId: faker.string.uuid(),
      });

      onTestFinished(async () => {
        await claimedVaultCodeHooks.cleanup();
        await unclaimedVaultCodeHooks.cleanup();
      });
      await unclaimedVaultCodeHooks.insert();
      await claimedVaultCodeHooks.insert();

      const body = {
        batchId: vaultBatch.id,
      };

      const result = await apiCall.delete(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 200,
        data: {
          vaultBatchId: vaultBatch.id,
          vaultBatchDeleted: false,
          vaultCodesDeleted: true,
          countCodesDeleted: unclaimedCodesCount,
          message: `${delMsg} batch was not deleted as it has ${claimedCodesCount} claimed code(s), unclaimed codes successfully deleted`,
        },
      });
    });

    it('returns 200 if batch ID exists and only has claimed codes', async () => {
      const claimedCodesCount = 1000;
      const { vault, vaultBatch, ...vaultCodeHooks } = buildVaultWithCodes(claimedCodesCount, {
        memberId: faker.string.uuid(),
      });

      onTestFinished(async () => {
        await vaultCodeHooks.cleanup();
      });
      await vaultCodeHooks.insert();

      const body = {
        batchId: vaultBatch.id,
      };

      const result = await apiCall.delete(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 200,
        data: {
          vaultBatchId: vaultBatch.id,
          vaultBatchDeleted: false,
          vaultCodesDeleted: false,
          countCodesDeleted: 0,
          message: `${delMsg} batch has ${claimedCodesCount} claimed codes only, nothing deleted`,
        },
      });
    });
  });
});
