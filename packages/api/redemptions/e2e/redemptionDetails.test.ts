import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, onTestFinished, test } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsIdE2E, redemptionsTable } from '../libs/database/schema';
import { redemptionFactory } from '../libs/test/factories/redemption.factory';
import { TestUser, TestUserTokens } from '../libs/test/helpers/identity';

import { E2EDatabaseConnectionManager } from './helpers/database';
import { DwhTestHelper } from './helpers/DwhTestHelper';

describe('GET /member/redemptionDetails', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let testUser: TestUser;
  let testUserTokens: TestUserTokens;

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
    // TODO: Prevent emails being sent out
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

    // Act
    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${offerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
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

    // Act
    const result = await fetch(`${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${offerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await result.json();

    // Assert
    expect(result.status).toBe(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  test('should return the redemption details', async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      id: createRedemptionsIdE2E(),
    });
    await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
    onTestFinished(async () => {
      await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
    });

    // Act
    const result = await fetch(
      `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${redemption.offerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      },
    );

    // Assert
    const body = await result.json();
    expect(body).toEqual({
      data: {
        redemptionType: redemption.redemptionType,
      },
      statusCode: 200,
    });
    expect(result.status).toBe(200);
  });

  test(
    'should send data to the compView stream when the client type header is omitted',
    { timeout: 60_000 },
    async () => {
      // Arrange
      const redemption = redemptionFactory.build({
        id: createRedemptionsIdE2E(),
      });
      await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
      onTestFinished(async () => {
        await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
      });

      // Act
      const result = await fetch(
        `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${redemption.offerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${testUserTokens.idToken}`,
          },
        },
      );

      // Assert
      expect(result.status).toBe(200);

      const compClickRecord = await new DwhTestHelper().findCompViewRecordByOfferId(redemption.offerId);
      expect(compClickRecord.cid).toBe(redemption.companyId.toString());
      expect(compClickRecord.oid_).toBe(redemption.offerId);
      expect(compClickRecord.mid).toBe(testUser.userDetail.attributes.blcOldId.toString());
      expect(compClickRecord.timedate).toBeDefined();
      expect(compClickRecord.type).toBe(1); // Type of 1 corresponds to the web application
      expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
    },
  );

  test('should send data to the compView stream when client type is web', { timeout: 60_000 }, async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      id: createRedemptionsIdE2E(),
    });
    await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
    onTestFinished(async () => {
      await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
    });

    // Act
    const result = await fetch(
      `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${redemption.offerId}`,
      {
        method: 'GET',
        headers: {
          'X-Client-Type': 'web',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      },
    );

    // Assert
    expect(result.status).toBe(200);

    const compClickRecord = await new DwhTestHelper().findCompViewRecordByOfferId(redemption.offerId);
    expect(compClickRecord.cid).toBe(redemption.companyId.toString());
    expect(compClickRecord.oid_).toBe(redemption.offerId);
    expect(compClickRecord.mid).toBe(testUser.userDetail.attributes.blcOldId.toString());
    expect(compClickRecord.timedate).toBeDefined();
    expect(compClickRecord.type).toBe(1); // Type of 1 corresponds to the web application
    expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
  });

  test('should send data to the compAppView stream when client type is mobile', { timeout: 60_000 }, async () => {
    // Arrange
    const redemption = redemptionFactory.build({
      id: createRedemptionsIdE2E(),
    });
    await connectionManager.connection.db.insert(redemptionsTable).values(redemption);
    onTestFinished(async () => {
      await connectionManager.connection.db.delete(redemptionsTable).where(eq(redemptionsTable.id, redemption.id));
    });

    // Act
    const result = await fetch(
      `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${redemption.offerId}`,
      {
        method: 'GET',
        headers: {
          'X-Client-Type': 'mobile',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testUserTokens.idToken}`,
        },
      },
    );

    // Assert
    expect(result.status).toBe(200);

    const compClickRecord = await new DwhTestHelper().findCompAppViewRecordByOfferId(redemption.offerId);
    expect(compClickRecord.cid).toBe(redemption.companyId.toString());
    expect(compClickRecord.oid_).toBe(redemption.offerId);
    expect(compClickRecord.mid).toBe(testUser.userDetail.attributes.blcOldId.toString());
    expect(compClickRecord.timedate).toBeDefined();
    expect(compClickRecord.type).toBe(5); // Type of 5 corresponds to the mobile application
    expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
  });
});
