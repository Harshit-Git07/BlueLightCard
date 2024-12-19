import { faker } from '@faker-js/faker';
import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, it } from 'vitest';

import { UniqodoModel } from '../../libs/models/postCallback';

type RequestBody = UniqodoModel;

let apiKey: string;

async function callCallbackEndpoint(body: RequestBody): Promise<Response> {
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  };

  return await fetch(`${ApiGatewayV1Api.redemptionsAdmin.url}/vault/webhook`, payload);
}

beforeAll(async () => {
  // eslint-disable-next-line no-console
  const APIGateway = new AWS.APIGateway();
  const keyLookup = `${process.env.SST_STAGE}-redemptions-uniqodo`;
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

describe.skip('POST /vault/webhook', () => {
  it('should log callback vault redemption firehose stream and return NoContent kind', async () => {
    const testBody: RequestBody = {
      integrationType: 'uniqodo',
      code: faker.string.sample(10),
      offer_id: faker.string.sample(10),
      member_id: faker.string.sample(10),
      order_value: faker.string.sample(10),
      currency: faker.string.sample(3),
      redeemed_at: faker.date.recent().toISOString(),
      merchant_id: faker.string.sample(10),
    };

    const response = await callCallbackEndpoint(testBody);

    expect(response.status).toBe(204);
  });
});
