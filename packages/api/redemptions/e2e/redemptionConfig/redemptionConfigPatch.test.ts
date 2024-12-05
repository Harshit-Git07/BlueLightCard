import { faker } from '@faker-js/faker';
import { ApiGatewayV1Api } from 'sst/node/api';
import { afterAll, beforeAll, describe, expect, it, onTestFinished } from 'vitest';
import { ValidationError } from 'zod-validation-error';

import { PatchRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/patchRedemptionConfig';

import { DatabaseConnectionType } from '../../libs/database/connection';
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
    const requestBody: PatchRedemptionConfigModel = {
      id: faker.string.uuid(),
      offerId: faker.string.uuid(),
      redemptionType: 'showCard',
      connection: 'affiliate',
      companyId: faker.string.uuid(),
      affiliate: 'awin',
    };

    const result = await callPatchRedemptionConfigEndpoint(requestBody, faker.string.uuid());

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId in URL and payload do not match: ${requestBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns 404 if redemptions record can not be found', async () => {
    const requestBody: PatchRedemptionConfigModel = {
      id: faker.string.uuid(),
      offerId: faker.string.uuid(),
      redemptionType: 'showCard',
      connection: 'affiliate',
      companyId: faker.string.uuid(),
      affiliate: 'awin',
    };

    const result = await callPatchRedemptionConfigEndpoint(requestBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - redemptionId does not exist: ${requestBody.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns 404 if offerId in requestBody does not match offerId on existing redemption config', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'showCard',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const requestBody: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      companyId: redemptionConfig.companyId,
      redemptionType: 'showCard',
      connection: 'affiliate',
      offerId: faker.string.uuid(),
    };

    const result = await callPatchRedemptionConfigEndpoint(requestBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId/companyId do not match for this redemption: ${redemptionConfig.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns 404 if companyId in requestBody does not match companyId on existing redemption config', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'showCard',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const requestBody: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      redemptionType: 'showCard',
      connection: 'affiliate',
      companyId: faker.string.uuid(),
    };

    const result = await callPatchRedemptionConfigEndpoint(requestBody);

    expect(result.status).toBe(404);

    const actualResponseBody = await result.json();

    const expectedResponseBody = {
      statusCode: 404,
      data: {
        message: `Redemption Config Update - offerId/companyId do not match for this redemption: ${redemptionConfig.id}`,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

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

    const payload: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      companyId: redemptionConfig.companyId,
      redemptionType: 'preApplied',
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

  it('returns redemptionConfig for giftCard redemptionType on update success', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'giftCard',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
      offerType: 'online',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const payload: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      companyId: redemptionConfig.companyId,
      redemptionType: 'giftCard',
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
        redemptionType: 'giftCard',
        connection: payload.connection,
        affiliate: payload.affiliate,
        url: payload.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns redemptionConfig for compare redemptionType on update success', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'compare',
      connection: 'affiliate',
      url: faker.internet.url(),
      affiliate: 'awin',
      offerType: 'online',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const payload: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      companyId: redemptionConfig.companyId,
      redemptionType: 'compare',
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
        redemptionType: 'compare',
        connection: payload.connection,
        affiliate: payload.affiliate,
        url: payload.url,
      },
    };
    expect(actualResponseBody).toStrictEqual(expectedResponseBody);
  });

  it('returns redemptionConfig for verify redemptionType on update success', async () => {
    const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
      redemptionType: 'verify',
      connection: 'direct',
      url: faker.internet.url(),
      affiliate: null,
      offerType: 'online',
    });
    onTestFinished(redemptionConfigHooks.cleanup);
    await redemptionConfigHooks.insert();

    const payload: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      companyId: redemptionConfig.companyId,
      redemptionType: 'verify',
      connection: 'affiliate',
      affiliate: 'awin',
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
        redemptionType: 'verify',
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

    const requestBody: PatchRedemptionConfigModel = {
      id: redemptionConfig.id,
      offerId: redemptionConfig.offerId,
      redemptionType: 'showCard',
      connection: 'affiliate',
      companyId: redemptionConfig.companyId,
      affiliate: null,
    };
    const result = await callPatchRedemptionConfigEndpoint(requestBody);

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
    it('returns 400 if payload generic.code is a blank string', async () => {
      const { redemptionConfig, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'generic',
      }).addGeneric();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'generic',
        connection: 'affiliate',
        companyId: redemptionConfig.companyId,
        affiliate: 'awin',
        url: faker.internet.url(),
        generic: {
          id: faker.string.uuid(),
          code: '',
        },
      };
      const result = await callPatchRedemptionConfigEndpoint(payload);

      expect(result.status).toBe(400);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        meta: {
          tracingId: expect.any(String),
        },
        message: 'Bad Request',
        error: {
          cause: 'Request validation failed',
          message: 'Validation error: String must contain at least 1 character(s) at "body.generic.code"',
          errors: [
            {
              path: ['body', 'generic', 'code'],
              message: 'String must contain at least 1 character(s)',
              code: 'too_small',
            },
          ],
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

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'generic',
        connection: 'affiliate',
        companyId: redemptionConfig.companyId,
        affiliate: 'awin',
        url: faker.internet.url(),
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

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'generic',
        connection: 'affiliate',
        companyId: redemptionConfig.companyId,
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
          id: payload.id,
          offerId: payload.offerId,
          redemptionType: 'generic',
          connection: payload.connection,
          companyId: payload.companyId,
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
        const requestBody: PatchRedemptionConfigModel = {
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

      const requestBody: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'vault',
        connection: redemptionConfig.connection,
        companyId: redemptionConfig.companyId,
        affiliate: redemptionConfig.affiliate,
        url: faker.internet.url(),
        vault: {
          id: faker.string.uuid(),
          alertBelow: vault.alertBelow,

          status: vault.status,
          maxPerUser: 50,
          email: faker.internet.email(),
          integration: vault.integration,
          integrationId: vault.integrationId,
        },
      };
      const result = await callPatchRedemptionConfigEndpoint(requestBody);
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

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'vault',
        companyId: redemptionConfig.companyId,
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

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        companyId: redemptionConfig.companyId,
        redemptionType: 'vaultQR',
        connection: 'affiliate',
        affiliate: 'awin',

        vault: {
          id: vault.id,
          integration: null,
          integrationId: null,
          alertBelow: vault.alertBelow,
          status: vault.status,
          maxPerUser: faker.number.int({ max: 1000 }),
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

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        companyId: redemptionConfig.companyId,
        redemptionType: 'vault',
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        vault: {
          id: vault.id,
          alertBelow: vault.alertBelow,
          status: vault.status,
          maxPerUser: faker.number.int({ max: 1000 }),
          email: faker.internet.email(),
          integration: faker.helpers.arrayElement(['uniqodo', 'eagleeye']),
          integrationId: faker.string.numeric(8),
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
          redemptionType: 'vault',
          connection: payload.connection,
          affiliate: payload.affiliate,
          url: payload.url,
          vault: {
            id: vault.id,
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
  });

  describe('Ballot Config Type', () => {
    it('returns redemptionConfig on update success', async () => {
      const { redemptionConfig, ballot, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'ballot',
      }).addBallot();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const payload: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'ballot',
        companyId: redemptionConfig.companyId,
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        ballot: {
          ...ballot,
          drawDate: faker.date.future().toISOString(),
          eventDate: faker.date.future().toISOString(),
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
          redemptionType: 'ballot',
          connection: payload.connection,
          companyId: redemptionConfig.companyId,
          affiliate: payload.affiliate,
          url: payload.url,
          ballot: {
            id: payload.ballot.id,
            drawDate: payload.ballot.drawDate,
            totalTickets: payload.ballot.totalTickets,
            eventDate: payload.ballot.eventDate,
            offerName: payload.ballot.offerName,
            status: 'pending',
          },
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns 404 if ballot record cannot be found', async () => {
      const { redemptionConfig, ballot, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'ballot',
      }).addBallot();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const requestBody: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'ballot',
        companyId: redemptionConfig.companyId,
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        ballot: {
          ...ballot,
          id: faker.string.uuid(),
          drawDate: faker.date.future().toISOString(),
          eventDate: faker.date.future().toISOString(),
        },
      } as const;
      const result = await callPatchRedemptionConfigEndpoint(requestBody);
      expect(result.status).toBe(404);

      const actualResponseBody = await result.json();

      const expectedResponseBody = {
        statusCode: 404,
        data: {
          message: `Redemption Config Update - ballot record does not exist with corresponding id's: ${redemptionConfig.id}`,
        },
      };
      expect(actualResponseBody).toStrictEqual(expectedResponseBody);
    });

    it('returns 400 if ballot totalTickets is not greater than 0', async () => {
      const { redemptionConfig, ballot, ...redemptionConfigHooks } = buildRedemptionConfig(connectionManager, {
        redemptionType: 'ballot',
      }).addBallot();
      onTestFinished(redemptionConfigHooks.cleanup);
      await redemptionConfigHooks.insert();

      const requestBody: PatchRedemptionConfigModel = {
        id: redemptionConfig.id,
        offerId: redemptionConfig.offerId,
        redemptionType: 'ballot',
        companyId: redemptionConfig.companyId,
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/',
        ballot: {
          ...ballot,
          totalTickets: 0,
          drawDate: faker.date.future().toISOString(),
          eventDate: faker.date.future().toISOString(),
        },
      } as const;
      const result = await callPatchRedemptionConfigEndpoint(requestBody);
      expect(result.status).toBe(400);

      const actualResponseBody = (await result.json()) as { error: ValidationError };
      expect(actualResponseBody.error.message).toEqual(
        `Validation error: Number must be greater than 0 at "body.ballot.totalTickets"`,
      );
    });
  });
});

async function callPatchRedemptionConfigEndpoint(
  body: PatchRedemptionConfigModel,
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
