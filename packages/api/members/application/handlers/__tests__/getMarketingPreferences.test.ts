import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../braze/getMarketingPreferences';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../braze/brazeClass', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    setApiKey: jest.fn().mockResolvedValue('apiKey'),
    getUserNotFoundString: jest.fn().mockResolvedValue('user not found'),
    retrieveMarketingPreferences: jest.fn().mockImplementation((uuid) => {
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
    const pathParameters = undefined;
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    mockContext = {} as Context;
    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required query parameters',
          source: 'getMarketingPreferences',
        },
      ],
      message: 'Error: Missing required query parameters',
    });
  });

  it('should fail as it has not recieved a uuid as a query parameter', async () => {
    const pathParameters = {
      memberUUID: undefined,
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required query parameters',
          source: 'getMarketingPreferences',
        },
      ],
      message: 'Error: Missing required query parameters',
    });
  });

  it('should fail as it has not recieved a brand a query parameter', async () => {
    const pathParameters = {
      memberUUID: undefined,
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required query parameters',
          source: 'getMarketingPreferences',
        },
      ],
      message: 'Error: Missing required query parameters',
    });
  });

  it('should fail as it has not recieved a version in the query string', async () => {
    const pathParameters = {
      memberUUID: undefined,
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      errors: [
        {
          code: 'ERR002',
          detail: 'Missing required query parameters',
          source: 'getMarketingPreferences',
        },
      ],
      message: 'Error: Missing required query parameters',
    });
  });

  it('should handle if a user is not found', async () => {
    const pathParameters = {
      memberUUID: 'incorrect uuid',
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ data: 'user not found', success: true });
  });

  it('should fail gracefully if failed to fetch', async () => {
    const pathParameters = {
      memberUUID: 'error retrieving',
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      success: false,
      message: 'Could not retrieve marketing preferences (EL01)',
    });
  });

  //happy path
  it('should return attributes successfully', async () => {
    const pathParameters = {
      memberUUID: 'correct uuid',
      brand: 'BLC_UK',
      version: 'web',
    };
    mockEvent = {
      pathParameters,
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

  it('should return attributes successfully mobile version', async () => {
    const pathParameters = {
      memberUUID: 'correct uuid',
      brand: 'BLC_UK',
      version: 'mobile',
    };
    mockEvent = {
      pathParameters,
    } as unknown as APIGatewayProxyEvent;

    const response = await handler(mockEvent, mockContext);
    console.log(response.body);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      success: true,
      data: [
        {
          optionId: '1',
          displayName: 'Email marketing',
          brand: 'BLC',
          alias: 'emailNews',
          brazeAlias: 'email_subscribe',
          description:
            "We'd like to send you regular email updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
          link: '',
          category: 'email',
          events: [],
          status: 0,
        },
        {
          optionId: '2',
          displayName: 'Push notifications',
          brand: 'BLC',
          alias: 'pushNotifications',
          brazeAlias: 'push_subscribe',
          description:
            "We'd like to send you regular push updates about Blue Light Card as well as offers, promotions and competitions by our brand partners.",
          link: '',
          category: '',
          events: [],
          status: 0,
        },
        {
          optionId: '3',
          displayName: 'SMS Marketing',
          brand: 'BLC',
          alias: 'sms',
          brazeAlias: 'sms_subscribe',
          description:
            "We'd like to send you regular SMS updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
          link: '',
          category: '',
          events: [],
          status: 0,
        },
        {
          optionId: '4',
          displayName: 'Analytics',
          brand: 'BLC',
          alias: 'analytics',
          brazeAlias: 'analytics',
          description:
            'We use cookies and similar technologies to monitor how you use our service, the effectiveness of our content and of retailers featured on our sites.',
          link: '',
          category: '',
          events: [],
          status: 0,
        },
        {
          optionId: '5',
          displayName: 'Personalised offers',
          brand: 'BLC',
          alias: 'personalisedOffers',
          brazeAlias: 'personalised_offers',
          description:
            'We use cookies and similar technologies to make our service more personal for you, we want to be able to show you offers that we think you will like based on how you use our website and app.',
          link: '',
          category: '',
          events: [],
          status: 0,
        },
      ],
    });
  });
});
