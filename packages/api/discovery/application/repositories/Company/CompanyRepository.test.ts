import { companyEntityFactory } from '@blc-mono/discovery/application/factories/CompanyEntityFactory';
import { CompanyRepository } from '@blc-mono/discovery/application/repositories/Company/CompanyRepository';
import { CompanyKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/CompanyEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

describe('Company Repository', () => {
  const mockSave = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockGet = jest.fn();
  const mockQuery = jest.fn();
  const mockDelete = jest.fn();
  const mockBatchInsert = jest.fn();

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

  describe('delete', () => {
    DynamoDBService.delete = mockDelete;

    it('should call "Delete" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();

      await new CompanyRepository().delete(companyEntity);

      expect(mockDelete).toHaveBeenCalledWith({
        Key: {
          partitionKey: companyEntity.partitionKey,
          sortKey: companyEntity.sortKey,
        },
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('batchInsert', () => {
    DynamoDBService.batchInsert = mockBatchInsert;

    it('should call "BatchInsert" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();

      await new CompanyRepository().batchInsert([companyEntity]);

      expect(mockBatchInsert).toHaveBeenCalledWith([companyEntity], 'search-offer-company-table');
    });
  });

  describe('batchDelete', () => {
    it('should call "BatchDelete" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      DynamoDBService.batchDelete = mockBatchInsert;

      await new CompanyRepository().batchDelete([companyEntity]);

      expect(mockBatchInsert).toHaveBeenCalledWith(
        [{ partitionKey: companyEntity.partitionKey, sortKey: companyEntity.sortKey }],
        'search-offer-company-table',
      );
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

  describe('retrieveLocationsByCompanyId', () => {
    it('should call "Query" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      DynamoDBService.query = mockQuery.mockResolvedValue([companyEntity]);

      const result = await new CompanyRepository().retrieveLocationsByCompanyId(companyEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partitionKey = :partition_key and begins_with(sortKey, :location_prefix)',
        ExpressionAttributeValues: {
          ':partition_key': CompanyKeyBuilders.buildPartitionKey(companyEntity.id),
          ':location_prefix': 'COMPANY_LOCATION-',
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual([companyEntity]);
    });
  });

  describe('retrieveCompanyRecordsById', () => {
    it('should call "Query" method with correct parameters', async () => {
      const companyEntity = companyEntityFactory.build();
      DynamoDBService.query = mockQuery.mockResolvedValue([companyEntity]);

      const result = await new CompanyRepository().retrieveCompanyRecordsById(companyEntity.id);

      expect(mockQuery).toHaveBeenCalledWith({
        KeyConditionExpression: 'partitionKey = :partition_key',
        ExpressionAttributeValues: {
          ':partition_key': CompanyKeyBuilders.buildPartitionKey(companyEntity.id),
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual([companyEntity]);
    });
  });
});
