import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import jwtDecode from 'jwt-decode';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, onTestFinished, test } from 'vitest';

import { REDEMPTION_TYPES } from '../../core/src/constants/redemptions';
import { DatabaseConnectionType } from '../libs/database/connection';
import {
  createRedemptionsIdE2E,
  createVaultBatchesIdE2E,
  createVaultCodesIdE2E,
  createVaultIdE2E,
  integrationCodesTable,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '../libs/database/schema';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '../libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '../libs/test/factories/vaultCodeEntity.factory';
import { vaultEntityFactory } from '../libs/test/factories/vaultEntity.factory';
import { TestAccount, TestUser, TestUserTokens } from '../libs/test/helpers/identity';

import { E2EDatabaseConnectionManager } from './helpers/database';
import { DwhTestHelper } from './helpers/DwhTestHelper';

type RequestBody = {
  offerId: string;
  companyName: string;
  offerName: string;
};

const executeAsyncSequence = (...asyncFunctions: (() => Promise<void>)[]) => {
  return asyncFunctions.reduce((promise, current) => {
    return promise.then(current);
  }, Promise.resolve());
};

const uniqodoPromotionId = '43c3780817f7ccb92012e519f0814c0b'; //vaults with uniqodo must use this static promotionId provided
const eagleEyeResourceId = '62577'; //This is a static value that is set up in eagle eye staging account.

describe('POST /member/redeem', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let testUserAccount: TestAccount;
  let testUserTokens: TestUserTokens;

  const buildTestRedemption = (
    redemptionType: (typeof REDEMPTION_TYPES)[number],
    additionalParams: Omit<Parameters<typeof redemptionConfigEntityFactory.build>[0], 'redemptionType'> = {},
  ) => {
    const redemption = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      redemptionType: redemptionType,
      connection: 'direct',
      url: faker.internet.url(),
      ...additionalParams,
    });

    return {
      redemption,
      insert: async () => {
        await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      },
      cleanup: async () => {
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      },
    };
  };

  const buildVault = (redemptionId: string) => {
    const vault = vaultEntityFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemptionId,
      status: 'active',
      vaultType: 'standard',
      integrationId: null,
      integration: null,
    });
    const vaultBatch = vaultBatchEntityFactory.build({
      id: createVaultBatchesIdE2E(),
      vaultId: vault.id,
    });
    const vaultCode = vaultCodeEntityFactory.build({
      id: createVaultCodesIdE2E(),
      batchId: vaultBatch.id,
      expiry: faker.date.future({ years: 1 }),
      vaultId: vault.id,
      memberId: null,
    });

    return {
      vault,
      vaultBatch,
      vaultCode,
      insert: async () => {
        await connectionManager.connection.db.insert(vaultsTable).values(vault);
        await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
        await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);
      },
      cleanup: async () => {
        await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
      },
    };
  };

  const buildIntegrationVault = (redemptionId: string, integration: 'eagleeye' | 'uniqodo', integrationId: string) => {
    const vault = vaultEntityFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemptionId,
      status: 'active',
      vaultType: 'standard',
      integrationId: integrationId,
      integration: integration,
    });

    return {
      vault,
      insert: async () => {
        await connectionManager.connection.db.insert(vaultsTable).values(vault);
      },
      cleanup: async () => {
        await connectionManager.connection.db
          .delete(integrationCodesTable)
          .where(eq(integrationCodesTable.vaultId, vault.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
      },
    };
  };

  const sendRedemptionRequest = (body: RequestBody, additionalHeaders: Record<string, string> = {}) => {
    return fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserTokens.idToken}`,
        ...additionalHeaders,
      },
      body: JSON.stringify(body),
    });
  };

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
    testUserTokens = await TestUser.authenticate();
    testUserAccount = jwtDecode(testUserTokens.idToken);

    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await connectionManager?.cleanup();
  });

  test('should return unauthorized when called without a token', async () => {
    // Arrange
    const offerId = faker.number.int({
      min: 1,
      max: 1_000_000,
    });
    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        offerId,
        companyName,
        offerName,
      }),
    });
    const body = await result.json();

    // Assert
    expect(result.status).toBe(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  test('should return unauthorized when called with invalid token', async () => {
    // Arrange
    const offerId = faker.string.sample(10);
    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await sendRedemptionRequest(
      {
        offerId,
        companyName,
        offerName,
      },
      { Authorization: 'token' },
    );

    const body = await result.json();

    // Assert
    expect(result.status).toBe(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  test('rejects a redemption request with invalid parameters', async () => {
    // Arrange
    const { redemption, ...RedemptionTestHooks } = buildTestRedemption('preApplied');

    onTestFinished(RedemptionTestHooks.cleanup);
    await RedemptionTestHooks.insert();

    // Act
    const result = await sendRedemptionRequest({
      offerId: Number(redemption.offerId) as unknown as string, // invalid (should be string)
      companyName: faker.company.name(),
      offerName: faker.commerce.productName(),
    });

    // Assert
    expect(result.status).toBe(400);
  });

  test('should redeem a standard vault offer', { timeout: 60_000 }, async () => {
    // Arrange
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault');
    const { vaultCode, ...vaultTestHooks } = buildVault(redemption.id);

    onTestFinished(() => executeAsyncSequence(vaultTestHooks.cleanup, redemptionTestHooks.cleanup));
    await executeAsyncSequence(redemptionTestHooks.insert, vaultTestHooks.insert);

    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await sendRedemptionRequest({
      offerId: redemption.offerId,
      companyName,
      offerName,
    });

    // Assert
    const body = await result.json();
    expect(body).toEqual({
      data: {
        kind: 'Ok',
        redemptionType: 'vault',
        redemptionDetails: {
          url: redemption.url,
          code: vaultCode.code,
        },
      },
      statusCode: 200,
    });
    expect(result.status).toBe(200);
  });

  test.skip('should redeem a eagleeye standard vault offer', async () => {
    // Arrange
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault');
    const { ...vaultTestHooks } = buildIntegrationVault(redemption.id, 'eagleeye', eagleEyeResourceId);

    onTestFinished(() => executeAsyncSequence(vaultTestHooks.cleanup, redemptionTestHooks.cleanup));
    await executeAsyncSequence(redemptionTestHooks.insert, vaultTestHooks.insert);

    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await sendRedemptionRequest({
      offerId: redemption.offerId,
      companyName,
      offerName,
    });

    expect(result.status).toBe(200);

    const body = await result.json();

    expect(body).toHaveProperty('data.kind', 'Ok');
    expect(body).toHaveProperty('data.redemptionType', 'vault');
    expect(body).toHaveProperty('data.redemptionDetails.url', redemption.url);
    expect(body).toHaveProperty('data.redemptionDetails.code'); //this will be a random value we cannot assess
  });

  test.skip('should redeem a uniqodo standard vault offer', async () => {
    // Arrange
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault');
    const { ...vaultTestHooks } = buildIntegrationVault(redemption.id, 'uniqodo', uniqodoPromotionId);

    onTestFinished(() => executeAsyncSequence(vaultTestHooks.cleanup, redemptionTestHooks.cleanup));
    await executeAsyncSequence(redemptionTestHooks.insert, vaultTestHooks.insert);

    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await sendRedemptionRequest({
      offerId: redemption.offerId,
      companyName,
      offerName,
    });

    expect(result.status).toBe(200);

    const body = await result.json();

    expect(body).toHaveProperty('data.kind', 'Ok');
    expect(body).toHaveProperty('data.redemptionType', 'vault');
    expect(body).toHaveProperty('data.redemptionDetails.url', redemption.url);
    expect(body).toHaveProperty('data.redemptionDetails.code'); //this will be a random value we cannot assess
  });

  test.each(['compare', 'giftCard', 'preApplied', 'verify'] as const)(
    'should redeem a %s Affiliate offer',
    async (redemptionType) => {
      // Arrange
      const { redemption, ...redemptionTestHooks } = buildTestRedemption(redemptionType);

      onTestFinished(redemptionTestHooks.cleanup);
      await redemptionTestHooks.insert();

      // Act
      const result = await sendRedemptionRequest({
        offerId: redemption.offerId,
        companyName: faker.company.name(),
        offerName: faker.commerce.productName(),
      });

      // Assert
      const body = await result.json();
      expect(body).toEqual({
        data: {
          kind: 'Ok',
          redemptionType: redemptionType,
          redemptionDetails: {
            url: redemption.url,
          },
        },
        statusCode: 200,
      });
      expect(result.status).toBe(200);
    },
  );

  test('should redeem a show card offer', async () => {
    // Arrange
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('showCard', { url: undefined });

    onTestFinished(redemptionTestHooks.cleanup);
    await redemptionTestHooks.insert();

    // Act
    const result = await sendRedemptionRequest({
      offerId: redemption.offerId,
      companyName: faker.company.name(),
      offerName: faker.commerce.productName(),
    });

    // Assert
    const body = await result.json();

    expect(body).toStrictEqual({
      data: {
        kind: 'Ok',
        redemptionType: 'showCard',
        redemptionDetails: {},
      },
      statusCode: 200,
    });
    expect(result.status).toBe(200);
  });

  test('fails to redeem using an invalid offer ID', async () => {
    // Act
    const result = await sendRedemptionRequest({
      offerId: '1337',
      companyName: faker.company.name(),
      offerName: faker.commerce.productName(),
    });

    // Assert
    const body = await result.json();
    expect(body).toStrictEqual({
      data: {
        kind: 'RedemptionNotFound',
        message: expect.any(String),
      },
      statusCode: 404,
    });
    expect(result.status).toBe(404);
  });

  test('processes headers case insensitively', { timeout: 60_000 }, async () => {
    const dwhTestHelper = new DwhTestHelper();
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('preApplied');

    onTestFinished(redemptionTestHooks.cleanup);
    await redemptionTestHooks.insert();

    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${testUserTokens.idToken}`,
        'x-client-type': 'mobile',
      },
      body: JSON.stringify({
        offerId: redemption.offerId,
        companyName: faker.company.name(),
        offerName: faker.commerce.productName(),
      }),
    });

    const body = await result.json();
    expect(result.status).toBe(200);
    expect(body).toEqual({
      data: {
        kind: 'Ok',
        redemptionType: redemption.redemptionType,
        redemptionDetails: {
          url: redemption.url,
        },
      },
      statusCode: 200,
    });

    expect(await dwhTestHelper.findCompAppClickRecordByOfferId(redemption.offerId)).toBeTruthy();
  });

  test(
    'should send data to the compClick and vault streams when a vault redemption is successful and the client type header is omitted',
    { timeout: 60_000 },
    async () => {
      // Arrange
      const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault');
      const { vaultCode, ...vaultTestHooks } = buildVault(redemption.id);

      onTestFinished(() => executeAsyncSequence(vaultTestHooks.cleanup, redemptionTestHooks.cleanup));
      await executeAsyncSequence(redemptionTestHooks.insert, vaultTestHooks.insert);

      const companyName = faker.company.name();
      const offerName = faker.commerce.productName();

      // Act
      const result = await sendRedemptionRequest({
        offerId: redemption.offerId,
        companyName: companyName,
        offerName: offerName,
      });

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper().findCompClickRecordByOfferId(redemption.offerId);
      expect(compClickRecord).toStrictEqual(
        expect.objectContaining({
          company_id: redemption.companyId.toString(),
          offer_id: redemption.offerId,
          member_id: testUserAccount['custom:blc_old_id'],
          type: 2, // Type of 2 corresponds to the web application
          origin: 'offer_sheet', // Currently this API is only used by the offer sheet
          timedate: expect.any(String),
        }),
      );

      const compVaultClickRecord = await new DwhTestHelper().findVaultRecordByOfferId(redemption.offerId);
      expect(compVaultClickRecord).toStrictEqual(
        expect.objectContaining({
          compid: redemption.companyId.toString(),
          code: vaultCode.code,
          offer_id: redemption.offerId.toString(),
          uid: testUserAccount['custom:blc_old_id'],
          whenrequested: expect.any(String),
        }),
      );
    },
  );

  test.each([
    ['web', 2, 'findCompClickRecordByOfferId' as const],
    ['mobile', 4, 'findCompAppClickRecordByOfferId' as const],
  ])(
    'should send data to the compClick and vault streams when a vault redemption is successful and the client type is %s',
    { timeout: 60_000 },
    async (
      source: string,
      sourceType: number,
      findBucketMethod: 'findCompClickRecordByOfferId' | 'findCompAppClickRecordByOfferId',
    ) => {
      // Arrange
      const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault');
      const { vaultCode, ...vaultTestHooks } = buildVault(redemption.id);

      onTestFinished(() => executeAsyncSequence(vaultTestHooks.cleanup, redemptionTestHooks.cleanup));
      await executeAsyncSequence(redemptionTestHooks.insert, vaultTestHooks.insert);

      const companyName = faker.company.name();
      const offerName = faker.commerce.productName();

      // Act
      const result = await sendRedemptionRequest(
        {
          offerId: redemption.offerId,
          companyName: companyName,
          offerName: offerName,
        },
        {
          'X-Client-Type': source,
        },
      );

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper()[findBucketMethod](redemption.offerId);
      expect(compClickRecord).toStrictEqual(
        expect.objectContaining({
          company_id: redemption.companyId.toString(),
          offer_id: redemption.offerId,
          member_id: testUserAccount['custom:blc_old_id'],
          type: sourceType,
          origin: 'offer_sheet', // Currently this API is only used by the offer sheet
          timedate: expect.any(String),
        }),
      );

      const compVaultClickRecord = await new DwhTestHelper().findVaultRecordByOfferId(redemption.offerId);
      expect(compVaultClickRecord).toStrictEqual(
        expect.objectContaining({
          compid: redemption.companyId.toString(),
          code: vaultCode.code,
          offer_id: redemption.offerId.toString(),
          uid: testUserAccount['custom:blc_old_id'],
          whenrequested: expect.any(String),
        }),
      );
    },
  );

  test('fails to redeem if configured without a URL', async () => {
    // Arrange
    const { redemption, ...redemptionTestHooks } = buildTestRedemption('vault', { url: '' });
    const vaultConstruct = buildVault(redemption.id);

    onTestFinished(() => executeAsyncSequence(vaultConstruct.cleanup, redemptionTestHooks.cleanup));
    await executeAsyncSequence(redemptionTestHooks.insert, vaultConstruct.insert);

    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();

    // Act
    const result = await sendRedemptionRequest({
      offerId: redemption.offerId,
      companyName: companyName,
      offerName: offerName,
    });

    // Assert
    const body = await result.json();
    const expectedBody = {
      data: {
        kind: 'RedemptionConfigError',
        message: 'Invalid redemption for redemption type "vault" (missing url)',
      },
      statusCode: 409,
    };
    expect(body).toStrictEqual(expect.objectContaining(expectedBody));
    expect(result.status).toBe(409);
  });

  // removed test until identity api is ready
  // test('should return bad request when called with token with invalid card status', async () => {
  //   // Arrange
  //   const testUser = await TestUser.create({
  //     cardStatus: 'DECLINED',
  //   });
  //   onTestFinished(async () => {
  //     await testUser.delete();
  //   });
  //   const testUserTokens = await testUser.authenticate();
  //   const redemption = redemptionFactory.build({
  //     id: createRedemptionsIdE2E(),
  //     redemptionType: 'preApplied',
  //     connection: 'direct',
  //     url: faker.internet.url(),
  //   });
  //   const companyName = faker.company.name();
  //   const offerName = faker.commerce.productName();
  //   onTestFinished(async () => {
  //     await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
  //   });
  //   await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
  //
  //   // Act
  //   const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
  //     method: 'POST',
  //     headers: {
  //       'X-Client-Type': 'mobile',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${testUserTokens.idToken}`,
  //     },
  //     body: JSON.stringify({
  //       offerId: redemption.offerId,
  //       companyName,
  //       offerName,
  //     }),
  //   });
  //   const body = await result.json();
  //
  //   // Assert
  //   expect(body).toMatchObject({
  //     error: {
  //       message: 'Ineligible card status',
  //     },
  //   });
  //   expect(result.status).toBe(400);
  // });
});
