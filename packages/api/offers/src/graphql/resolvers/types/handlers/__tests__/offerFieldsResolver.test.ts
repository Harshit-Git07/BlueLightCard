
import { describe, test } from '@jest/globals'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { Logger } from '@aws-lambda-powertools/logger'
import { OfferFieldsResolver } from '../offerFieldsResolver'

describe('OfferFieldsResolver', () => {
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);
  const logger = new Logger({serviceName: 'test-service'});
  const brandTable = 'test-brand-table';
  const categoryTable = 'test-category-table';
  const offerTypeTable = 'test-offer-type-table';
  process.env.OFFER_TYPE_TABLE = offerTypeTable;

  const offerId = 'offerId123';

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should resolve categories for an offer', async () => {
    const mockCategoryConnectionResponse = {
      Items: [
        {offerId, categoryId: 'categoryId1'},
        {offerId, categoryId: 'categoryId2'}
      ]
    };
    const mockCategoryResponse = {
      Responses: {
        [categoryTable]: [
          {id: 'cat1', name: 'categoryName1'},
          {id: 'cat2', name: 'categoryName2'}
        ]
      }
    };

    mockDynamoDB.on(QueryCommand).resolves(mockCategoryConnectionResponse);
    mockDynamoDB.on(BatchGetCommand).resolves(mockCategoryResponse);
    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    const result = await resolver.resolveCategories();
    expect(result).toEqual(mockCategoryResponse.Responses[categoryTable]);

  });

  test('should throw an error if no category connection found for an offer', async () => {
    const mockCategoryConnectionResponse = {
      Items: []
    };
    mockDynamoDB.on(QueryCommand).resolves(mockCategoryConnectionResponse);

    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    await expect(resolver.resolveCategories()).rejects.toThrow('Offer categories connection not found');
  });

  test('should resolve brands for an offer', async () => {
    const mockBrandConnectionResponse = {
      Items: [
        {offerId, brandId: 'brandId1'},
        {offerId, brandId: 'brandId2'}
      ]
    };
    const mockBrandResponse = {
      Responses: {
        [brandTable]: [
          {id: 'brandId1', name: 'brandName1'},
          {id: 'brandId2', name: 'brandName2'}
        ]
      }
    };

    mockDynamoDB.on(QueryCommand).resolves(mockBrandConnectionResponse);
    mockDynamoDB.on(BatchGetCommand).resolves(mockBrandResponse);
    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    const result = await resolver.resolveBrands();
    expect(result).toEqual(mockBrandResponse.Responses[brandTable]);

  });

  test('should throw an error if no brands connection found for an offer', async () => {
    const mockBrandConnectionResponse = {
      Items: []
    };
    mockDynamoDB.on(QueryCommand).resolves(mockBrandConnectionResponse);

    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    await expect(resolver.resolveBrands()).rejects.toThrow('Offer brands connection not found');
  });


  test('should resolve types for an offer', async () => {
    const mockOfferTypeConnectionResponse = {
      Items: [
        {offerId, offerTypeId: 'offerTypeId1'},
        {offerId, offerTypeId: 'offerTypeId2'}
      ]
    };
    const mockOfferTypeResponse = {
      Responses: {
        [offerTypeTable]: [
          {id: 'offerTypeId1', name: 'offerTypeName1'},
          {id: 'offerTypeId2', name: 'offerTypeName2'}
        ]
      }
    };

    mockDynamoDB.on(QueryCommand).resolves(mockOfferTypeConnectionResponse);
    mockDynamoDB.on(BatchGetCommand).resolves(mockOfferTypeResponse);
    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    const result = await resolver.resolveTypes();
    expect(result).toEqual(mockOfferTypeResponse.Responses[offerTypeTable]);

  });

  test('should throw an error if no types connection found for an offer', async () => {
    const mockOfferTypeConnectionResponse = {
      Items: []
    };
    mockDynamoDB.on(QueryCommand).resolves(mockOfferTypeConnectionResponse);

    const resolver = new OfferFieldsResolver(offerId, categoryTable, brandTable, logger);
    await expect(resolver.resolveTypes()).rejects.toThrow('Offer types connection not found');
  });

});
