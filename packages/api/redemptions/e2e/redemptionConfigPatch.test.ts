import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  UpdateGenericRedemptionSchema,
  UpdatePreAppliedRedemptionSchema,
  UpdateShowCardRedemptionSchema,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';

import { GenericEntity, GenericsRepository } from '../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../application/repositories/RedemptionConfigCombinedRepository';
import {
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '../application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../libs/database/connection';
import { createGenericsIdE2E, createRedemptionsIdE2E, RedemptionType } from '../libs/database/schema';
import { genericEntityFactory } from '../libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

let vaultsRepository: VaultsRepository;
let vaultBatchesRepository: VaultBatchesRepository;
let genericsRepository: GenericsRepository;
let redemptionConfigRepository: RedemptionConfigRepository;
let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

const offerId = 1;

describe('PATCH /redemptions/{offerId}', () => {
  const testGenericBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'generic' as RedemptionType,
    connection: 'affiliate',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    generic: {
      id: createGenericsIdE2E(),
      code: 'DISCOUNT_CODE_01',
    },
  } satisfies UpdateGenericRedemptionSchema;

  const redemptionConfigEntityForGeneric: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
    id: testGenericBody.id,
    companyId: testGenericBody.companyId,
    offerId: testGenericBody.offerId,
    redemptionType: 'generic',
    connection: 'direct',
    url: faker.internet.url(),
    affiliate: null,
    offerType: 'online',
  });

  const testPreAppliedBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'preApplied' as RedemptionType,
    connection: 'direct',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
    url: 'https://www.whatever.com/',
  } satisfies UpdatePreAppliedRedemptionSchema;

  const redemptionConfigEntityForPreApplied: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
    id: testPreAppliedBody.id,
    companyId: testPreAppliedBody.companyId,
    offerId: testPreAppliedBody.offerId,
    redemptionType: 'preApplied',
    connection: 'affiliate',
    url: faker.internet.url(),
    affiliate: 'awin',
    offerType: 'online',
  });

  const testShowCardBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'showCard' as RedemptionType,
    connection: 'none',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: null,
  } satisfies UpdateShowCardRedemptionSchema;

  const redemptionConfigEntityForShowCard: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
    id: testShowCardBody.id,
    companyId: testShowCardBody.companyId,
    offerId: testShowCardBody.offerId,
    redemptionType: 'showCard',
    connection: 'none',
    url: null,
    affiliate: null,
    offerType: 'in-store',
  });

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

    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds([offerId]);

    // Set a conservative timeout
  }, 60_000);

  afterEach(async () => {
    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds([offerId]);
  });

  afterAll(async () => {
    await redemptionRepositoryHelper.deleteRedemptionsFromDatabaseByOfferIds([offerId]);
    await connectionManager?.cleanup();
  });

  it('should return 404 if redemptions record can not be found', async () => {
    const result = await callPatchRedemptionConfigEndpoint(testGenericBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - redemptionId does not exist: ${testGenericBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('should return 200 and correct redemptionConfig for preApplied redemptionType on update success', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForPreApplied);

    const result = await callPatchRedemptionConfigEndpoint(testPreAppliedBody);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testPreAppliedBody.id,
        offerId: String(testPreAppliedBody.offerId),
        redemptionType: testPreAppliedBody.redemptionType,
        connection: testPreAppliedBody.connection,
        companyId: String(testPreAppliedBody.companyId),
        affiliate: testPreAppliedBody.affiliate,
        url: testPreAppliedBody.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('should return 200 and correct redemptionConfig for showCard redemptionType on update success', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForShowCard);

    const result = await callPatchRedemptionConfigEndpoint(testShowCardBody);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testShowCardBody.id,
        offerId: String(testShowCardBody.offerId),
        redemptionType: testShowCardBody.redemptionType,
        companyId: String(testShowCardBody.companyId),
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('should return 404 for generic redemptionType if generics record can not be found', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForGeneric);

    const result = await callPatchRedemptionConfigEndpoint(testGenericBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - generic record does not exist with corresponding id's: ${testGenericBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('should return 200 and correct redemptionConfig for generic redemptionType on update success', async () => {
    const genericEntity: GenericEntity = genericEntityFactory.build({
      id: testGenericBody.generic.id,
      code: faker.string.alphanumeric({ length: 8 }),
      redemptionId: testGenericBody.id,
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForGeneric);
    await genericsRepository.createGeneric(genericEntity);

    const result = await callPatchRedemptionConfigEndpoint(testGenericBody);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testGenericBody.id,
        offerId: String(testGenericBody.offerId),
        redemptionType: testGenericBody.redemptionType,
        connection: testGenericBody.connection,
        companyId: String(testGenericBody.companyId),
        affiliate: testGenericBody.affiliate,
        url: testGenericBody.url,
        generic: {
          id: testGenericBody.generic.id,
          code: testGenericBody.generic.code,
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);

    await genericsRepository.deleteById(genericEntity.id);
  });
});

async function callPatchRedemptionConfigEndpoint(body: object): Promise<Response> {
  const payload = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  };
  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/redemptions/${offerId}`, payload);
}
