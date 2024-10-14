import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, it } from 'vitest';

import { UniqodoModel } from '../libs/models/postCallback';

type RequestBody = UniqodoModel;

let apiKey: string;

async function callCallbackEndpoint(body: RequestBody): Promise<Response> {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(body),
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/vault/webhook`, payload);
}

beforeAll(async () => {
  // eslint-disable-next-line no-console
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

describe('POST /vault/webhook', () => {
  it('should log callback vault redemption firehose stream and return NoContent kind', async () => {
    const testBody: RequestBody = {
      integrationType: 'uniqodo',
      claim: {
        expiresAt: faker.date.recent().toISOString(),
        code: faker.string.sample(10),
        createdAt: faker.date.recent().toISOString(),
        deactivatedAt: faker.date.recent().toISOString(),
        linkedUniqueReference: faker.string.sample(10),
        promotionId: faker.string.sample(10),
      },
      promotion: {
        id: faker.string.sample(10),
        status: faker.string.sample(10),
        codeType: faker.string.sample(10),
        timezone: faker.string.sample(10),
        redemptionsPerCode: faker.number.int(10),
        title: faker.string.sample(10),
        rewardType: faker.string.sample(10),
        reward: {
          type: faker.string.sample(10),
          amount: faker.finance.amount(),
          discountType: faker.string.sample(10),
          upToMaximumOf: faker.finance.amount(),
          productExclusionRule: faker.string.sample(10),
        },
        availableToClaim: faker.number.int(10),
        availableToRedeem: faker.number.int(10),
        startDate: faker.date.recent().toISOString(),
        endDate: faker.date.recent().toISOString(),
        terms: faker.string.sample(10),
        codeExpiry: faker.number.int(10),
        codeExpiryUnit: faker.string.sample(10),
      },
      customer: faker.string.sample(10),
    };

    const response = await callCallbackEndpoint(testBody);

    expect(response.status).toBe(204);
  });
});
