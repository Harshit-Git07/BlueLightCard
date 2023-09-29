import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { get } from './userData';
import jwtDecode from 'jwt-decode';
import { unpackJWT } from './unpackJWT';

jest.mock('jwt-decode', () => () => ({  client_id: 1234,  'custom:blc_old_uuid': 'testUUID'}))

  describe('User Profile, Brand and Card data', () => {
    let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    dynamoMock = mockClient(DynamoDBDocumentClient);
  });

  afterEach(() => {
    dynamoMock.restore();
  });

    test('DynamoDB is called when request is valid', async () => {
      const res = await get(
        // @ts-expect-error - We're not testing the event object
        {
          headers: { Authorization: 'test' }
        },
        {},
      );
      expect(dynamoMock.calls()).toHaveLength(1);
    });

    test('Returns 204 with user not found message when user is not found', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [],
      });
      const res = await get(
        // @ts-expect-error - We're not testing the event object
        {
          headers: { Authorization: 'test' }
        },
        {},
      );

      expect(res).toEqual({
        statusCode: 204,
        body: JSON.stringify({
          message: 'No Content'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'message': 'User not found'
        },
      });
    });

    test('provided invalid response when DB result fails to map to zod object, 500 is returned', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          {
            pk: "fakeId"
          }
        ],
      });
      const res = await get(
        // @ts-expect-error - We're not testing the event object
        {
          headers: { Authorization: 'test' }
        },
        {},
      );

      expect(res).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error',
          error: "Cannot read properties of undefined (reading 'includes')"
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    });
});