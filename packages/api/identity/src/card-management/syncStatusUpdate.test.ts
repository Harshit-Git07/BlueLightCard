import { describe, expect, test } from '@jest/globals';
import { QueryCommandOutput } from '@aws-sdk/lib-dynamodb';
import { handler } from './syncStatusUpdate';
import { CardService } from 'src/services/CardService';
import { Logger } from '@aws-lambda-powertools/logger';

jest.mock('src/helpers/DLQ');
jest.mock('src/services/CardService');
jest.mock('@aws-lambda-powertools/logger');

const mockError = jest.fn();

describe('Sync User Card Status Data', () => {
  let mockLogger: any;
  beforeEach(() => {
    jest.resetAllMocks();
    mockLogger = new Logger({
    serviceName: 'mock-syncCardStatusUpdate',
        logLevel: 'DEBUG',
      });
      mockLogger.error = mockError;
      const cardService = new CardService('tableName', 'region');
    });

  afterAll(() => {
    jest.clearAllMocks();
  })
    
    test('Returns 400 with message when brand is missing', async () => {
        const res = await handler(
          {
            headers: {},
            detail: {}
          },
          {},
        );
        expect(res).toEqual({
            statusCode: 400, 
            body: JSON.stringify({message: 'Please provide brand details'}),
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*' 
          },
          });
      });

    test('Returns 400 with message when invalid brand', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'test_brand_name'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Please provide a valid brand' })
        });
    });

    test('Returns 400 with message when uuid is missing', async () => {
        
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk', cardNumber: 90}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Required parameters are missing' })
        });
    });

    test('Returns 400 with message when cardNumber is missing', async () => {
        const res = await handler(
            {
                headers: {},
                body: { },
                detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo'}
            },
            {},
        );
        expect(res).toEqual({
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' 
            },
            statusCode: 400, body: JSON.stringify({ message: 'Required parameters are missing' })
        });
    });
    test('returns 200 when parameters are not missing', async () => {
      const mockResponse: QueryCommandOutput = {
        $metadata: {},
        Items: [],
        Count: 1,
        ScannedCount: 1
      };
      
      jest.spyOn(CardService.prototype, 'getUserCurrentCard').mockResolvedValueOnce(mockResponse);
      jest.spyOn(CardService.prototype, 'updateUsersCard').mockResolvedValueOnce(mockResponse);

      const res = await handler(
        {
            headers: {},
            body: { },
            detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo', cardNumber: '1', cardStatus: '1'}
        },
        {},
      );
      expect(res).toEqual({
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
        },
        statusCode: 200, body: JSON.stringify({ message: 'user card data updated' })
      });
    });

      test('should return error when issue with cardservice.getUserCurrentCard', async () => {
        const mockResponse: QueryCommandOutput = {
          $metadata: {},
          Items: [],
          Count: 1,
          ScannedCount: 1
        };
        const error = new Error('Issue with getUserCurrent');
        jest.spyOn(CardService.prototype, 'getUserCurrentCard').mockRejectedValue(error);
        const mockLogger = jest.spyOn(Logger.prototype, 'error');
        await handler({
              headers: {},
              body: { },
              detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo', cardNumber: '1', cardStatus: '1'}
          },
          {},
        );
        expect(mockLogger).toHaveBeenCalledWith('error querying user card data', { uuid:'pk-6y3yjd6-bysh22-kdhfo', err:error });
      });
      
      test('should return error when issue with cardservice.updateUsersCard', async () => {
        const mockResponse: QueryCommandOutput = {
          $metadata: {},
          Items: [],
          Count: 1,
          ScannedCount: 1
        };
        const error = new Error('Issue with updateUsersCard');
        jest.spyOn(CardService.prototype, 'getUserCurrentCard').mockResolvedValueOnce(mockResponse);
        jest.spyOn(CardService.prototype, 'updateUsersCard').mockRejectedValue(error);
        const mockLogger = jest.spyOn(Logger.prototype, 'error');
        const res = await handler(
          {
              headers: {},
              body: { },
              detail: { brand: 'blc_uk', uuid: 'pk-6y3yjd6-bysh22-kdhfo', cardNumber: '1', cardStatus: '1'}
          },
          {},
        );
        expect(mockLogger).toHaveBeenCalledWith('error syncing user card data', { uuid:'pk-6y3yjd6-bysh22-kdhfo', err:error });
      });   
});
