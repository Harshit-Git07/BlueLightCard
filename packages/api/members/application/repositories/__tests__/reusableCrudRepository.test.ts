import { DynamoDB } from 'aws-sdk';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';
import { ReusableCrudRepository } from '../reusableCrudRepository';

jest.mock('aws-sdk');

describe('ReusableCrudRepository', () => {
  let repository: ReusableCrudRepository<any, any>;
  let mockDynamoDB: jest.Mocked<DynamoDB.DocumentClient>;
  let mockZodType: jest.Mocked<NamedZodType<z.ZodEffects<z.ZodObject<any>>>>;
  let tableName: string;

  beforeEach(() => {
    mockDynamoDB = new DynamoDB.DocumentClient() as jest.Mocked<DynamoDB.DocumentClient>;
    mockZodType = {
      parse: jest.fn(),
    } as unknown as jest.Mocked<NamedZodType<z.ZodEffects<z.ZodObject<any>>>>;

    tableName = 'testTable';

    repository = new ReusableCrudRepository(mockDynamoDB, tableName, mockZodType, 'PK', 'SK');
  });

  describe('upsert', () => {
    it('should successfully insert a new entity', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      } as any);

      await repository.upsert(query, payload, true);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockDynamoDB.update).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: 'PK#123',
          sk: 'SK#456',
        },
        UpdateExpression: 'SET Data = :data ',
        ConditionExpression: 'pk <> :pk OR sk <> :sk',
        ExpressionAttributeValues: {
          ':data': 'test',
          ':pk': 'PK#123',
          ':sk': 'SK#456',
        },
      });
    });

    it('should successfully update an existing entity', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.update.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      } as any);

      await repository.upsert(query, payload, false);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockDynamoDB.update).toHaveBeenCalledWith({
        TableName: tableName,
        Key: {
          pk: 'PK#123',
          sk: 'SK#456',
        },
        UpdateExpression: 'SET Data = :data ',
        ConditionExpression: 'pk = :pk AND sk = :sk',
        ExpressionAttributeValues: {
          ':data': 'test',
          ':pk': 'PK#123',
          ':sk': 'SK#456',
        },
      });
    });

    it('should throw an error if validation fails', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockImplementation(() => {
        throw new Error('Validation error');
      });

      await expect(repository.upsert(query, payload, true)).rejects.toThrow('Validation error');

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
    });

    it('should throw an error if DynamoDB update fails', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
        brand: 'blc-uk',
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.update.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
      } as any);

      await expect(repository.upsert(query, payload, true)).rejects.toThrow('DynamoDB error');

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
    });
  });
});
