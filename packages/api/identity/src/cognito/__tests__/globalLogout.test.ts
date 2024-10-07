import { handler } from '../globalLogout';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';

jest.mock('@aws-lambda-powertools/logger');
jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn(),
  getEnvOrDefault: jest.fn(),
}));

const mockGetEnv = jest.requireMock('@blc-mono/core/utils/getEnv').getEnv;

jest.mock('aws-sdk', () => {
  const mockCognito = {
    adminUserGlobalSignOut: jest.fn().mockImplementation(() => ({
      promise: jest.fn(),
    })),
  };
  return {
    CognitoIdentityServiceProvider: jest.fn(() => mockCognito),
  };
});

describe('Lambda Handler Tests', () => {
  let mockEvent: any;
  let mockContext: any;
  let mockCognitoISP: jest.Mocked<CognitoIdentityServiceProvider>;

  const mockUserPoolId = 'mock-user-pool-id';
  const mockOldUserPoolId = 'mock-old-user-pool-id';
  const mockAdminAuthApiKey = 'mock-admin-auth-api-key';

  beforeEach(() => {
    mockEvent = {
      headers: {},
      body: null,
    };
    mockContext = {};

    // Mock getEnv function
    mockGetEnv.mockImplementation((key: string) => {
      switch (key) {
        case IdentityStackEnvironmentKeys.BLC_UK_COGNITO_USER_POOL_ID:
          return mockUserPoolId;
        case IdentityStackEnvironmentKeys.BLC_UK_OLD_COGNITO_USER_POOL_ID:
          return mockOldUserPoolId;
        case IdentityStackEnvironmentKeys.ADMIN_AUTH_API_KEY:
          return mockAdminAuthApiKey;
        default:
          return undefined;
      }
    });

    // Get mock CognitoIdentityServiceProvider instance
    mockCognitoISP = new CognitoIdentityServiceProvider() as jest.Mocked<CognitoIdentityServiceProvider>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return Unauthorized if admin API key is invalid', async () => {
    mockEvent.headers['x-admin-api-key'] = 'invalid-key';
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Unauthorized');
  });

  it('should return BadRequest if email is not provided', async () => {
    mockEvent.headers['x-admin-api-key'] = mockAdminAuthApiKey;
    mockEvent.body = JSON.stringify({});
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Please provide valid email');
  });

  it('should return BadRequest if email is not valid', async () => {
    mockEvent.headers['x-admin-api-key'] = mockAdminAuthApiKey;
    mockEvent.body = JSON.stringify({ email: 'test' });
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('Please provide valid email');
  });

  it('should log out user from new pool successfully', async () => {
    mockEvent.headers['x-admin-api-key'] = mockAdminAuthApiKey;
    mockEvent.body = JSON.stringify({ email: 'test@example.com' });
    const result: any = await handler(mockEvent, mockContext);
    expect(JSON.parse(result.body).message).toEqual('User Logged out');
  });

  it('should log out user from old pool if not found in new pool', async () => {
    mockEvent.headers['x-admin-api-key'] = mockAdminAuthApiKey;
    mockEvent.body = JSON.stringify({ email: 'test@example.com' });
    (mockCognitoISP.adminUserGlobalSignOut as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue({ code: 'UserNotFoundException' }),
    });
    (mockCognitoISP.adminUserGlobalSignOut as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({}),
    });
    const result: any = await handler(mockEvent, mockContext);
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenCalledTimes(2);
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenNthCalledWith(1, {
      UserPoolId: mockUserPoolId,
      Username: 'test@example.com',
    });
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenNthCalledWith(2, {
      UserPoolId: mockOldUserPoolId,
      Username: 'test@example.com',
    });
    expect(JSON.parse(result.body).message).toEqual('User Logged out');
  });

  it('should throw error if not found in both the pool', async () => {
    mockEvent.headers['x-admin-api-key'] = mockAdminAuthApiKey;
    mockEvent.body = JSON.stringify({ email: 'test@example.com' });
    (mockCognitoISP.adminUserGlobalSignOut as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue({ code: 'UserNotFoundException' }),
    });
    (mockCognitoISP.adminUserGlobalSignOut as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue({ code: 'UserNotFoundException' }),
    });
    const result: any = await handler(mockEvent, mockContext);
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenCalledTimes(2);
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenNthCalledWith(1, {
      UserPoolId: mockUserPoolId,
      Username: 'test@example.com',
    });
    expect(mockCognitoISP.adminUserGlobalSignOut).toHaveBeenNthCalledWith(2, {
      UserPoolId: mockOldUserPoolId,
      Username: 'test@example.com',
    });
    expect(JSON.parse(result.body).message).toEqual('Error');
  });

});
