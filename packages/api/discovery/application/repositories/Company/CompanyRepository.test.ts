import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import process from 'process';

import { companyEntityFactory } from '@blc-mono/discovery/application/factories/CompanyEntityFactory';
import { CompanyRepository } from '@blc-mono/discovery/application/repositories/Company/CompanyRepository';
import { CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

describe('Company Repository', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
    mockDynamoDB.reset();
  });

  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  describe('insert', () => {
    const putSpy = jest.spyOn(DynamoDBService.prototype, 'put');

    it('should call "Put" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      putSpy.mockResolvedValue(companyEntity);

      const result = await new CompanyRepository().insert(companyEntity);

      expect(putSpy).toHaveBeenCalledWith({
        Item: companyEntity,
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(companyEntity);
    });
  });

  describe('retrieveById', () => {
    const getSpy = jest.spyOn(DynamoDBService.prototype, 'get');

    it('should call "Get" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      getSpy.mockResolvedValue(companyEntity);

      const result = await new CompanyRepository().retrieveById(companyEntity.id);

      expect(getSpy).toHaveBeenCalledWith({
        Key: {
          partitionKey: CompanyKeyBuilders.buildPartitionKey(companyEntity.id),
          sortKey: CompanyKeyBuilders.buildSortKey(companyEntity.id),
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(companyEntity);
    });
  });
});
