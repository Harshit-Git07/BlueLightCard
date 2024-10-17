import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { E2EDatabaseConnectionManager } from '@blc-mono/redemptions/e2e/helpers/database';
import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';

import { GenericsRepository } from '../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../application/repositories/RedemptionConfigCombinedRepository';
import { RedemptionConfigRepository } from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '../application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '../application/repositories/VaultsRepository';

describe('POST /redemptions/', () => {
  let connectionManager: E2EDatabaseConnectionManager;
  let apiKey: string;

  let vaultsRepository: VaultsRepository;
  let vaultBatchesRepository: VaultBatchesRepository;
  let genericsRepository: GenericsRepository;
  let redemptionConfigRepository: RedemptionConfigRepository;
  let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

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

    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds(['101', '102', '103', '104', '105']);

    // Set a conservative timeout
  }, 60_000);

  afterAll(async () => {
    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds(['101', '102', '103', '104', '105']);
    await connectionManager?.cleanup();
  });

  describe('redemption config admin API tests: POST', () => {
    it('POST /redemptions returns 200 for showCard redemptionType', async () => {
      const redemptionConfigRequest = {
        companyId: faker.number.int({ max: 216380 }),
        offerId: 101,
        redemptionType: 'showCard',
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          companyId: String(redemptionConfigRequest.companyId),
          id: expect.any(String),
          offerId: String(redemptionConfigRequest.offerId),
          redemptionType: redemptionConfigRequest.redemptionType,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('POST /redemptions returns 200 for preApplied redemptionType', async () => {
      const redemptionConfigRequest = {
        affiliate: null,
        companyId: faker.number.int({ max: 216380 }),
        connection: 'direct',
        offerId: 102,
        redemptionType: 'preApplied',
        url: 'https://www.whatever.com/',
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          affiliate: null,
          companyId: String(redemptionConfigRequest.companyId),
          connection: redemptionConfigRequest.connection,
          offerId: String(redemptionConfigRequest.offerId),
          id: expect.any(String),
          redemptionType: redemptionConfigRequest.redemptionType,
          url: redemptionConfigRequest.url,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('POST /redemptions returns 200 for generic redemptionType', async () => {
      const redemptionConfigRequest = {
        affiliate: null,
        companyId: faker.number.int({ max: 216380 }),
        connection: 'direct',
        offerId: 103,
        redemptionType: 'generic',
        url: 'https://www.whatever.com/',
        generic: {
          code: faker.string.alphanumeric(),
        },
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          affiliate: null,
          companyId: String(redemptionConfigRequest.companyId),
          connection: redemptionConfigRequest.connection,
          offerId: String(redemptionConfigRequest.offerId),
          id: expect.any(String),
          redemptionType: redemptionConfigRequest.redemptionType,
          url: redemptionConfigRequest.url,
          generic: {
            code: redemptionConfigRequest.generic.code,
            id: expect.any(String),
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it.each([
      ['vault', 104],
      ['vaultQR', 105],
    ])('POST /redemptions returns 200 for %s redemptionType', async (redemptionType, offerId) => {
      const redemptionConfigRequest = {
        affiliate: null,
        companyId: faker.number.int({ max: 216380 }),
        connection: 'direct',
        offerId: offerId,
        redemptionType: redemptionType,
        ...(redemptionType === 'vault' && { url: faker.internet.url() }),
        vault: {
          alertBelow: faker.number.int({ max: 216380 }),
          status: faker.helpers.arrayElement(['active', 'in-active']),
          maxPerUser: faker.number.int({ max: 216380 }),
          email: faker.internet.email(),
          integration: faker.helpers.arrayElement(['eagleeye', 'uniqodo']),
          integrationId: faker.number.int({ max: 216380 }),
          batches: [],
        },
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          affiliate: null,
          companyId: String(redemptionConfigRequest.companyId),
          connection: redemptionConfigRequest.connection,
          offerId: String(redemptionConfigRequest.offerId),
          id: expect.any(String),
          redemptionType: redemptionConfigRequest.redemptionType,
          ...(redemptionType === 'vault' && { url: redemptionConfigRequest.url }),
          vault: {
            alertBelow: redemptionConfigRequest.vault.alertBelow,
            status: redemptionConfigRequest.vault.status,
            maxPerUser: redemptionConfigRequest.vault.maxPerUser,
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
            email: redemptionConfigRequest.vault.email,
            integration: redemptionConfigRequest.vault.integration,
            integrationId: String(redemptionConfigRequest.vault.integrationId),
            id: expect.any(String),
            batches: [],
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('POST /redemptions returns 409 when a redemptionConfig with given offerId already exists', async () => {
      const redemptionConfigRequest = {
        companyId: faker.number.int({ max: 216380 }),
        offerId: 101,
        redemptionType: 'showCard',
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(409);
    });

    it('POST /redemptions returns 400 when a redemptionConfig has not been created due to a schema validation error', async () => {
      const redemptionConfigRequest = {
        affiliate: null,
        companyId: faker.number.int({ max: 216380 }),
        connection: 'direct',
        offerId: 103,
        redemptionType: 'generic',
        url: 'https://www.whatever.com/',
        generic: {},
      };

      const result = await callPOSTRedemptionConfigEndpoint(redemptionConfigRequest);

      expect(result.status).toBe(400);
    });
  });

  async function callPOSTRedemptionConfigEndpoint(body: object): Promise<Response> {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(body),
    };
    return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/redemptions`, payload);
  }
});
