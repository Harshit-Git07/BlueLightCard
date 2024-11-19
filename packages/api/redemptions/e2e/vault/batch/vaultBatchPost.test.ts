import { faker } from '@faker-js/faker';
import { onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { getApiKey } from '../../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../../helpers/database';
import { buildRedemptionConfig } from '../../helpers/redemptionConfig';

import { callBatchEndpoint } from './helpers';

type ResponseBody = {
  data: {
    id: string;
    vaultId: string;
    uploadUrl: string;
  };
};

describe('POST Vault Batches', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  beforeAll(async () => {
    apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
  });

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
  });

  afterAll(() => connectionManager.connection.close());

  const apiCall = callBatchEndpoint.bind(null, 'POST');

  describe('API key authorisation', () => {
    test.each([
      { path: 'vaults/vlt-abcd/batches', key: undefined },
      { path: 'vaults/vlt-abcd/batches', key: '' },
    ] as const)(
      `post: authorisation error for no key`,
      async (params) => {
        const result = await apiCall(params.path);
        expect(result.status).toBe(403);
      },
      15000,
    );

    test(`post: authorisation error for invalid key`, async () => {
      const result = await apiCall('vaults/vlt-abcd/batches', 'invalid-api-key');
      expect(result.status).toBe(403);
    }, 15000);
  });

  it.each([
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
  ])(
    `returns 404 error when $message: $vaultId`,
    async (params): Promise<void> => {
      const body = {
        vaultId: params.vaultId,
        expiry: faker.date.future().toISOString(),
      };
      const urlVaultId = encodeURIComponent(params.vaultId);

      const result = await apiCall(`vaults/${urlVaultId}/batches`, apiKey, body);
      const responseBody = await result.json();

      expect(responseBody).toStrictEqual({
        statusCode: 404,
        data: {
          message: `CreateVaultBatch - ${params.message} (vaultId=${params.vaultId})`,
        },
      });
    },
    15000,
  );

  it('returns 404 error when creating a vault for a legacy vault which does not exist', async () => {
    const companyId = faker.string.numeric(5);
    const offerId = faker.string.numeric(5);
    const { ...RedemptionHooks } = buildRedemptionConfig(connectionManager, { companyId, offerId });
    onTestFinished(RedemptionHooks.cleanup);
    await RedemptionHooks.insert();

    const legacyVaultId = `vault#${companyId}-${offerId}#BLC`;
    const body = {
      vaultId: legacyVaultId,
      expiry: faker.date.future().toISOString(),
    };
    const urlVaultId = encodeURIComponent(legacyVaultId);

    const result = await apiCall(`vaults/${urlVaultId}/batches`, apiKey, body);
    const responseBody = await result.json();

    expect(responseBody).toStrictEqual({
      statusCode: 404,
      data: {
        message: `CreateVaultBatch - vault does not exist for legacy vault redemptionId (vaultId=${legacyVaultId})`,
      },
    });
  }, 15000);

  it('allows creation of a new batch in a legacy vault', async () => {
    const companyId = faker.string.numeric(5);
    const offerId = faker.string.numeric(5);
    const { ...vaultHooks } = buildRedemptionConfig(connectionManager, {
      companyId: companyId,
      offerId: offerId,
      redemptionType: 'vault',
      url: faker.internet.url(),
    }).addVault({ vaultType: 'legacy' });

    onTestFinished(vaultHooks.cleanup);
    await vaultHooks.insert();

    const legacyVaultId = `vault#${companyId}-${offerId}#BLC`;
    const body = {
      vaultId: legacyVaultId,
      expiry: faker.date.future().toISOString(),
    };
    const urlVaultId = encodeURIComponent(legacyVaultId);

    const result = await apiCall(`vaults/${urlVaultId}/batches`, apiKey, body);
    const responseBody = (await result.json()) as ResponseBody;
    expect(result.status).toStrictEqual(200);
    expect(responseBody.data).toStrictEqual({
      id: expect.stringMatching(/^vbt[a-z0-9-]+$/),
      vaultId: expect.stringMatching(/^e2e:vlt[a-z0-9-]+$/),
      uploadUrl: expect.stringMatching(/^https:\/\//),
    });
  }, 15000);

  it('allows creation of a new batch in a standard vault', async () => {
    const { vault, ...vaultHooks } = buildRedemptionConfig(connectionManager).addVault({ vaultType: 'standard' });
    onTestFinished(vaultHooks.cleanup);
    await vaultHooks.insert();

    const body = {
      vaultId: vault.id,
      expiry: faker.date.future().toISOString(),
    };

    const result = await apiCall(`vaults/${vault.id}/batches`, apiKey, body);
    const responseBody = (await result.json()) as ResponseBody;

    expect(result.status).toStrictEqual(200);
    expect(responseBody.data).toStrictEqual({
      id: expect.stringMatching(/^vbt[a-z0-9-]+$/),
      vaultId: expect.stringMatching(/^e2e:vlt[a-z0-9-]+$/),
      uploadUrl: expect.stringMatching(/^https:\/\//),
    });
  }, 15000);
});
