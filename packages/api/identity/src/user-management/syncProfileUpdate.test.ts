import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './syncProfileUpdate';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Sync User Profile Data', () => {
    beforeEach(() => {
        ddbMock.reset();
    });
    
    test('Returns 400 with message when brand is missing', async () => {
    
        const res = await handler(
          {
            headers: {},
            detail: {}
          },
          {},
        );
        expect(res).toEqual({
            statusCode: 400, 
            body: JSON.stringify({message: 'Please provide brand details'}),
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
          },
          });
      });

    test('Returns 400 with message when invalid brand', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'test_brand_name'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid brand' })
        });
    });

    test('Returns 400 with message when uuid is missing', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Required parameters are missing' })
        });
    });

    test('Returns 400 with message when no valid model data is provided', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk', randomField: 90}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Required parameters are missing' })
        });
    });

    test('Returns 200 for successful update', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
              {
                pk: 'MEMBER#3df8674b-780a-4dd9-b8ae-1effa340c1de',
                sk: 'PROFILE#6eeea0cd-df9d-43d0-8441-737c771e3982',
                surname: 'Surname',
                firstname: 'Firstname',
                employer: '365478',
              },
            ],
          });
          ddbMock.on(UpdateCommand).resolves({
            $metadata: {
              httpStatusCode: 200,
            },
          });
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'BLC_UK', gender: 'O', uuid: '3df8674b-780a-4dd9-b8ae-1effa340c1de'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 200, body: JSON.stringify({ message: 'user profile data updated' })
        });
    });

    test('Returns 200 for successful update', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
              {
                pk: 'MEMBER#3df8674b-780a-4dd9-b8ae-1effa340c1de',
                sk: 'PROFILE#6eeea0cd-df9d-43d0-8441-737c771e3982',
                surname: 'Surname',
                firstname: 'Firstname',
                employer: '365478',
              },
            ],
          });
          ddbMock.on(UpdateCommand).resolves({
            $metadata: {
              httpStatusCode: 200,
            },
          });
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'BLC_UK', spare_email: '', spare_email_validated: '1', uuid: '3df8674b-780a-4dd9-b8ae-1effa340c1de'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 200, body: JSON.stringify({ message: 'user profile data updated' })
        });
    });

    test('Returns 200 for successful update - confirm string values are being converted to a number by Zod', async () => {
      ddbMock.on(QueryCommand).resolves({
          Items: [
            {
              pk: 'MEMBER#3df8674b-780a-4dd9-b8ae-1effa340c1de',
              sk: 'PROFILE#6eeea0cd-df9d-43d0-8441-737c771e3982',
              surname: 'Surname',
            },
          ],
        });
        ddbMock.on(UpdateCommand).resolves({
          $metadata: {
            httpStatusCode: 200,
          },
        });
      const res = await handler(
          {
              headers: {},
              body: { },
              detail: { brand: 'BLC_UK', merged_uid: '1242', spare_email_validated: '1', uuid: '3df8674b-780a-4dd9-b8ae-1effa340c1de'}
          },
          {},
      );
      expect(res).toEqual({
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
          },
          statusCode: 200, body: JSON.stringify({ message: 'user profile data updated' })
      });
  });

    test('Returns 200 for successful create', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
            ],
          });
          ddbMock.on(UpdateCommand).resolves({
            $metadata: {
              httpStatusCode: 200,
            },
          });
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'BLC_UK', 
                dob: "1980-10-20",
                gender: "F",
                mobile: "070000000000",
                firstname: "Jane",
                surname: "D0e",
                employer: "740",
                organisation: "Blood Bikes",
                uuid: 'f9920a58-5eec-410a-a338-b67aefd94b50'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 200, body: JSON.stringify({ message: 'user profile data created' })
        });
    });

    test('Returns 200 for successful create - null fields', async () => {
        ddbMock.on(QueryCommand).resolves({
            Items: [
            ],
          });
          ddbMock.on(UpdateCommand).resolves({
            $metadata: {
              httpStatusCode: 200,
            },
          });
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'BLC_UK', 
                dob: null,
                gender: null,
                mobile: null,
                firstname: "Jane",
                surname: "D0e",
                employer: "740",
                organisation: "Blood Bikes",
                uuid: 'f9920a58-5eec-410a-a338-b67aefd94b50'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 200, body: JSON.stringify({ message: 'user profile data created' })
        });
    });
});
