import { onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { getApiKey } from '../../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../../helpers/database';
import { buildRedemptionConfig } from '../../helpers/redemptionConfig';

import { callBatchEndpoint } from './helpers';

describe('GET Vault Batches', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  beforeAll(async () => {
    apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
  });

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
  });

  afterAll(() => connectionManager.connection.close());

  const apiCall = callBatchEndpoint.bind(null, 'GET');

  it('returns a batch for a given Vault Id', async () => {
    const { vault, vaultBatch, ...vaultCodeHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(5);
    onTestFinished(vaultCodeHooks.cleanup);
    await vaultCodeHooks.insert();

    const result = await apiCall(`vaults/${vault!.id}/batches`, apiKey);
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
    const { vault, ...vaultHooks } = buildRedemptionConfig(connectionManager).addVault();
    const { vaultBatch: firstVaultBatch } = vaultHooks.addBatch().addCodes(2);
    const { vaultBatch: secondVaultBatch } = vaultHooks.addBatch().addCodes(3);

    onTestFinished(vaultHooks.cleanup);
    await vaultHooks.insert();

    const result = await apiCall(`vaults/${vault.id}/batches`, apiKey);
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
    const { vault, vaultBatch, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(4);

    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const result = await apiCall(`vaults/${vault!.id}/batches`, apiKey);
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
