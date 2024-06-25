import { mockClient } from 'aws-sdk-client-mock';
import { BrandService } from '../BrandService';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BrandRepository } from 'src/repositories/brandRepository';

describe('BrandService', () => {
    let brandService: BrandService;
    let brandRepo: BrandRepository;
    let dynamoMock: ReturnType<typeof mockClient>;
    const mockUserId = '123456789';
    const mockUuid = '874hfid-dfhdfj-dsfdfd';

    beforeEach(() => {
        dynamoMock = mockClient(DynamoDBDocumentClient);
        brandRepo = new BrandRepository('staging-blc-mono-identityTable', 'eu-west-2');
        brandService = new BrandService('staging-blc-mono-identityTable', 'eu-west-2');
        brandService.brand = brandRepo;
    });

    it('should return empty if DynamoDb call fails', async () => {
        dynamoMock.on(QueryCommand).rejects(new Error('DynamoDB error'))
        const result = await brandService.getUserIdByUuid(mockUuid);

        expect(result).toBe('');
    });

    it('should return user ID if DynamoDb call returns a valid result', async () => {

      brandService.brand.findItemsByUuid = jest.fn().mockImplementationOnce(() => Promise.resolve({
        Items: [{ legacy_id: mockUserId }]
      }));
      const result = await brandService.getUserIdByUuid(mockUuid);
      expect(result).toBe(mockUserId);
    });
      
});
