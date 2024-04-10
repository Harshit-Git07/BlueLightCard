import { eq } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsId, createRedemptionsIdE2E, redemptionsTable } from '../libs/database/schema';
import { redemptionFactory } from '../libs/test/factories/redemption.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';
import { TestUser, TestUserTokens } from './helpers/identity';
import { useAsyncDispose } from './helpers/useAsyncDispose';

describe('GET /member/redemptionDetails', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let testUser: TestUser;
  let testUserTokens: TestUserTokens;

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);
    testUser = await TestUser.setup();
    testUserTokens = await testUser.authenticate();
    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await connectionManager?.cleanup();
    await testUser?.cleanup();
  });

  test('should return unauthorized when called with invalid token', async () => {
    // Act
    const result = await fetch(
      `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${createRedemptionsId()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      },
    );
    const body = await result.json();

    // Assert
    expect(result.status).toBe(401);
    expect(body).toEqual({
      message: 'Unauthorized',
    });
  });

  test('should return unauthorized when called without a token', async () => {
    // Act
    const result = await fetch(
      `${ApiGatewayV1Api.redemptions.url}member/redemptionDetails?offerId=${createRedemptionsId()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
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
    await using _ = useAsyncDispose(async () => {
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
});
