import {
  APIGatewayEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Response } from '../../utils/restResponse/response';
import { ReusableCrudService } from '../../services/reusableCrudService';
import { NamedZodType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';
import { z } from 'zod';
import { ReusableCrudQueryPayload } from '../../types/reusableCrudQueryPayload';
import { ReusableCrudQueryMapper } from '../../utils/mappers/reusableCrudQueryMapper';
import { validateRequest } from '../../utils/requestValidator';
import { ReusableCrudRepository } from '../../repositories/reusableCrudRepository';
import { mockClient } from 'aws-sdk-client-mock';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../services/reusableCrudService');
jest.mock('../../utils/restResponse/response');
jest.mock('../../utils/mappers/reusableCrudQueryMapper');
jest.mock('../../utils/requestValidator');
jest.mock('../../services/promoCodesService');

describe('reusableCrudUpdateHandler', () => {
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);
  const mockValidatePromoCode = jest.fn();
  PromoCodesService.prototype.validatePromoCode = mockValidatePromoCode;
  let mockLogger: jest.Mocked<Logger>;
  let mockCrudService: jest.Mocked<ReusableCrudService<any, any>>;
  let mockResponse: jest.Mocked<typeof Response>;

  let handler: APIGatewayProxyHandler;
  let mockContext: Context;

  beforeAll(async () => {
    const orgModule = await import('../../handlers/reusableCrudUpdateHandler');
    handler = orgModule.handler;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockContext = {} as Context;
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

  it('should successfully update entity', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: '123', sk: '456' },
      body: JSON.stringify({ data: 'test' }),
      httpMethod: 'PUT',
    } as any;
    const query: ReusableCrudQueryPayload = { pk: 'PK#123', sk: 'SK#456' };

    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);
    (validateRequest as jest.Mock).mockReturnValue({ body: { data: 'test' } });

    (Response.OK as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify({ message: 'TestEntity updated successfully' }),
    });

    const context = {} as any;
    const result = await handler(event, context, () => {});

    expect(mockValidatePromoCode).not.toHaveBeenCalled();
    expect(result!.statusCode).toBe(200);
    expect(result!.body).toBe(JSON.stringify({ message: 'TestEntity updated successfully' }));
  });

  it('should return bad request if required query parameters are missing', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: '123' },
    } as any;

    const context = {} as any;
    const callback = jest.fn();

    const query: ReusableCrudQueryPayload = { pk: 'PK#123', sk: '' };
    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);

    (Response.BadRequest as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required query parameters' }),
    });

    const result = (await handler(event, context, callback)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
  });

  it('should return validation errors if request validation fails', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: '123', sk: '456' },
      body: JSON.stringify({ data: 'test' }),
      httpMethod: 'PUT',
    } as any;

    (validateRequest as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: JSON.stringify({ message: 'Validation error' }),
    });

    (Response.BadRequest as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: JSON.stringify({ message: 'Validation error' }),
    });

    const context = {} as any;
    const callback = jest.fn();
    const result = (await handler(event, context, () => {})) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(JSON.stringify({ message: 'Validation error' }));
  });

  it('should return errors if update fails', async () => {
    const event: APIGatewayEvent = {
      pathParameters: { pk: 'PK#123', sk: 'SK#456' },
      body: JSON.stringify({ data: 'test' }),
      httpMethod: 'PUT',
    } as any;
    const query: ReusableCrudQueryPayload = { pk: 'PK#123', sk: 'SK#456' };

    (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);
    (validateRequest as jest.Mock).mockReturnValue({ body: { data: 'test' } });
    mockCrudService.upsert.mockImplementation(async () => {
      throw new Error('Error');
    });

    (Response.OK as jest.Mock).mockImplementation(() => {
      throw new Error('Error');
    });

    (Response.Error as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: JSON.stringify({ message: 'Validation error' }),
    });

    const context = {} as any;
    const result = (await handler(event, context, () => {})) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
  });

  describe('and the request body includes promo code', () => {
    it('expect validate promo code to be called', async () => {
      const event: APIGatewayEvent = {
        pathParameters: {
          pk: '86112105-6268-4ac4-a17a-83d32fd7f2b3',
          sk: '302a3bf8-5b55-468c-8403-baf6492751a3',
        },
        body: JSON.stringify({ promoCode: 'CODE123' }),
        httpMethod: 'PUT',
      } as any;
      const query: ReusableCrudQueryPayload = {
        pk: 'PK#86112105-6268-4ac4-a17a-83d32fd7f2b3',
        sk: 'SK#302a3bf8-5b55-468c-8403-baf6492751a3',
      };
      const mockPromoCodeResponse = {
        bypassPayment: true,
        bypassVerification: false,
      };
      const context = {} as any;
      (ReusableCrudQueryMapper.fromPathParameters as jest.Mock).mockReturnValue(query);
      (validateRequest as jest.Mock).mockReturnValue({
        memberUuid: 'memberUuid',
        body: JSON.parse(<string>event!.body),
      });
      (Response.OK as jest.Mock).mockReturnValue({
        statusCode: 200,
        body: JSON.stringify({ message: 'Promo code updated successfully' }),
      });
      mockValidatePromoCode.mockResolvedValue(mockPromoCodeResponse);

      const result = await handler(event, context, () => {});

      expect(mockValidatePromoCode).toHaveBeenCalled();
      expect(result!.statusCode).toBe(200);
      expect(result!.body).toBe(JSON.stringify({ message: 'Promo code updated successfully' }));
    });
  });
});
