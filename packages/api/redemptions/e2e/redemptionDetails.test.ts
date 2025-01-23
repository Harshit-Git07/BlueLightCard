import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { jwtDecode } from 'jwt-decode';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, onTestFinished, test } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsIdE2E, redemptionsTable } from '../libs/database/schema';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { TestAccount, TestUser, TestUserTokens } from '../libs/test/helpers/identity';

import { E2EDatabaseConnectionManager } from './helpers/database';
import { DwhTestHelper } from './helpers/DwhTestHelper';

describe('GET /member/redemptionDetails', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let testUserTokens: TestUserTokens;
  let testUserAccount: TestAccount;

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
    testUserTokens = await TestUser.authenticate();
    testUserAccount = jwtDecode(testUserTokens.idToken);

    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await connectionManager?.cleanup();
  });

  test('should return unauthorized when called with invalid token', async () => {
    // Arrange
    const offerId = faker.string.alphanumeric(10);

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
    const offerId = faker.string.alphanumeric(10);

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
    const redemption = redemptionConfigEntityFactory.build({
      id: createRedemptionsIdE2E(),
      offerId: faker.string.uuid(),
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
      const redemption = redemptionConfigEntityFactory.build({
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
      expect(compClickRecord.mid).toBe(testUserAccount['custom:blc_old_id']);
      expect(compClickRecord.timedate).toBeDefined();
      expect(compClickRecord.type).toBe(1); // Type of 1 corresponds to the web application
      expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
    },
  );

  test('should send data to the compView stream when client type is web', { timeout: 60_000 }, async () => {
    // Arrange
    const redemption = redemptionConfigEntityFactory.build({
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
    expect(compClickRecord.mid).toBe(testUserAccount['custom:blc_old_id']);
    expect(compClickRecord.timedate).toBeDefined();
    expect(compClickRecord.type).toBe(1); // Type of 1 corresponds to the web application
    expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
  });

  test('should send data to the compAppView stream when client type is mobile', { timeout: 60_000 }, async () => {
    // Arrange
    const redemption = redemptionConfigEntityFactory.build({
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
    expect(compClickRecord.mid).toBe(testUserAccount['custom:blc_old_id']);
    expect(compClickRecord.timedate).toBeDefined();
    expect(compClickRecord.type).toBe(5); // Type of 5 corresponds to the mobile application
    expect(compClickRecord.origin).toBe('offer_sheet'); // Currently this API is only used by the offer sheet
  });
});
