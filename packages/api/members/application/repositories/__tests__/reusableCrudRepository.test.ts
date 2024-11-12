import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';
import { ReusableCrudRepository } from '../reusableCrudRepository';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

describe('ReusableCrudRepository', () => {
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);
  let repository: ReusableCrudRepository<any, any>;
  let mockZodType: jest.Mocked<NamedZodType<z.ZodEffects<z.ZodObject<any>>>>;
  let tableName: string;

  beforeEach(() => {
    mockZodType = {
      parse: jest.fn(),
    } as unknown as jest.Mocked<NamedZodType<z.ZodEffects<z.ZodObject<any>>>>;

    tableName = 'testTable';

    repository = new ReusableCrudRepository(
      mockDynamoDB as any,
      tableName,
      mockZodType as any,
      'PK',
      'SK',
    );
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  describe('upsert', () => {
    it('should successfully insert a new entity', async () => {
      const query: ReusableCrudQueryPayload = {
        pk: '123',
        sk: '456',
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.on(UpdateCommand).resolves({});

      await repository.upsert(query, payload, true);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockDynamoDB).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: tableName,
        Key: {
          pk: 'PK#123',
          sk: 'SK#456',
        },
        UpdateExpression: 'SET data = :data ',
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
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.on(UpdateCommand).resolves({});

      await repository.upsert(query, payload, false);

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
      expect(mockDynamoDB).toHaveReceivedCommandWith(UpdateCommand, {
        TableName: tableName,
        Key: {
          pk: 'PK#123',
          sk: 'SK#456',
        },
        UpdateExpression: 'SET data = :data ',
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
      };
      const payload = { data: 'test' };

      mockZodType.parse.mockReturnValue({ success: true });
      mockDynamoDB.on(UpdateCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.upsert(query, payload, true)).rejects.toThrow('DynamoDB error');

      expect(mockZodType.parse).toHaveBeenCalledWith({
        pk: 'PK#123',
        sk: 'SK#456',
        ...payload,
      });
    });
  });
});
