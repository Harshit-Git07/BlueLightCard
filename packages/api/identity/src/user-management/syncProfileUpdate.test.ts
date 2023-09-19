import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
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

    test('Returns 400 with message when user profile data not found', async () => {
        ddbMock
        .on(QueryCommand)
        .resolves({
            Items: []
        });
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo', 'gender': 'F'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'User profile data not found' })
        });
    });


});