import { faker } from '@faker-js/faker';
import { onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { getApiKey } from '../../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../../helpers/database';
import { buildRedemptionConfig } from '../../helpers/redemptionConfig';

import { callBatchEndpoint } from './helpers';

describe('PATCH Vault Batches', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  beforeAll(async () => {
    apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
  });

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
  });

  afterAll(() => connectionManager.connection.close());
  const apiCall = callBatchEndpoint.bind(null, 'PATCH');

  it('responds with a bad request error if the body is invalid', async () => {
    const { vault, ...vaultHooks } = buildRedemptionConfig(connectionManager).addVault();
    onTestFinished(vaultHooks.cleanup);

    await vaultHooks.insert();
    const body = {
      batchId: `vbt-${faker.string.uuid()}`,
    };

    const result = await apiCall(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);

    expect(result.status).toBe(400);
  });

  it('responds with a not found error if the batch does not exist', async () => {
    const { vault, ...vaultHooks } = buildRedemptionConfig(connectionManager).addVault();
    onTestFinished(vaultHooks.cleanup);

    await vaultHooks.insert();

    const body = {
      batchId: `vbt-non-existent`,
      expiry: faker.date.future().toISOString(),
    };

    const result = await apiCall(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);

    expect(result.status).toBe(404);
  });

  it('responds with no content if the batch and codes are updated', async () => {
    const { vault, vaultBatch, ...vaultCodeHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(5);
    onTestFinished(vaultCodeHooks.cleanup);
    await vaultCodeHooks.insert();

    const body = {
      batchId: vaultBatch.id,
      expiry: faker.date.future().toISOString(),
    };

    const result = await apiCall(`vaults/${vault!.id}/batches/${body.batchId}`, apiKey, body);

    expect(result.status).toStrictEqual(204);
  });
});
