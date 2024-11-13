import { APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';
import { handler } from '../profile/idUpload';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../services/memberApplicationService');

jest.mock('../../services/memberApplicationService', () => {
  return {
    MemberApplicationService: jest.fn().mockImplementation(() => ({
      getMemberApplications: jest.fn(async (payload) => {
        if (payload.memberUUID === 'valid-member-uuid') {
          return [{ eligibilityStatus: 'AWAITING_ID_APPROVAL' }];
        }
        return null;
      }),
    })),
  };
});

jest.mock('aws-sdk', () => {
  const mockGetSignedUrlPromise = jest
    .fn()
    .mockImplementation(async (operation: string, params: any) => {
      if (operation === 'putObject') {
        return 'https://s3-presigned-url.com';
      }
      throw new Error('Unsupported operation');
    });

  return {
    S3: jest.fn().mockImplementation(() => ({
      getSignedUrlPromise: mockGetSignedUrlPromise,
    })),
    DynamoDB: {
      DocumentClient: jest.fn().mockImplementation(() => ({
        put: jest.fn().mockReturnThis(),
        get: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        promise: jest.fn().mockResolvedValue({}),
      })),
    },
  };
});

describe('ID Upload Handler', () => {
  let mockEvent: APIGatewayProxyEvent;
  let mockContext: LambdaContext;

  beforeEach(() => {
    mockContext = {} as LambdaContext;
    jest.clearAllMocks();
  });

  it('should return BadRequest when memberUUID is missing', async () => {
    mockEvent = {
      pathParameters: null,
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Bad Request: memberUUID is required');
  });

  it('should return BadRequest when application status is invalid', async () => {
    mockEvent = {
      pathParameters: { memberUUID: 'invalid-member-uuid' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Invalid application status');
  });

  it('should return a pre-signed URL when memberUUID is valid and status is AWAITING_ID_APPROVAL', async () => {
    mockEvent = {
      pathParameters: { memberUUID: 'valid-member-uuid' },
    } as unknown as APIGatewayProxyEvent;

    const result = await handler(mockEvent);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Pre-signed URL generated');
    expect(body.data.uploadURL).toBe('https://s3-presigned-url.com');
  });
});
