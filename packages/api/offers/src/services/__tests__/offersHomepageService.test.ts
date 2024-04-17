import 'reflect-metadata';
import { container } from 'tsyringe';
import { OffersHomepageService } from '../offersHomepageService';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { BLC_UK, TYPE_KEYS } from '../../utils/global-constants';
import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DI_KEYS } from '../../utils/diTokens';
import { faker } from '@faker-js/faker';
import { test } from '@jest/globals';

const tableName = 'tableName';
const dynamoMock = mockClient(DynamoDBDocumentClient);

describe('OffersHomepageService', () => {
  let homepageService: OffersHomepageService;

  beforeAll(() => {
    container.clearInstances();
    dynamoMock.reset();
  });

  beforeEach(() => {
    const mockedLogger = new LambdaLogger({ serviceName: `test` });
    container.register(Logger.key, { useValue: mockedLogger });
    container.register(DI_KEYS.OffersHomePageTable, { useValue: tableName });
    homepageService = container.resolve(OffersHomepageService);
  });

  test('should handle no companies found case', async () => {
    dynamoMock
      .on(GetCommand, {
        TableName: tableName,
      })
      .resolves({});

    const result = await homepageService.getCompanyMenu(BLC_UK, TYPE_KEYS.COMPANIES, false);

    expect(result).toEqual([]);
  });

  test('should return filtered companies when ageGated is true', async () => {
    const companies = [
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: true },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
    ];
    dynamoMock
      .on(GetCommand, {
        TableName: tableName,
      })
      .resolves({
        Item: { json: JSON.stringify(companies) },
      });

    const result = await homepageService.getCompanyMenu(BLC_UK, TYPE_KEYS.COMPANIES, true);

    expect(result).toHaveLength(1);
  });

  test('should return all companies when ageGated is false', async () => {
    const companies = [
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: true },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
      { id: faker.number.int(), name: faker.company.name(), isAgeGated: false },
    ];
    dynamoMock
      .on(GetCommand, {
        TableName: tableName,
      })
      .resolves({
        Item: { json: JSON.stringify(companies) },
      });

    const result = await homepageService.getCompanyMenu(BLC_UK, TYPE_KEYS.COMPANIES, false);

    expect(result).toHaveLength(3);
  });

  test('should handle DynamoDB errors gracefully', async () => {
    dynamoMock.on(GetCommand).rejects(new Error('Failed to retrieve data from DynamoDB'));

    try {
      const result = await homepageService.getCompanyMenu(BLC_UK, TYPE_KEYS.COMPANIES, false);
      // If the method does not throw, this is an error in test logic
      fail('Expected method to throw, but it did not');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to retrieve data from DynamoDB');
    }
  });

  test("should handle no categories found case'", async () => {
    dynamoMock
      .on(GetCommand, {
        TableName: tableName,
      })
      .resolves({});

    const result = await homepageService.getCategoryMenu(BLC_UK, TYPE_KEYS.CATEGORIES);

    expect(result).toEqual([]);
  });

  test('should return all categories', async () => {
    const categories = [
      { id: faker.number.int(), name: faker.commerce.department() },
      { id: faker.number.int(), name: faker.commerce.department() },
      { id: faker.number.int(), name: faker.commerce.department() },
    ];
    dynamoMock
      .on(GetCommand, {
        TableName: tableName,
      })
      .resolves({
        Item: { json: JSON.stringify(categories) },
      });

    const result = await homepageService.getCategoryMenu(BLC_UK, TYPE_KEYS.CATEGORIES);

    expect(result).toHaveLength(3);
  });

  test('should handle DynamoDB errors gracefully', async () => {
    dynamoMock.on(GetCommand).rejects(new Error('Failed to retrieve data from DynamoDB'));

    try {
      const result = await homepageService.getCategoryMenu(BLC_UK, TYPE_KEYS.CATEGORIES);
      // If the method does not throw, this is an error in test logic
      fail('Expected method to throw, but it did not');
    } catch (error) {
      expect((error as Error).message).toBe('Failed to retrieve data from DynamoDB');
    }
  });
});
