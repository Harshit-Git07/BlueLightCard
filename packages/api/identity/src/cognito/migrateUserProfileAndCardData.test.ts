import { describe, expect, test } from '@jest/globals';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from './migrateUserProfileAndCardData';
const ddbMock = mockClient(DynamoDBDocumentClient);

describe('Migrate User Profile And Card Data', () => {
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
                detail: { brand: 'blc_uk', legacyUserId: '20', 'cardId': 90, profileUuid: 'tyu637g-zbc32-bxvm48hg-kjdy'}
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

    test('Returns 400 with message when legacyUserId is empty', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo', legacyUserId: '', cardId: '90', profileUuid: 'tyu637g-zbc32-bxvm48hg-kjdy'}
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