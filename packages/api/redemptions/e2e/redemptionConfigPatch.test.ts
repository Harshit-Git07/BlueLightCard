import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  UpdateGenericRedemptionSchema,
  UpdatePreAppliedRedemptionSchema,
  UpdateShowCardRedemptionSchema,
  UpdateVaultRedemptionSchema,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';

import { GenericEntity, GenericsRepository } from '../application/repositories/GenericsRepository';
import { RedemptionConfigCombinedRepository } from '../application/repositories/RedemptionConfigCombinedRepository';
import {
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../application/repositories/RedemptionConfigRepository';
import { VaultBatchEntity, VaultBatchesRepository } from '../application/repositories/VaultBatchesRepository';
import { VaultEntity, VaultsRepository } from '../application/repositories/VaultsRepository';
import { DatabaseConnectionType } from '../libs/database/connection';
import {
  createGenericsIdE2E,
  createRedemptionsIdE2E,
  createVaultBatchesIdE2E,
  createVaultIdE2E,
  RedemptionType,
} from '../libs/database/schema';
import { genericEntityFactory } from '../libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '../libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '../libs/test/factories/vaultBatchEntity.factory';
import { vaultEntityFactory } from '../libs/test/factories/vaultEntity.factory';

import { E2EDatabaseConnectionManager } from './helpers/database';

let connectionManager: E2EDatabaseConnectionManager;
let apiKey: string;

let vaultsRepository: VaultsRepository;
let vaultBatchesRepository: VaultBatchesRepository;
let genericsRepository: GenericsRepository;
let redemptionConfigRepository: RedemptionConfigRepository;
let redemptionRepositoryHelper: RedemptionConfigCombinedRepository;

const offerId = 1;
const vaultId = createVaultIdE2E();

describe('PATCH /redemptions/{offerId}', () => {
  const companyId = faker.number.int({ max: 1000000 });

  const vaultBatchesEntity: VaultBatchEntity = vaultBatchEntityFactory.build({
    id: createVaultBatchesIdE2E(),
    vaultId: vaultId,
  });

  const testVaultBodyWithUcOrEEIntegration = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'vault' as RedemptionType,
    connection: 'affiliate',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    vault: {
      id: createVaultIdE2E(),
      alertBelow: 10,
      status: 'active',
      maxPerUser: 1,
      createdAt: String(new Date('2024-07-16')),
      email: faker.internet.email(),
      integration: 'uniqodo',
      integrationId: faker.string.numeric(8),
    },
  } satisfies UpdateVaultRedemptionSchema;

  const redemptionConfigEntityForVaultWithUcOrEeIntegration: RedemptionConfigEntity =
    redemptionConfigEntityFactory.build({
      id: testVaultBodyWithUcOrEEIntegration.id,
      companyId: testVaultBodyWithUcOrEEIntegration.companyId,
      offerId: testVaultBodyWithUcOrEEIntegration.offerId,
      redemptionType: testVaultBodyWithUcOrEEIntegration.redemptionType,
      connection: 'direct',
      url: faker.internet.url(),
      affiliate: null,
      offerType: 'online',
    });

  const testVaultBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'vault' as RedemptionType,
    connection: 'affiliate',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    url: 'https://www.awin1.com/',
    vault: {
      id: vaultId,
      alertBelow: 10,
      status: 'active',
      maxPerUser: 1,
      createdAt: String(new Date('2024-07-16')),
      email: faker.internet.email(),
      integration: 'non existent integration type',
      integrationId: faker.string.numeric(8),
    },
  } satisfies UpdateVaultRedemptionSchema;

  const redemptionConfigEntityForVault: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
    id: testVaultBody.id,
    companyId: testVaultBody.companyId,
    offerId: testVaultBody.offerId,
    redemptionType: testVaultBody.redemptionType,
    connection: 'direct',
    url: faker.internet.url(),
    affiliate: null,
    offerType: 'online',
  });

  const testVaultQRBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'vaultQR' as RedemptionType,
    connection: 'affiliate',
    companyId: faker.number.int({ max: 1000000 }),
    affiliate: 'awin',
    vault: {
      id: vaultId,
      alertBelow: 10,
      status: 'active',
      maxPerUser: 1,
      createdAt: String(new Date('2024-07-16')),
      email: faker.internet.email(),
      integration: null,
      integrationId: null,
    },
  } satisfies UpdateVaultRedemptionSchema;

  const redemptionConfigEntityForVaultQR: RedemptionConfigEntity = redemptionConfigEntityFactory.build({
    id: testVaultQRBody.id,
    companyId: testVaultQRBody.companyId,
    offerId: testVaultQRBody.offerId,
    redemptionType: testVaultQRBody.redemptionType,
    connection: 'direct',
    affiliate: null,
    offerType: 'in-store',
    url: null,
  });

  const testGenericBody = {
    id: createRedemptionsIdE2E(),
    offerId: offerId,
    redemptionType: 'generic' as RedemptionType,
    connection: 'affiliate',
    companyId: companyId,
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
    companyId: companyId,
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
    companyId: companyId,
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

  it('should return 404 if URL offerId and payload offerId do not match', async () => {
    const result = await callPatchRedemptionConfigEndpoint({ ...testGenericBody, offerId: offerId + 1 });

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId in URL and payload do not match: ${testGenericBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
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

  it('should return 404 if payload offerId/companyId do not match redemptions record offerId/companyId', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForPreApplied);

    const result = await callPatchRedemptionConfigEndpoint({ ...testPreAppliedBody, companyId: companyId + 1 });

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId/companyId do not match for this redemption: ${testPreAppliedBody.id}`,
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

  it('should return 404 for generic redemptionType if payload generic.code is a blank string', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForGeneric);

    const result = await callPatchRedemptionConfigEndpoint({
      ...testGenericBody,
      generic: {
        id: testGenericBody.generic.id,
        code: '',
      },
    });

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - generic code cannot be blank: ${testGenericBody.id}`,
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

  it('should return 404 for vault redemptionType if vaults record can not be found', async () => {
    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForVault);

    const result = await callPatchRedemptionConfigEndpoint(testVaultBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - vault record does not exist with corresponding id's: ${testVaultBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('should return 200 and correct redemptionConfig for vault redemptionType on update success', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({
      id: testVaultBody.vault.id,
      redemptionId: testVaultBody.id,
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForVault);
    await vaultsRepository.create(vaultEntity);
    await vaultBatchesRepository.create(vaultBatchesEntity);

    const result = await callPatchRedemptionConfigEndpoint(testVaultBody);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testVaultBody.id,
        offerId: String(testVaultBody.offerId),
        redemptionType: testVaultBody.redemptionType,
        connection: testVaultBody.connection,
        companyId: String(testVaultBody.companyId),
        affiliate: testVaultBody.affiliate,
        url: testVaultBody.url,
        vault: {
          id: testVaultBody.vault.id,
          alertBelow: testVaultBody.vault.alertBelow,
          status: testVaultBody.vault.status,
          maxPerUser: testVaultBody.vault.maxPerUser,
          createdAt: new Date(testVaultBody.vault.createdAt).toISOString(),
          email: testVaultBody.vault.email,
          integration: null,
          integrationId: null,
          batches: [
            {
              id: vaultBatchesEntity.id,
              created: vaultBatchesEntity.created.toISOString(),
              expiry: vaultBatchesEntity.expiry.toISOString(),
            },
          ],
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);

    await vaultBatchesRepository.deleteByVaultId(vaultEntity.id);
    await vaultsRepository.deleteById(vaultEntity.id);
  });

  it('should return 200 and correct redemptionConfig for vaultQR redemptionType on update success', async () => {
    const vaultQREntity: VaultEntity = vaultEntityFactory.build({
      id: testVaultQRBody.vault.id,
      redemptionId: testVaultQRBody.id,
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForVaultQR);
    await vaultsRepository.create(vaultQREntity);

    const result = await callPatchRedemptionConfigEndpoint(testVaultQRBody);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testVaultQRBody.id,
        offerId: String(testVaultQRBody.offerId),
        redemptionType: testVaultQRBody.redemptionType,
        connection: testVaultQRBody.connection,
        companyId: String(testVaultQRBody.companyId),
        affiliate: testVaultQRBody.affiliate,
        vault: {
          id: testVaultQRBody.vault.id,
          alertBelow: testVaultQRBody.vault.alertBelow,
          status: testVaultQRBody.vault.status,
          maxPerUser: testVaultQRBody.vault.maxPerUser,
          createdAt: new Date(testVaultQRBody.vault.createdAt).toISOString(),
          email: testVaultQRBody.vault.email,
          integration: testVaultQRBody.vault.integration,
          integrationId: testVaultQRBody.vault.integrationId,
          batches: [],
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);

    await vaultBatchesRepository.deleteByVaultId(vaultQREntity.id);
    await vaultsRepository.deleteById(vaultQREntity.id);
  });

  it('should return 200 and correct redemptionConfig for vaultQR redemptionType and uniqodo/ee integration type on update success', async () => {
    const vaultEntity: VaultEntity = vaultEntityFactory.build({
      id: testVaultBodyWithUcOrEEIntegration.vault.id,
      redemptionId: testVaultBodyWithUcOrEEIntegration.id,
    });

    await redemptionConfigRepository.createRedemption(redemptionConfigEntityForVaultWithUcOrEeIntegration);
    await vaultsRepository.create(vaultEntity);

    const result = await callPatchRedemptionConfigEndpoint(testVaultBodyWithUcOrEEIntegration);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: testVaultBodyWithUcOrEEIntegration.id,
        offerId: String(testVaultBodyWithUcOrEEIntegration.offerId),
        redemptionType: testVaultBodyWithUcOrEEIntegration.redemptionType,
        connection: testVaultBodyWithUcOrEEIntegration.connection,
        companyId: String(testVaultBodyWithUcOrEEIntegration.companyId),
        affiliate: testVaultBodyWithUcOrEEIntegration.affiliate,
        url: testVaultBodyWithUcOrEEIntegration.url,
        vault: {
          id: testVaultBodyWithUcOrEEIntegration.vault.id,
          alertBelow: testVaultBodyWithUcOrEEIntegration.vault.alertBelow,
          status: testVaultBodyWithUcOrEEIntegration.vault.status,
          maxPerUser: testVaultBodyWithUcOrEEIntegration.vault.maxPerUser,
          createdAt: new Date(testVaultBodyWithUcOrEEIntegration.vault.createdAt).toISOString(),
          email: testVaultBodyWithUcOrEEIntegration.vault.email,
          integration: testVaultBodyWithUcOrEEIntegration.vault.integration,
          integrationId: testVaultBodyWithUcOrEEIntegration.vault.integrationId,
          batches: [],
        },
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);

    await vaultBatchesRepository.deleteByVaultId(vaultEntity.id);
    await vaultsRepository.deleteById(vaultEntity.id);
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
