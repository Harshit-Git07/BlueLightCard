import AWS from 'aws-sdk';
import { ApiGatewayV1Api } from 'sst/node/api';
import { beforeAll, describe, expect, it } from 'vitest';

import { IntegrationType } from '../libs/models/postCallback';

type RequestBody = {
  offerId: string;
  code: string;
  orderValue: string;
  currency: string;
  redeemedAt: string;
  integrationType: IntegrationType;
  memberId: string;
};

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
      offerId: 'offerId',
      code: 'code',
      orderValue: 'orderValue',
      currency: 'currency',
      redeemedAt: 'redeemedAt',
      integrationType: 'uniqodo',
      memberId: 'memberId',
    };

    const response = await callCallbackEndpoint(testBody);

    expect(response.status).toBe(204);
  });
});
