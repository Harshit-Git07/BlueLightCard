import process from 'process';

import { eventEntityFactory } from '@blc-mono/discovery/application/factories/EventEntityFactory';
import { EventKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { EventRepository } from './EventRepository';

jest.mock('@blc-mono/discovery/application/services/DynamoDbService');

describe('Event Repository', () => {
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
  const mockDelete = jest.fn().mockResolvedValue(() => Promise.resolve());
  const mockGet = jest.fn();
  const mockBatchGet = jest.fn();

  describe('insert', () => {
    it('should call "Put" method with correct parameters', async () => {
      DynamoDBService.put = mockSave;
      const eventEntity = eventEntityFactory.build();

      await new EventRepository().insert(eventEntity);

      expect(mockSave).toHaveBeenCalledWith({
        Item: eventEntity,
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('delete', () => {
    DynamoDBService.delete = mockDelete;
    it('should call "Delete" method with correct parameters', async () => {
      const entity = eventEntityFactory.build();

      await new EventRepository().delete(entity.id, entity.venue.id);

      expect(mockDelete).toHaveBeenCalledWith({
        Key: {
          partitionKey: EventKeyBuilders.buildPartitionKey(entity.id),
          sortKey: EventKeyBuilders.buildSortKey(entity.venue.id),
        },
        TableName: 'search-offer-company-table',
      });
    });
  });

  describe('retrieveById', () => {
    DynamoDBService.get = mockGet;
    it('should call "Get" method with correct parameters', async () => {
      const entity = eventEntityFactory.build();
      mockGet.mockResolvedValue(entity);

      const result = await new EventRepository().retrieveById(entity.id, entity.venue.id);

      expect(mockGet).toHaveBeenCalledWith({
        Key: {
          partitionKey: EventKeyBuilders.buildPartitionKey(entity.id),
          sortKey: EventKeyBuilders.buildSortKey(entity.venue.id),
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(entity);
    });
  });

  describe('retriveByIds', () => {
    DynamoDBService.batchGet = mockBatchGet;
    it('should call "BatchGet" method with correct parameters', async () => {
      const entity = eventEntityFactory.build();
      mockBatchGet.mockResolvedValue([entity]);
      const venueId = 'venueId';
      const id = 'eventId';
      const result = await new EventRepository().retrieveByIds([{ id, venueId }]);
      expect(mockBatchGet).toHaveBeenCalledWith(
        [
          {
            partitionKey: EventKeyBuilders.buildPartitionKey(id),
            sortKey: EventKeyBuilders.buildSortKey(venueId),
          },
        ],
        'search-offer-company-table',
      );
      expect(result).toEqual([entity]);
    });

    it('should return empty array if no results', async () => {
      mockBatchGet.mockResolvedValue(undefined);
      const venueId = 'venueId';
      const id = 'eventId';
      const result = await new EventRepository().retrieveByIds([{ id, venueId }]);
      expect(mockBatchGet).toHaveBeenCalledWith(
        [
          {
            partitionKey: EventKeyBuilders.buildPartitionKey(id),
            sortKey: EventKeyBuilders.buildSortKey(venueId),
          },
        ],
        'search-offer-company-table',
      );
      expect(result).toEqual([]);
    });
  });
});
