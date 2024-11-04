import process from 'process';

import { offerEntityFactory } from '@blc-mono/discovery/application/factories/OfferEntityFactory';
import { OfferRepository } from '@blc-mono/discovery/application/repositories/Offer/OfferRepository';
import { OfferKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';

jest.mock('@blc-mono/discovery/application/services/DynamoDbService');

describe('Offer Repository', () => {
  beforeEach(() => {
    process.env[DiscoveryStackEnvironmentKeys.REGION] = 'eu-west-2';
    process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME] = 'search-offer-company-table';

    jest.resetAllMocks();
  });

  afterEach(() => {
    delete process.env[DiscoveryStackEnvironmentKeys.REGION];
    delete process.env[DiscoveryStackEnvironmentKeys.SEARCH_OFFER_COMPANY_TABLE_NAME];
  });

  const mockSave = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockBatchInsert = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockDelete = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockGet = jest.fn();
  const mockBatchGet = jest.fn();
  const mockQuery = jest.fn();

  describe('insert', () => {
    it('should call "Put" method with correct parameters', async () => {
      DynamoDBService.put = mockSave;
      const offerEntity = offerEntityFactory.build();

      await new OfferRepository().insert(offerEntity);

      expect(mockSave).toHaveBeenCalledWith({
        Item: offerEntity,
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('batchInsert', () => {
    DynamoDBService.batchInsert = mockBatchInsert;
    it('should call "BatchWrite" method with correct parameters', async () => {
      const offerEntities = offerEntityFactory.buildList(2);

      await new OfferRepository().batchInsert(offerEntities);

      expect(mockBatchInsert).toHaveBeenCalledWith(offerEntities, 'search-offer-company-table');
    });
  });

  describe('delete', () => {
    DynamoDBService.delete = mockDelete;
    it('should call "Delete" method with correct parameters', async () => {
      const offerEntity = offerEntityFactory.build();

      await new OfferRepository().delete(offerEntity.id, offerEntity.company.id);

      expect(mockDelete).toHaveBeenCalledWith({
        Key: {
          partitionKey: OfferKeyBuilders.buildPartitionKey(offerEntity.id),
          sortKey: OfferKeyBuilders.buildSortKey(offerEntity.company.id),
        },
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('retrieveById', () => {
    DynamoDBService.get = mockGet;
    it('should call "Get" method with correct parameters', async () => {
      const offerEntity = offerEntityFactory.build();
      mockGet.mockResolvedValue(offerEntity);

      const result = await new OfferRepository().retrieveById(offerEntity.id, offerEntity.company.id);

      expect(mockGet).toHaveBeenCalledWith({
        Key: {
          partitionKey: OfferKeyBuilders.buildPartitionKey(offerEntity.id),
          sortKey: OfferKeyBuilders.buildSortKey(offerEntity.company.id),
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntity);
    });
  });

  describe('getNonLocal', () => {
    DynamoDBService.query = mockQuery;
    it('should call "Query" method with correct parameters', async () => {
      const offerEntities = offerEntityFactory.buildList(3);
      mockQuery.mockResolvedValue(offerEntities);

      const result = await new OfferRepository().getNonLocal();

      expect(mockQuery).toHaveBeenCalledWith({
        IndexName: 'gsi1',
        KeyConditionExpression: 'gsi1PartitionKey = :local_value',
        ExpressionAttributeValues: { ':local_value': 'LOCAL-false' },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntities);
    });
  });

  describe('retrieveByCompanyId', () => {
    DynamoDBService.query = mockQuery;
    it('should call "Query" method with correct parameters', async () => {
      const companyId = 'companyId';
      const offerEntities = offerEntityFactory.buildList(3);
      mockQuery.mockResolvedValue(offerEntities);

      const result = await new OfferRepository().retrieveByCompanyId(companyId);

      expect(mockQuery).toHaveBeenCalledWith({
        IndexName: 'gsi2',
        KeyConditionExpression: 'gsi2PartitionKey = :company_id and begins_with(gsi2SortKey, :offer_prefix)',
        ExpressionAttributeValues: { ':company_id': `COMPANY-${companyId}`, ':offer_prefix': OFFER_PREFIX },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntities);
    });
  });

  describe('retriveByIds', () => {
    DynamoDBService.batchGet = mockBatchGet;
    it('should call "BatchGet" method with correct parameters', async () => {
      const offerEntity = offerEntityFactory.build();
      mockBatchGet.mockResolvedValue([offerEntity]);
      const companyId = 'companyId';
      const offerId = 'offerId';
      const result = await new OfferRepository().retrieveByIds([{ id: offerId, companyId }]);
      expect(mockBatchGet).toHaveBeenCalledWith(
        [
          {
            partitionKey: OfferKeyBuilders.buildPartitionKey(offerId),
            sortKey: OfferKeyBuilders.buildSortKey(companyId),
          },
        ],
        'search-offer-company-table',
      );
      expect(result).toEqual([offerEntity]);
    });

    it('should return empty array if no results', async () => {
      mockBatchGet.mockResolvedValue(undefined);
      const companyId = 'companyId';
      const offerId = 'offerId';
      const result = await new OfferRepository().retrieveByIds([{ id: offerId, companyId }]);
      expect(mockBatchGet).toHaveBeenCalledWith(
        [
          {
            partitionKey: OfferKeyBuilders.buildPartitionKey(offerId),
            sortKey: OfferKeyBuilders.buildSortKey(companyId),
          },
        ],
        'search-offer-company-table',
      );
      expect(result).toEqual([]);
    });
  });
});
