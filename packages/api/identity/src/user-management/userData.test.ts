import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { get } from './userData';

jest.mock('jwt-decode', () => () => ({  client_id: 1234,  'custom:blc_old_uuid': 'testUUID'}))

  describe('User Profile, Brand and Card data', () => {
    let dynamoMock: ReturnType<typeof mockClient>;

    beforeEach(() => {
      dynamoMock = mockClient(DynamoDBDocumentClient);
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          {
              "sk": "BRAND#BLC_UK",
              "legacy_id": 2853201,
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
          },
          {
              "sk": "CARD#3470584",
              "expires": "1758365897",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
              "posted": "1695220641",
              "status": "PHYSICAL_CARD"
          },
          {
                "sk": "COMPANYFOLLOWS#123",
                "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
                "likeType": "Like",
          },
          {
              "email": "rlimbu+work1@bluelightcard.co.uk",
              "spare_email": "rlimbu+work1@bluelightcard.co.uk",
              "merged_uid": false,
              "organisation": "AMBU",
              "employer_id": "0",
              "gender": "F",
              "email_validated": 1,
              "spare_email_validated": 1,
              "mobile": "+447915507274",
              "surname": "limbu",
              "ga_key": " ",
              "dob": "12/27/1987",
              "merged_time": "0000000000000000",
              "firstname": "rubi",
              "sk": "PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec",
              "employer": " ",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
          }
      ],
      });
    });

    afterEach(() => {
      dynamoMock.restore();
    });

    test('DynamoDB is called and response is valid with 200 status when request is valid', async () => {
      const res = await get(
        // @ts-expect-error - We're not testing the event object
        {
          headers: { Authorization: 'test' }
        },
        {},
      );
      expect(dynamoMock.calls()).toHaveLength(1);
      expect(res).toEqual({
        statusCode: 200,
        body: "{\"message\":\"User Found\",\"data\":{\"profile\":{\"firstname\":\"rubi\",\"surname\":\"limbu\",\"organisation\":\"AMBU\",\"dob\":\"1987-12-27\",\"gender\":\"F\",\"mobile\":\"+447915507274\",\"email\":\"rlimbu+work1@bluelightcard.co.uk\",\"emailValidated\":1,\"spareEmail\":\"rlimbu+work1@bluelightcard.co.uk\",\"spareEmailValidated\":1,\"twoFactorAuthentication\":false},\"cards\":[{\"cardId\":\"3470584\",\"expires\":\"1758365897\",\"cardStatus\":\"PHYSICAL_CARD\",\"datePosted\":\"1695220641\"}],\"companies_follows\":[{\"companyId\":\"123\",\"likeType\":\"Like\"}],\"legacyId\":2853201,\"uuid\":\"068385bb-b370-4153-9474-51dd0bfac9dc\",\"brand\":\"BLC_UK\"}}",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    });

    test('Returns 404 with user not found message when user is not found', async () => {
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
        statusCode: 404,
        body: JSON.stringify({
          message: 'User not found'
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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

    test('provided data with null for nullable fields, zod processes it correctly and 200 is returned with correct response body', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          {
              "sk": "BRAND#BLC_UK",
              "legacy_id": 2853201,
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
          },
          {
              "sk": "CARD#3470584",
              "expires": "1758365897",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
              "posted": null,
              "status": "PHYSICAL_CARD"
          },
          {
                "sk": "COMPANYFOLLOWS#123",
                "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
                "likeType": "Like",
          },
          {
              "spare_email": "rlimbu+work1@bluelightcard.co.uk",
              "merged_uid": null,
              "organisation": "AMBU",
              "employer_id": "0",
              "gender": null,
              "email": "rlimbu+work1@bluelightcard.co.uk",
              "email_validated": 1,
              "spare_email_validated": 1,
              "mobile": null,
              "surname": "limbu",
              "ga_key": " ",
              "dob": null,
              "merged_time": null,
              "firstname": "rubi",
              "sk": "PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec",
              "employer": " ",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
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
        statusCode: 200,
        body: "{\"message\":\"User Found\",\"data\":{\"profile\":{\"firstname\":\"rubi\",\"surname\":\"limbu\",\"organisation\":\"AMBU\",\"dob\":null,\"gender\":null,\"mobile\":null,\"email\":\"rlimbu+work1@bluelightcard.co.uk\",\"emailValidated\":1,\"spareEmail\":\"rlimbu+work1@bluelightcard.co.uk\",\"spareEmailValidated\":1,\"twoFactorAuthentication\":false},\"cards\":[{\"cardId\":\"3470584\",\"expires\":\"1758365897\",\"cardStatus\":\"PHYSICAL_CARD\",\"datePosted\":null}],\"companies_follows\":[{\"companyId\":\"123\",\"likeType\":\"Like\"}],\"legacyId\":2853201,\"uuid\":\"068385bb-b370-4153-9474-51dd0bfac9dc\",\"brand\":\"BLC_UK\"}}",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    });

    test('provided date is empty then 200 is returned with date being null and correct response body', async () => {
      dynamoMock.on(QueryCommand).resolves({
        Items: [
          {
              "sk": "BRAND#BLC_UK",
              "legacy_id": 2853201,
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
          },
          {
              "sk": "CARD#3470584",
              "expires": "1758365897",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
              "posted": null,
              "status": "PHYSICAL_CARD"
          },
          {
                "sk": "COMPANYFOLLOWS#123",
                "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc",
                "likeType": "Like",
          },
          {
              "spare_email": "rlimbu+work1@bluelightcard.co.uk",
              "merged_uid": null,
              "organisation": "AMBU",
              "employer_id": "0",
              "gender": null,
              "email": "rlimbu+work1@bluelightcard.co.uk",
              "email_validated": 1,
              "spare_email_validated": 1,
              "mobile": null,
              "surname": "limbu",
              "ga_key": " ",
              "dob": " ",
              "merged_time": null,
              "firstname": "rubi",
              "sk": "PROFILE#52864f27-082e-41eb-89cb-b9f5e0b218ec",
              "employer": " ",
              "pk": "MEMBER#068385bb-b370-4153-9474-51dd0bfac9dc"
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
        statusCode: 200,
        body: "{\"message\":\"User Found\",\"data\":{\"profile\":{\"firstname\":\"rubi\",\"surname\":\"limbu\",\"organisation\":\"AMBU\",\"dob\":null,\"gender\":null,\"mobile\":null,\"email\":\"rlimbu+work1@bluelightcard.co.uk\",\"emailValidated\":1,\"spareEmail\":\"rlimbu+work1@bluelightcard.co.uk\",\"spareEmailValidated\":1,\"twoFactorAuthentication\":false},\"cards\":[{\"cardId\":\"3470584\",\"expires\":\"1758365897\",\"cardStatus\":\"PHYSICAL_CARD\",\"datePosted\":null}],\"companies_follows\":[{\"companyId\":\"123\",\"likeType\":\"Like\"}],\"legacyId\":2853201,\"uuid\":\"068385bb-b370-4153-9474-51dd0bfac9dc\",\"brand\":\"BLC_UK\"}}",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    });
});
