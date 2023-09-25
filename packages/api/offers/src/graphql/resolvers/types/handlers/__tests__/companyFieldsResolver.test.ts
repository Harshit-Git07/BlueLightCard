
import { describe, test } from '@jest/globals'
import { BatchGetCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import { Logger } from '@aws-lambda-powertools/logger'
import { CompanyFieldsResolver } from '../companyFieldsResolver'

describe('CompanyFieldsResolver', () => {
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);
  const logger = new Logger({serviceName: 'test-service'});
  const brandTable = 'test-brand-table';
  const categoryTable = 'test-category-table';
  const companyId = 'companyId123';

  afterEach(() => {
    mockDynamoDB.reset();
  });

  test('should resolve categories for a company', async () => {
    const mockCompanyCategoryConnectionResponse = {
      Items: [
        {companyId, categoryId: 'categoryId1'},
        {companyId, categoryId: 'categoryId2'}
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

    mockDynamoDB.on(QueryCommand).resolves(mockCompanyCategoryConnectionResponse);
    mockDynamoDB.on(BatchGetCommand).resolves(mockCategoryResponse);
    const resolver = new CompanyFieldsResolver(companyId, categoryTable, brandTable, logger);
    const result = await resolver.resolveCategories();
    expect(result).toEqual(mockCategoryResponse.Responses[categoryTable]);

  });

  test('should throw an error if no company category connection found for a company', async () => {
    const mockCompanyCategoryConnectionResponse = {
      Items: []
    };
    mockDynamoDB.on(QueryCommand).resolves(mockCompanyCategoryConnectionResponse);

    const resolver = new CompanyFieldsResolver(companyId, categoryTable, brandTable, logger);
    await expect(resolver.resolveCategories()).rejects.toThrow('Company categories connection not found');
  });

  test('should resolve brands for a company', async () => {
    const mockCompanyBrandConnectionResponse = {
      Items: [
        {companyId, brandId: 'brandId1'},
        {companyId, brandId: 'brandId2'}
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

    mockDynamoDB.on(QueryCommand).resolves(mockCompanyBrandConnectionResponse);
    mockDynamoDB.on(BatchGetCommand).resolves(mockBrandResponse);
    const resolver = new CompanyFieldsResolver(companyId, categoryTable, brandTable, logger);
    const result = await resolver.resolveBrands();
    expect(result).toEqual(mockBrandResponse.Responses[brandTable]);

  });

  test('should throw an error if no brands connection found for a company', async () => {
    const mockCompanyBrandConnectionResponse = {
      Items: []
    };
    mockDynamoDB.on(QueryCommand).resolves(mockCompanyBrandConnectionResponse);

    const resolver = new CompanyFieldsResolver(companyId, categoryTable, brandTable, logger);
    await expect(resolver.resolveBrands()).rejects.toThrow('Company brands connection not found');
  });

});
