import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, onTestFinished, test } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import {
  createRedemptionsIdE2E,
  createVaultBatchesIdE2E,
  createVaultCodesIdE2E,
  createVaultIdE2E,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '../libs/database/schema';
import { redemptionFactory } from '../libs/test/factories/redemption.factory';
import { vaultFactory } from '../libs/test/factories/vault.factory';
import { vaultBatchFactory } from '../libs/test/factories/vaultBatches.factory';
import { vaultCodeFactory } from '../libs/test/factories/vaultCode.factory';
import { TestUser, TestUserTokens } from '../libs/test/helpers/identity';

import { E2EDatabaseConnectionManager } from './helpers/database';
import { DwhTestHelper } from './helpers/DwhTestHelper';

describe('POST /member/redeem', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let testUser: TestUser;
  let testUserTokens: TestUserTokens;

  beforeAll(async () => {
    // eslint-disable-next-line no-console
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
    testUser = await TestUser.create();
    testUserTokens = await testUser.authenticate();
    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await connectionManager?.cleanup();
    await testUser?.delete();
  });

  test('should return unauthorized when called with invalid token', async () => {
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
        Authorization: 'Bearer token',
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

  test('should redeem a standard vault offer', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      id: createRedemptionsIdE2E(),
      redemptionType: 'vault',
      connection: 'direct',
      url: faker.internet.url(),
    });
    const vault = vaultFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemption.id,
      status: 'active',
      vaultType: 'standard',
    });
    const vaultBatch = vaultBatchFactory.build({
      id: createVaultBatchesIdE2E(),
      vaultId: vault.id,
    });
    const vaultCode = vaultCodeFactory.build({
      id: createVaultCodesIdE2E(),
      batchId: vaultBatch.id,
      expiry: faker.date.future({ years: 1 }),
      vaultId: vault.id,
      memberId: null,
    });
    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();
    onTestFinished(async () => {
      await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
      await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
      await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
      await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
    });
    await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
    await connectionManager.connection.db.insert(vaultsTable).values(vault);
    await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
    await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);

    // Act
    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserTokens.idToken}`,
      },
      body: JSON.stringify({
        offerId: redemption.offerId,
        companyName,
        offerName,
      }),
    });

    // Assert
    const body = await result.json();
    expect(body).toEqual({
      data: {
        redemptionType: redemption.redemptionType,
        redemptionDetails: {
          url: redemption.url,
          code: vaultCode.code,
        },
      },
      statusCode: 200,
    });
    expect(result.status).toBe(200);
  });

  test('should redeem a standard vault offer', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      id: createRedemptionsIdE2E(),
      redemptionType: 'vault',
      connection: 'direct',
      url: faker.internet.url(),
    });
    const vault = vaultFactory.build({
      id: createVaultIdE2E(),
      redemptionId: redemption.id,
      status: 'active',
      vaultType: 'standard',
    });
    const vaultBatch = vaultBatchFactory.build({
      id: createVaultBatchesIdE2E(),
      vaultId: vault.id,
    });
    const vaultCode = vaultCodeFactory.build({
      id: createVaultCodesIdE2E(),
      batchId: vaultBatch.id,
      expiry: faker.date.future({ years: 1 }),
      vaultId: vault.id,
      memberId: null,
    });
    const companyName = faker.company.name();
    const offerName = faker.commerce.productName();
    onTestFinished(async () => {
      await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
      await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
      await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
      await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
    });
    await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
    await connectionManager.connection.db.insert(vaultsTable).values(vault);
    await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
    await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);

    // Act
    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${testUserTokens.idToken}`,
      },
      body: JSON.stringify({
        offerId: redemption.offerId,
        companyName,
        offerName,
      }),
    });

    // Assert
    const body = await result.json();
    expect(body).toEqual({
      data: {
        redemptionType: redemption.redemptionType,
        redemptionDetails: {
          url: redemption.url,
          code: vaultCode.code,
        },
      },
      statusCode: 200,
    });
    expect(result.status).toBe(200);
  });

  test(
    'should send data to the compClick and vault streams when a vault redemption is successful and the client type header is omitted',
    { timeout: 60_000 },
    async () => {
      // Arrange
      const redemption = redemptionFactory.build({
        id: createRedemptionsIdE2E(),
        redemptionType: 'vault',
        connection: 'direct',
        url: faker.internet.url(),
      });
      const vault = vaultFactory.build({
        id: createVaultIdE2E(),
        redemptionId: redemption.id,
        status: 'active',
        vaultType: 'standard',
      });
      const vaultBatch = vaultBatchFactory.build({
        id: createVaultBatchesIdE2E(),
        vaultId: vault.id,
      });
      const vaultCode = vaultCodeFactory.build({
        id: createVaultCodesIdE2E(),
        batchId: vaultBatch.id,
        expiry: faker.date.future({ years: 1 }),
        vaultId: vault.id,
        memberId: null,
      });
      const companyName = faker.company.name();
      const offerName = faker.commerce.productName();
      onTestFinished(async () => {
        await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      });
      await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      await connectionManager.connection.db.insert(vaultsTable).values(vault);
      await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
      await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);

      // Act
      const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
        body: JSON.stringify({
          offerId: redemption.offerId,
          companyName,
          offerName,
        }),
      });

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper().findCompClickRecordByOfferId(redemption.offerId);
      expect(compClickRecord.company_id).toBe(redemption.companyId.toString());
      expect(compClickRecord.offer_id).toBe(redemption.offerId);
      expect(compClickRecord.member_id).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compClickRecord.timedate).toBeDefined();
      expect(compClickRecord.type).toBe(2); // Type of 2 corresponds to the web application
      expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet

      const compVaultClickRecord = await new DwhTestHelper().findVaultRecordByOfferId(redemption.offerId);
      expect(compVaultClickRecord.compid).toBe(redemption.companyId.toString());
      expect(compVaultClickRecord.code).toBe(vaultCode.code);
      expect(compVaultClickRecord.offer_id).toBe(redemption.offerId.toString());
      expect(compVaultClickRecord.uid).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compVaultClickRecord.whenrequested).toBeDefined();
    },
  );

  test(
    'should send data to the compClick and vault streams when a vault redemption is successful and the client type is web',
    { timeout: 60_000 },
    async () => {
      // Arrange
      const redemption = redemptionFactory.build({
        id: createRedemptionsIdE2E(),
        redemptionType: 'vault',
        connection: 'direct',
        url: faker.internet.url(),
      });
      const vault = vaultFactory.build({
        id: createVaultIdE2E(),
        redemptionId: redemption.id,
        status: 'active',
        vaultType: 'standard',
      });
      const vaultBatch = vaultBatchFactory.build({
        id: createVaultBatchesIdE2E(),
        vaultId: vault.id,
      });
      const vaultCode = vaultCodeFactory.build({
        id: createVaultCodesIdE2E(),
        batchId: vaultBatch.id,
        expiry: faker.date.future({ years: 1 }),
        vaultId: vault.id,
        memberId: null,
      });
      const companyName = faker.company.name();
      const offerName = faker.commerce.productName();
      onTestFinished(async () => {
        await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      });
      await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      await connectionManager.connection.db.insert(vaultsTable).values(vault);
      await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
      await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);

      // Act
      const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
        method: 'POST',
        headers: {
          'X-Client-Type': 'web',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
        body: JSON.stringify({
          offerId: redemption.offerId,
          companyName,
          offerName,
        }),
      });

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper().findCompClickRecordByOfferId(redemption.offerId);
      expect(compClickRecord.company_id).toBe(redemption.companyId.toString());
      expect(compClickRecord.offer_id).toBe(redemption.offerId);
      expect(compClickRecord.member_id).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compClickRecord.timedate).toBeDefined();
      expect(compClickRecord.type).toBe(2); // Type of 2 corresponds to the web application
      expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet

      const compVaultClickRecord = await new DwhTestHelper().findVaultRecordByOfferId(redemption.offerId);
      expect(compVaultClickRecord.compid).toBe(redemption.companyId.toString());
      expect(compVaultClickRecord.code).toBe(vaultCode.code);
      expect(compVaultClickRecord.offer_id).toBe(redemption.offerId.toString());
      expect(compVaultClickRecord.uid).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compVaultClickRecord.whenrequested).toBeDefined();
    },
  );

  test(
    'should send data to the compAppClick and vault streams when a vault redemption is successful and the client type is mobile',
    { timeout: 60_000 },
    async () => {
      // Arrange
      const redemption = redemptionFactory.build({
        id: createRedemptionsIdE2E(),
        redemptionType: 'vault',
        connection: 'direct',
        url: faker.internet.url(),
      });
      const vault = vaultFactory.build({
        id: createVaultIdE2E(),
        redemptionId: redemption.id,
        status: 'active',
        vaultType: 'standard',
      });
      const vaultBatch = vaultBatchFactory.build({
        id: createVaultBatchesIdE2E(),
        vaultId: vault.id,
      });
      const vaultCode = vaultCodeFactory.build({
        id: createVaultCodesIdE2E(),
        batchId: vaultBatch.id,
        expiry: faker.date.future({ years: 1 }),
        vaultId: vault.id,
        memberId: null,
      });
      const companyName = faker.company.name();
      const offerName = faker.commerce.productName();
      onTestFinished(async () => {
        await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.id, vaultCode.id));
        await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
        await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      });
      await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      await connectionManager.connection.db.insert(vaultsTable).values(vault);
      await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
      await connectionManager.connection.db.insert(vaultCodesTable).values(vaultCode);

      // Act
      const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redeem`, {
        method: 'POST',
        headers: {
          'X-Client-Type': 'mobile',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
        body: JSON.stringify({
          offerId: redemption.offerId,
          companyName,
          offerName,
        }),
      });

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper().findCompAppClickRecordByOfferId(redemption.offerId);
      expect(compClickRecord.company_id).toBe(redemption.companyId.toString());
      expect(compClickRecord.offer_id).toBe(redemption.offerId);
      expect(compClickRecord.member_id).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compClickRecord.timedate).toBeDefined();
      expect(compClickRecord.type).toBe(4); // Type of 4 corresponds to the mobile application
      expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet

      const compVaultClickRecord = await new DwhTestHelper().findVaultRecordByOfferId(redemption.offerId);
      expect(compVaultClickRecord.compid).toBe(redemption.companyId.toString());
      expect(compVaultClickRecord.code).toBe(vaultCode.code);
      expect(compVaultClickRecord.offer_id).toBe(redemption.offerId.toString());
      expect(compVaultClickRecord.uid).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compVaultClickRecord.whenrequested).toBeDefined();
    },
  );
});
