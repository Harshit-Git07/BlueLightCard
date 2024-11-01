import { faker } from '@faker-js/faker';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, it, onTestFinished } from 'vitest';

import {
  UpdateRedemptionRequestPayload,
  UpdateVaultRedemptionSchema,
} from '@blc-mono/redemptions/application/services/redemptionConfig/UpdateRedemptionConfigService';

import { DatabaseConnectionType } from '../../libs/database/connection';
import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { getApiKey } from '../helpers/adminApi';
import { E2EDatabaseConnectionManager } from '../helpers/database';
import { buildRedemptionConfig } from '../helpers/redemptionConfig';

let apiKey: string;

describe('PATCH Redemption Config', () => {
  let connectionManager: E2EDatabaseConnectionManager;

  beforeAll(async () => {
    connectionManager = await E2EDatabaseConnectionManager.setup(DatabaseConnectionType.READ_WRITE);

    // Set a conservative timeout
  }, 60_000);

  beforeAll(async () => {
    apiKey = await getApiKey(`${process.env.SST_STAGE}-redemptions-admin`);
  });

  afterAll(async () => {
    await connectionManager?.cleanup();
  });

  it('returns 404 if URL offerId and payload offerId do not match', async () => {
    const payload = redemptionConfigEntityFactory.build({ redemptionType: 'showCard' });
    const result = await callPatchRedemptionConfigEndpoint(payload, faker.string.uuid());

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId in URL and payload do not match: ${payload.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns 404 if redemptions record can not be found', async () => {
    const payload = redemptionConfigEntityFactory.build({ redemptionType: 'showCard' });
    const result = await callPatchRedemptionConfigEndpoint(payload);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - redemptionId does not exist: ${payload.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it.each(['companyId', 'offerId'])(
    'returns 404 if payload %s does not match redemption config',
    async (nonMatchingField) => {
      const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'showCard',
      });
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const result = await callPatchRedemptionConfigEndpoint({
        ...redemptionConfig,
        [nonMatchingField]: faker.string.uuid(),
      });

      expect(result.status).toBe(404);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 404,
        data: {
          message: `Redemption Config Update - offerId/companyId do not match for this redemption: ${redemptionConfig.id}`,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    },
  );

  it('returns redemptionConfig for preApplied redemptionType on update success', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'preApplied',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
      offerType: 'online',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const payload = {
      ...redemptionConfig,
      connection: 'direct',
      affiliate: null,
      url: faker.internet.url(),
    } as const;

    const result = await callPatchRedemptionConfigEndpoint(payload);

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        companyId: redemptionConfig.companyId,
        redemptionType: 'preApplied',
        connection: payload.connection,
        affiliate: payload.affiliate,
        url: payload.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns redemptionConfig for showCard redemptionType on update success', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'showCard',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const result = await callPatchRedemptionConfigEndpoint({ ...redemptionConfig, affiliate: null });

    expect(result.status).toBe(200);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 200,
      data: {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'showCard',
        companyId: redemptionConfig.companyId,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  describe('Generic Config Type', () => {
    it('returns 404 if payload generic.code is a blank string', async () => {
      const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'generic',
      }).addGeneric();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        generic: {
          id: faker.string.uuid(),
          code: '',
        },
      };
      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(404);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 404,
        data: {
          message: `Redemption Config Update - generic code cannot be blank: ${payload.id}`,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns 404 if generics record can not be found', async () => {
      const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'generic',
      });
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        generic: {
          id: faker.string.uuid(),
          code: 'ID-DOES-NOT_EXIST',
        },
      };

      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(404);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 404,
        data: {
          message: `Redemption Config Update - generic record does not exist with corresponding id's: ${payload.id}`,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns redemptionConfig on update success', async () => {
      const { generic, redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'generic',
        affiliate: null,
        url: faker.internet.url(),
      }).addGeneric();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        affiliate: 'awin' as const,
        url: 'https://www.awin1.com/',
        generic: {
          id: generic.id,
          code: 'DISCOUNT_CODE_01',
        },
      };
      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          id: redemptionConfig.id,
          offerId: redemptionConfig.offerId,
          redemptionType: 'generic',
          connection: redemptionConfig.connection,
          companyId: redemptionConfig.companyId,
          affiliate: payload.affiliate,
          url: payload.url,
          generic: {
            id: generic.id,
            code: payload.generic.code,
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });
  });

  describe('Vault Config Type', () => {
    it.each(['eagleeye', 'uniqodo'] as const)(
      'returns 400 if integrationId is empty when integration is %s',
      async (integration) => {
        const requestBody: UpdateRedemptionRequestPayload = {
          id: 'rdm-987250ee-b4a3-48ab-91f8-c7bd4321f7cc',
          offerId: '1234567',
          redemptionType: 'vault',
          connection: 'affiliate',
          companyId: '12367',
          affiliate: 'awin',
          url: 'https://www.awin1.com',
          vault: {
            id: 'vlt-221b66e2-d197-4a33-834d-5a154952c530',
            alertBelow: 1000,
            status: 'active',
            maxPerUser: 5,
            email: 'ferenc@blc.co.uk',
            integration: integration,
            integrationId: '',
          },
        };

        const result = await callPatchRedemptionConfigEndpoint(requestBody, requestBody.offerId);

        expect(result.status).toBe(400);

        const actualResponseBody = await result.json();

        const expectedResponseBody = {
          meta: {
            tracingId: expect.any(String),
          },
          message: 'Bad Request',
          error: {
            cause: 'Request validation failed',
            message:
              'Validation error: integrationId must be provided when integration is eagleeye or uniqodo at "body.vault"',
            errors: [
              {
                path: ['body', 'vault'],
                message: 'integrationId must be provided when integration is eagleeye or uniqodo',
                code: 'custom',
                fatal: true,
              },
            ],
          },
        };
        expect(actualResponseBody).toStrictEqual(expectedResponseBody);
      },
    );

    it('returns 404 if vault record cannot be found', async () => {
      const { redemptionConfig, vault, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'vault',
      }).addVault();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const result = await callPatchRedemptionConfigEndpoint({
        ...redemptionConfig,
        vault: {
          ...vault,
          id: faker.string.uuid(),
        } as UpdateVaultRedemptionSchema['vault'],
      });
      expect(result.status).toBe(404);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 404,
        data: {
          message: `Redemption Config Update - vault record does not exist with corresponding id's: ${redemptionConfig.id}`,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns redemptionConfig on update success', async () => {
      const { redemptionConfig, vault, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'vault',
        connection: 'direct',
        affiliate: null,
      }).addVault();
      const { batches } = redemptionConfigHooks.addBatch();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        vault: {
          ...vault,
          alertBelow: 50,
          maxPerUser: 50,
          email: faker.internet.email(),
          integration: 'uniqodo',
          integrationId: faker.string.numeric(8),
          status: 'active',
        },
      } as const;

      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          id: redemptionConfig.id,
          offerId: redemptionConfig.offerId,
          redemptionType: 'vault',
          connection: payload.connection,
          companyId: redemptionConfig.companyId,
          affiliate: payload.affiliate,
          url: payload.url,
          vault: {
            id: payload.vault.id,
            alertBelow: payload.vault.alertBelow,
            status: payload.vault.status,
            maxPerUser: payload.vault.maxPerUser,
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
            email: payload.vault.email,
            integration: payload.vault.integration,
            integrationId: payload.vault.integrationId,
            batches: [
              {
                id: batches[0].id,
                created: batches[0].created.toISOString(),
                expiry: batches[0].expiry.toISOString(),
              },
            ],
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns redemptionConfig for vaultQR redemptionType on update success', async () => {
      const { redemptionConfig, vault, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'vaultQR',
        connection: 'direct',
        affiliate: null,
      }).addVault({ showQR: true });
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        vault: {
          ...vault,
          email: faker.internet.email(),
        },
      } as const;
      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          id: redemptionConfig.id,
          offerId: redemptionConfig.offerId,
          companyId: redemptionConfig.companyId,
          redemptionType: 'vaultQR',
          connection: payload.connection,
          affiliate: payload.affiliate,
          vault: {
            id: payload.vault.id,
            alertBelow: payload.vault.alertBelow,
            status: payload.vault.status,
            maxPerUser: payload.vault.maxPerUser,
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
            email: payload.vault.email,
            integration: payload.vault.integration,
            integrationId: payload.vault.integrationId,
            batches: [],
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns redemptionConfig for vault redemptionType and uniqodo/ee integration type on update success', async () => {
      const { redemptionConfig, vault, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'vault',
        connection: 'direct',
        affiliate: null,
      }).addVault();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload = {
        ...redemptionConfig,
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        vault: {
          ...vault,
          integration: faker.helpers.arrayElement(['uniqodo', 'eagleeye']),
          integrationId: faker.string.numeric(8),
        },
      } as const;

      const result = await callPatchRedemptionConfigEndpoint(payload);

      // expect(result.status).toBe(200);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 200,
        data: {
          id: redemptionConfig.id,
          offerId: redemptionConfig.offerId,
          companyId: redemptionConfig.companyId,
          redemptionType: 'vault',
          connection: payload.connection,
          affiliate: payload.affiliate,
          url: payload.url,
          vault: {
            id: vault.id,
            alertBelow: vault.alertBelow,
            status: vault.status,
            maxPerUser: vault.maxPerUser,
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
            email: vault.email,
            integration: payload.vault.integration,
            integrationId: payload.vault.integrationId,
            batches: [],
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });
  });
});

async function callPatchRedemptionConfigEndpoint(
  body: UpdateRedemptionRequestPayload,
  offerId?: string,
): Promise<Response> {
  const payload = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/redemptions/${offerId ?? body.offerId}`, payload);
}
