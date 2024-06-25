import { mockClient } from 'aws-sdk-client-mock';
import { ProfileService } from '../ProfileService';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ProfileRepository } from 'src/repositories/profileRepository';

describe('ProfileService', () => {
    let profileService: ProfileService;
    let profileRepository: ProfileRepository;
    let dynamoMock: ReturnType<typeof mockClient>;
    const mockUuid = '874hfid-dfhdfj-dsfdfd';
    const mockEmail = 'test@bluelightcard.co.uk';

    beforeEach(() => {
        profileRepository = new ProfileRepository('staging-blc-mono-identityTable', 'ap-southeast-2');
        profileService = new ProfileService('staging-blc-mono-identityTable', 'ap-southeast-2');
        profileService.profile = profileRepository;
        dynamoMock = mockClient(DynamoDBDocumentClient);
    });

    it('should retun false if DynamoDb call fails', async () => {
        dynamoMock.on(QueryCommand).rejects(new Error('DynamoDB error'))
        const result = await profileService.isSpareEmail('874hfid-dfhdfj-dsfdfd', 'other@bluelightcard.co.uk');

        expect(result).toBe(false);
    });

    it('should retun empty if DynamoDb call fails', async () => {
      dynamoMock.on(QueryCommand).rejects(new Error('DynamoDB error'))
      const result = await profileService.getUuidByEmail('other@bluelightcard.co.uk');

      expect(result).toBe("");
  });

  it('should return user Uuid if function call returns a valid result', async () => {

    profileService.profile.findByEmail = jest.fn().mockImplementationOnce(() => Promise.resolve({
      Items: [{ pk: `MEMBER#874hfid-dfhdfj-dsfdfd` }]
    }));
    const result = await profileService.getUuidByEmail(mockEmail);
    expect(result).toBe(mockUuid);
  });
});
