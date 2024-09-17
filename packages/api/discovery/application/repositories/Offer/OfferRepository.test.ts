import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import process from 'process';

import { offerEntityFactory } from '@blc-mono/discovery/application/factories/OfferEntityFactory';
import { OfferRepository } from '@blc-mono/discovery/application/repositories/Offer/OfferRepository';
import { OfferKeyBuilders } from '@blc-mono/discovery/application/repositories/schemas/OfferEntity';
import { DynamoDBService } from '@blc-mono/discovery/application/services/DynamoDbService';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

import { OFFER_PREFIX } from '../constants/PrimaryKeyPrefixes';

describe('Offer Repository', () => {
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
      const offerEntity = offerEntityFactory.build();
      putSpy.mockResolvedValue(offerEntity);

      const result = await new OfferRepository().insert(offerEntity);

      expect(putSpy).toHaveBeenCalledWith({
        Item: offerEntity,
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntity);
    });
  });

  describe('delete', () => {
    const deleteSpy = jest.spyOn(DynamoDBService.prototype, 'delete');

    it('should call "Delete" method with correct parameters', async () => {
      const offerEntity = offerEntityFactory.build();
      deleteSpy.mockResolvedValue(offerEntity);

      const result = await new OfferRepository().delete(offerEntity.id, offerEntity.company.id);

      expect(deleteSpy).toHaveBeenCalledWith({
        Key: {
          partitionKey: OfferKeyBuilders.buildPartitionKey(offerEntity.id),
          sortKey: OfferKeyBuilders.buildSortKey(offerEntity.company.id),
        },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntity);
    });
  });

  describe('retrieveById', () => {
    const getSpy = jest.spyOn(DynamoDBService.prototype, 'get');

    it('should call "Get" method with correct parameters', async () => {
      const offerEntity = offerEntityFactory.build();
      getSpy.mockResolvedValue(offerEntity);

      const result = await new OfferRepository().retrieveById(offerEntity.id, offerEntity.company.id);

      expect(getSpy).toHaveBeenCalledWith({
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
    const querySpy = jest.spyOn(DynamoDBService.prototype, 'query');

    it('should call "Query" method with correct parameters', async () => {
      const offerEntities = offerEntityFactory.buildList(3);
      querySpy.mockResolvedValue(offerEntities);

      const result = await new OfferRepository().getNonLocal();

      expect(querySpy).toHaveBeenCalledWith({
        IndexName: 'gsi1',
        KeyConditionExpression: 'gsi1PartitionKey = :local_value',
        ExpressionAttributeValues: { ':local_value': 'LOCAL-false' },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntities);
    });
  });

  describe('retrieveByCompanyId', () => {
    const querySpy = jest.spyOn(DynamoDBService.prototype, 'query');

    it('should call "Query" method with correct parameters', async () => {
      const companyId = 'companyId';
      const offerEntities = offerEntityFactory.buildList(3);
      querySpy.mockResolvedValue(offerEntities);

      const result = await new OfferRepository().retrieveByCompanyId(companyId);

      expect(querySpy).toHaveBeenCalledWith({
        IndexName: 'gsi2',
        KeyConditionExpression: 'gsi2PartitionKey = :company_id and begins_with(gsi2SortKey, :offer_prefix)',
        ExpressionAttributeValues: { ':company_id': `COMPANY-${companyId}`, ':offer_prefix': OFFER_PREFIX },
        TableName: 'search-offer-company-table',
      });
      expect(result).toEqual(offerEntities);
    });
  });
});
