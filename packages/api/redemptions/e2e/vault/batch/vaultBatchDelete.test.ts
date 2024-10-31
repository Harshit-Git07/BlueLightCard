import { faker } from '@faker-js/faker';
import { onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { getApiKey } from '../../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../../helpers/database';
import { buildRedemptionConfig } from '../../helpers/redemptionConfig';

import { callBatchEndpoint } from './helpers';

describe('DELETE Vault Batches', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  beforeAll(async () => {
    apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
  });

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
  });

  afterAll(() => connectionManager.connection.close());

  const apiCall = callBatchEndpoint.bind(null, 'DELETE');

  const delMsg = 'Vault Batch Delete -';

  it('returns 404 if batch ID does not exist', async () => {
    const { vault, ...redemptionHooks } = buildRedemptionConfig(connectionManager).addVault();

    await redemptionHooks.insert();
    onTestFinished(redemptionHooks.cleanup);

    const body = {
      batchId: `vbt-non-existent`,
    };

    const result = await apiCall(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
    const responseBody = await result.json();

    expect(responseBody).toStrictEqual({
      statusCode: 404,
      data: {
        message: `${delMsg} the vault batch does not exist`,
      },
    });
  });

  it('returns 200 if batch does not have any codes', async () => {
    const { vault, vaultBatch, ...redemptionHooks } = buildRedemptionConfig(connectionManager).addVault().addBatch();

    onTestFinished(async () => {
      await redemptionHooks.cleanup();
    });
    await redemptionHooks.insert();

    const body = {
      batchId: vaultBatch.id,
    };

    const result = await apiCall(`vaults/${vault.id}/batches/${body.batchId}`, apiKey, body);
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

  it('returns 200 if batch only has unclaimed codes', async () => {
    const unclaimedCodesCount = 1000;
    const { vault, vaultBatch, ...vaultCodeHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(unclaimedCodesCount);

    onTestFinished(async () => {
      await vaultCodeHooks.cleanup();
    });
    await vaultCodeHooks.insert();

    const body = {
      batchId: vaultBatch.id,
    };

    const result = await apiCall(`vaults/${vault!.id}/batches/${body.batchId}`, apiKey, body);
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

  it('returns 200 if batch only has claimed codes', async () => {
    const claimedCodesCount = 1000;
    const { vault, vaultBatch, ...vaultCodeHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(claimedCodesCount, { memberId: faker.string.uuid() });

    onTestFinished(async () => {
      await vaultCodeHooks.cleanup();
    });
    await vaultCodeHooks.insert();

    const body = {
      batchId: vaultBatch.id,
    };

    const result = await apiCall(`vaults/${vault!.id}/batches/${body.batchId}`, apiKey, body);
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

  it('returns 200 if batch has both claimed and unclaimed codes', async () => {
    const claimedCodesCount = 3;
    const unclaimedCodesCount = 997;

    const { vault, vaultBatch, ...vaultCodeHooks } = buildRedemptionConfig(connectionManager)
      .addVault()
      .addBatch()
      .addCodes(unclaimedCodesCount)
      .addCodes(claimedCodesCount, { memberId: faker.string.uuid() });

    onTestFinished(async () => {
      await vaultCodeHooks.cleanup();
    });
    await vaultCodeHooks.insert();

    const body = {
      batchId: vaultBatch.id,
    };

    const result = await apiCall(`vaults/${vault!.id}/batches/${body.batchId}`, apiKey, body);
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
});
