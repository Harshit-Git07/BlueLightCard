import { ProfileRepository } from '../profileRepository';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

describe('ProfileRepository', () => {
    let profileRepository: ProfileRepository;
    let dynamoMock: ReturnType<typeof mockClient>;

    beforeEach(() => {
        profileRepository = new ProfileRepository('staging-blc-mono-identityTable', 'ap-southeast-2');
        // Mock the DynamoDB client and document client
        const mockDynamoDBClient = jest.fn();

        // Mock the DynamoDB client's query method
        dynamoMock = mockClient(DynamoDBDocumentClient);
        dynamoMock.on(QueryCommand).resolves({
            Items: [
                {
                pk: 'MEMBER#0000005',
                sk: 'PROFILE#0000005',
                spare_email: 'other@bluelightcard.co.uk',
                gender: 'O',
                }
            ],
            });
    });

    it('should find profile by uuid', async () => {
        

        // Call the findBySpareEmail method
        const result = await profileRepository.findByUuid('0000005');

        // Assert that the result is correct
        expect(result).toEqual({
            Items: [{
            pk: 'MEMBER#0000005',
            sk: 'PROFILE#0000005',
            spare_email: 'other@bluelightcard.co.uk',
            gender: 'O',
        }]
    });

    });
});
