import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Response } from '../../utils/restResponse/response';
import { ReusableCrudService } from '../../services/reusableCrudService';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';
import { ReusableCrudQueryMapper } from '../../utils/mappers/reusableCrudQueryMapper';
import { handler } from './../reusableCrudGetHandler';
import { ReusableCrudRepository } from '../../repositories/reusableCrudRepository';
import { mockClient } from 'aws-sdk-client-mock';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../services/reusableCrudService');
jest.mock('../../utils/restResponse/response');
jest.mock('../../utils/mappers/reusableCrudQueryMapper');

describe('reusableCrudGetHandler', () => {
  let mockLogger: jest.Mocked<Logger>;
  let mockCrudService: jest.Mocked<ReusableCrudService<any, any>>;
  let mockResponse: jest.Mocked<typeof Response>;
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    mockLogger = new Logger() as jest.Mocked<Logger>;
    const mockRepository = {
      // Mock the methods of ReusableCrudRepository as needed
      create: jest.fn(),
      read: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      query: jest.fn(),
    } as unknown as jest.Mocked<ReusableCrudRepository<any, any>>;
    mockCrudService = new ReusableCrudService(
      'TestEntity',
      {} as NamedZodType<z.ZodEffects<z.ZodObject<any>>>,
      'PK',
      'SK',
      mockLogger,
      mockDynamoDB as any,
      'testTable',
      mockRepository,
    ) as jest.Mocked<ReusableCrudService<any, any>>;
    mockResponse = Response as jest.Mocked<typeof Response>;

    process.env.SERVICE = 'testService';
    process.env.ENTITY_NAME = 'TestEntity';
    process.env.ENTITY_COLLECTION_NAME = 'testEntities';
    process.env.PK_PREFIX = 'PK';
    process.env.SK_PREFIX = 'SK';
    process.env.PK_QUERY_KEY = 'pk';
    process.env.SK_QUERY_KEY = 'sk';
    process.env.ENTITY_TABLE_NAME = 'testTable';
    process.env.REGION = 'eu-west-2';
    process.env.PAYLOAD_TYPE_NAME = 'TestPayloadType';
    process.env.MODEL_NAME = 'TestModel';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully retrieve entities', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: 'PK#123', sk: 'SK#456' },
    } as any;

    const query: ReusableCrudQueryPayload = { pk: 'PK#123', sk: 'SK#456' };
    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);

    (Response.OK as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'TestEntity updated successfully' }),
    });

    ReusableCrudService.prototype.get = jest.fn().mockResolvedValue([{ data: 'test' }]);

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
  });

  it('should return bad request if required query parameters are missing', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { sk: '123' },
    } as any;

    const query: ReusableCrudQueryPayload = { pk: '', sk: '123' };
    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);

    (Response.BadRequest as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: JSON.stringify({ message: 'Validation error' }),
    });

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('should return not found (404) if retrieval fails', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: 'PK#123', sk: 'SK#456' },
    } as any;
    const query: ReusableCrudQueryPayload = { pk: 'PK#123', sk: 'SK#456' };

    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);
    (Response.OK as jest.Mock).mockImplementation(() => {
      throw new Error('Error');
    });

    (Response.NotFound as jest.Mock).mockReturnValue({
      statusCode: 404,
      body: JSON.stringify({ message: 'Error' }),
    });

    ReusableCrudService.prototype.get = jest.fn().mockResolvedValue([]);

    const result = (await handler(event)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(404);
  });
});
