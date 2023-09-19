import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './createUserProfile';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Create User Profile Data', () => {
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
            body: JSON.stringify({message: 'Required parameters are missing'}),
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
            statusCode: 400, body: JSON.stringify({ message: 'Required parameters are missing' })
        });
    });

    test('Returns 400 with message when uuid is missing', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'BLC_UK'}
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
                detail: { brand: 'BLC_UK', uuid: '36ef10b5e-bdca-11ed-b066-f21f684e35b0', random_field: 'randomValue'}
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


});