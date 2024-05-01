import { mockClient } from 'aws-sdk-client-mock';
import { ProfileService } from '../ProfileService';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

describe('ProfileService', () => {
    let profileService: ProfileService;
    let dynamoMock: ReturnType<typeof mockClient>;

    beforeEach(() => {
        profileService = new ProfileService('staging-blc-mono-identityTable', 'ap-southeast-2');
        dynamoMock = mockClient(DynamoDBDocumentClient);
    });

    it('should retun false if DynamoDb call fails', async () => {
        dynamoMock.on(QueryCommand).rejects(new Error('DynamoDB error'))
        const result = await profileService.isSpareEmail('874hfid-dfhdfj-dsfdfd', 'other@bluelightcard.co.uk');

        expect(result).toBe(false);
    });
});