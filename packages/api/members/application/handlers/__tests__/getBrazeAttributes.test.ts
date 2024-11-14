import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../braze/getBrazeAttributes';
//prettier comment

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../braze/brazeClass', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setApiKey: jest.fn().mockResolvedValue('apiKey'),
    getUserNotFoundString: jest.fn().mockResolvedValue('user not found'),
    getAttributes: jest.fn().mockImplementation((uuid) => {
      if (uuid === 'correct uuid') {
        return {
          sms_subscribe: 'unsubscribed',
          marketing_opt_ins: ['Analytics', 'NightwatchTests', 'Personalised offers'],
          email_subscribe: 'unsubscribed',
        };
      } else if (uuid === 'error retrieving') {
        throw new Error();
      } else if (uuid === 'incorrect uuid') {
        return 'user not found';
      }
    }),
  })),
}));

describe('Get braze attributes Lambda Handler', () => {
  let mockHandler: (
    event: APIGatewayProxyEvent,
    context: Context,
  ) => Promise<APIGatewayProxyResult>;
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: Context;

  beforeAll(async () => {
    mockHandler = handler;
  });

  beforeEach(() => {
    mockContext = {} as Context;
    jest.clearAllMocks();
  });

  it('should fail as it has not recieved a body', async () => {
    const body = undefined;
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing body required',
          source: 'getBrazeAttributes',
        },
      ],
      message: 'Error: Missing body required',
    });
  });

  it('should fail as it has not recieved a uuid within body', async () => {
    const body = JSON.stringify({
      memberUUID: undefined,
      brand: 'BLC_UK',
      attributes: ['sms_subscribe', 'marketing_opt_ins', 'email_subscribe'],
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required body parameters',
          source: 'getBrazeAttributes',
        },
      ],
      message: 'Error: Missing required body parameters',
    });
  });

  it('should fail as it has not recieved a brand within body', async () => {
    const body = JSON.stringify({
      memberUUID: 'correct uuid',
      brand: undefined,
      attributes: ['sms_subscribe', 'marketing_opt_ins', 'email_subscribe'],
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required body parameters',
          source: 'getBrazeAttributes',
        },
      ],
      message: 'Error: Missing required body parameters',
    });
  });

  it('should fail as it has not recieved attributes within body', async () => {
    const body = JSON.stringify({
      memberUUID: 'correct uuid',
      brand: 'BLC_UK',
      attributes: undefined,
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'No attributes passed',
          source: 'getBrazeAttributes',
        },
      ],
      message: 'Error: No attributes passed',
    });
  });

  it('should handle if a user is not found', async () => {
    const body = JSON.stringify({
      memberUUID: 'incorrect uuid',
      brand: 'BLC_UK',
      attributes: ['sms_subscribe', 'marketing_opt_ins', 'email_subscribe'],
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ data: 'user not found', success: true });
  });

  it('should fail gracefully if failed to fetch', async () => {
    const body = JSON.stringify({
      memberUUID: 'error retrieving',
      brand: 'BLC_UK',
      attributes: ['sms_subscribe', 'marketing_opt_ins', 'email_subscribe'],
      error: true,
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      success: false,
      message: 'Could not retrieve attributes (EL01)',
    });
  });

  //happy path
  it('should return attributes successfully', async () => {
    const body = JSON.stringify({
      memberUUID: 'correct uuid',
      brand: 'BLC_UK',
      attributes: ['sms_subscribe', 'marketing_opt_ins', 'email_subscribe'],
    });
    mockEvent = {
      body,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      success: true,
      data: {
        sms_subscribe: 'unsubscribed',
        marketing_opt_ins: ['Analytics', 'NightwatchTests', 'Personalised offers'],
        email_subscribe: 'unsubscribed',
      },
    });
  });
});
