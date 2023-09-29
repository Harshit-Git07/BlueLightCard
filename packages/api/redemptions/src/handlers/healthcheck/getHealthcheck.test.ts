import { describe, expect, test } from '@jest/globals';
import { handler } from './getHealthcheck';

describe('Get Redemption', () => {

  test('Returns 200 with redemption', async () => {
    const res = await handler(
      // @ts-expect-error - We're not testing the event object
      {
        headers: {},
        body: JSON.stringify({})
      },
      {},
    );
    expect(res).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        data: { status: 'success' }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  });
});
