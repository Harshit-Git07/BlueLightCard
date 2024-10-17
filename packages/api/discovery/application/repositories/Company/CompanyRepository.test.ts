import process from 'process';

import { companyEntityFactory } from '@blc-mono/discovery/application/factories/CompanyEntityFactory';
import { CompanyRepository } from '@blc-mono/discovery/application/repositories/Company/CompanyRepository';
import { CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

describe('Company Repository', () => {
  const mockSave = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockGet = jest.fn();

  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
  });

  describe('insert', () => {
    DynamoDBService.put = mockSave;

    it('should call "Put" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();

      await new CompanyRepository().insert(companyEntity);

      expect(mockSave).toHaveBeenCalledWith({
        Item: companyEntity,
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('retrieveById', () => {
    it('should call "Get" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      DynamoDBService.get = mockGet.mockResolvedValue(companyEntity);

      const result = await new CompanyRepository().retrieveById(companyEntity.id);

      expect(mockGet).toHaveBeenCalledWith({
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
