import { Logger } from '@aws-lambda-powertools/logger';
import { APIError } from '../../models/APIError';
import { ReusableCrudRepository } from '../../repositories/reusableCrudRepository';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';
import { ReusableCrudService } from '../reusableCrudService';

jest.mock('../../repositories/reusableCrudRepository');
jest.mock('@aws-lambda-powertools/logger');

describe('ReusableCrudService', () => {
  let service: ReusableCrudService<any, any>;
  let mockRepository: jest.Mocked<ReusableCrudRepository<any, any>>;
  let mockLogger: jest.Mocked<Logger>;
  let mockZodType: NamedZodType<z.ZodEffects<z.ZodObject<any>>>;
  let dynamoDB: AWS.DynamoDB.DocumentClient;
  let tableName: string;

  beforeEach(() => {
    mockRepository = new ReusableCrudRepository(
      dynamoDB,
      tableName,
      mockZodType,
      'PK',
      'SK',
    ) as jest.Mocked<ReusableCrudRepository<any, any>>;
    mockLogger = new Logger() as jest.Mocked<Logger>;
    mockZodType = {
      parse: jest.fn() as jest.Mock,
    } as unknown as NamedZodType<z.ZodEffects<z.ZodObject<any>>>;

    dynamoDB = {} as AWS.DynamoDB.DocumentClient;
    tableName = 'testTable';

    service = new ReusableCrudService(
      'TestEntity',
      mockZodType,
      'PK',
      'SK',
      mockLogger,
      dynamoDB,
      tableName,
      mockRepository,
    );
  });

  describe('upsert', () => {
    it('should successfully insert a new entity', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };
      const errorSet: APIError[] = [];

      (mockZodType.parse as jest.Mock).mockReturnValue(true);
      mockRepository.upsert.mockResolvedValue();

      await service.upsert(query, payload, true, errorSet);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });

      expect(mockLogger.info).toHaveBeenCalledWith('Successfully created TestEntity', { query });
    });

    it('should successfully update an existing entity', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };
      const errorSet: APIError[] = [];

      (mockZodType.parse as jest.Mock).mockReturnValue(true);
      mockRepository.upsert.mockResolvedValue();

      await service.upsert(query, payload, false, errorSet);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });

      expect(mockLogger.info).toHaveBeenCalledWith('Successfully updated TestEntity', { query });
    });

    it('should throw an error if validation fails', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };
      const errorSet: APIError[] = [];

      (mockZodType.parse as jest.Mock).mockImplementation(() => {
        throw new Error('Validation error');
      });

      await expect(service.upsert(query, payload, true, errorSet)).rejects.toThrow(
        'Validation error',
      );

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockLogger.error).toHaveBeenCalledWith('Unknown error creating TestEntity:', {
        error: new Error('Validation error'),
      });
    });

    it('should throw an error if repository upsert fails', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };
      const errorSet: APIError[] = [];

      (mockZodType.parse as jest.Mock).mockReturnValue(true);

      const error = new Error('Repository error');

      mockRepository.upsert.mockImplementation(() => {
        throw error;
      });

      await expect(service.upsert(query, payload, true, errorSet)).rejects.toThrow(error);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockLogger.error).toHaveBeenCalledWith('Unknown error creating TestEntity:', {
        error: new Error('Repository error'),
      });
    });
  });
});
