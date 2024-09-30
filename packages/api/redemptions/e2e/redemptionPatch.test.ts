import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { eq } from 'drizzle-orm';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, it, onTestFinished } from 'vitest';

import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsIdE2E, redemptionsTable, RedemptionType } from '../libs/database/schema';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

describe('PATCH /redemptions/:offerId', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;
  const redemptionsId: string = createRedemptionsIdE2E();

  const buildRedemptionForPostMethod = (offerId: number) => {
    const redemption = redemptionConfigEntityFactory.build({
      id: redemptionsId,
      companyId: parseInt(faker.string.numeric(8)),
      offerId: offerId,
      offerType: 'online',
      redemptionType: 'preApplied' as RedemptionType,
      connection: 'affiliate',
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

  async function callRedemptionEndpoint(
    method: string,
    key?: string,
    body?: object,
    queryStringParam?: string,
  ): Promise<Response> {
    const params = queryStringParam ? `redemptions/${queryStringParam}` : 'redemptions';

    if (!key) {
      return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}${params}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      const payload = body
        ? {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': key,
            },
            body: JSON.stringify(body),
          }
        : {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': key,
            },
          };

      return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}${params}`, payload);
    }
  }

  it('should update the redemption configuration', async () => {
    const offerId = faker.string.numeric(8);

    const { ...RedemptionHooks } = await buildRedemptionForPostMethod(Number(offerId));
    const updatedConfig = {
      redemptionType: 'preApplied',
      id: RedemptionHooks.redemption.id,
      connection: RedemptionHooks.redemption.connection,
      companyId: RedemptionHooks.redemption.companyId,
      affiliate: RedemptionHooks.redemption.affiliate,
      url: RedemptionHooks.redemption.url,
    };
    const expectedResponseBody = {
      statusCode: 200,
      data: {
        ...updatedConfig,
        companyId: String(RedemptionHooks.redemption.companyId),
        offerId: String(RedemptionHooks.redemption.offerId),
      },
    };
    onTestFinished(RedemptionHooks.cleanup);
    await RedemptionHooks.insert();

    // Make a request to update the redemption configuration
    const response = await callRedemptionEndpoint('PATCH', apiKey, updatedConfig, offerId);
    // Assert that the response status is 200
    expect(response.status).toBe(200);

    const responseBody = await response.json();

    // Assert that the response body contains the updated configuration
    expect(responseBody).toEqual(expectedResponseBody);
  });
});
