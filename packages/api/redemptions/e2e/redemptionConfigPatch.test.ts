import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { GenericsRepository } from '../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../application/repositories/RedemptionConfigCombinedRepository';
import { RedemptionConfigRepository } from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '../application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../libs/database/connection';
import { createRedemptionsIdE2E, RedemptionType } from '../libs/database/schema';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

let vaultsRepository: VaultsRepository;
let vaultBatchesRepository: VaultBatchesRepository;
let genericsRepository: GenericsRepository;
let redemptionConfigRepository: RedemptionConfigRepository;
let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

const redemptionsId: string = createRedemptionsIdE2E();

describe('PATCH /redemptions/:offerId', () => {
  beforeAll(async () => {
    // eslint-disable-next-line no-console
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);

    vaultsRepository = new VaultsRepository(connectionManager.connection);
    vaultBatchesRepository = new VaultBatchesRepository(connectionManager.connection);
    genericsRepository = new GenericsRepository(connectionManager.connection);
    redemptionConfigRepository = new RedemptionConfigRepository(connectionManager.connection);
    redemptionRepositoryHelper = new RedemptionConfigCombinedRepository(
      redemptionConfigRepository,
      vaultsRepository,
      vaultBatchesRepository,
      genericsRepository,
    );

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

    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds([1]);

    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds([1]);
    await connectionManager?.cleanup();
  });

  it('should update the redemption configuration', async () => {
    const offerId = 1;

    const redemption = redemptionConfigEntityFactory.build({
      id: redemptionsId,
      companyId: parseInt(faker.string.numeric(8)),
      offerId: offerId,
      offerType: 'online',
      redemptionType: 'preApplied' as RedemptionType,
      connection: 'affiliate',
      url: faker.internet.url(),
    });

    const updatedConfig = {
      redemptionType: 'preApplied',
      id: redemption.id,
      connection: 'direct' as RedemptionType,
      companyId: 12345,
      affiliate: redemption.affiliate,
      url: 'some new url',
    };

    redemptionConfigRepository.createRedemption(redemption);

    // Make a request to update the redemption configuration
    const response = await callRedemptionEndpoint('PATCH', apiKey, updatedConfig, String(offerId));

    // Assert that the response status is 200
    expect(response.status).toBe(200);

    // Assert that the response body contains the updated configuration
    const expectedResponseBody = {
      statusCode: 200,
      data: {
        redemptionType: updatedConfig.redemptionType,
        id: updatedConfig.id,
        connection: updatedConfig.connection,
        companyId: String(updatedConfig.companyId),
        affiliate: updatedConfig.affiliate,
        url: updatedConfig.url,
        offerId: String(redemption.offerId),
      },
    };

    const responseBody = await response.json();
    expect(responseBody).toEqual(expectedResponseBody);
  });
});

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
