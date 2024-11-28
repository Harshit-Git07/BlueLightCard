import axios from 'axios';
import { UserMigrationTriggerEvent } from 'aws-lambda';
import { EventBridgeClient } from '@aws-sdk/client-eventbridge';
import { structuredClone } from 'next/dist/compiled/@edge-runtime/primitives';
import { mockClient } from 'aws-sdk-client-mock';

let mockAxios: jest.Mock;
let mockAdminInitiateAuth: jest.Mock;
let mockGetUser: jest.Mock;
let mockSqsSendMessage: jest.Mock;

jest.mock('axios');
jest.mock('aws-sdk', () => ({
  CognitoIdentityServiceProvider: jest.fn(() => ({
    adminInitiateAuth: mockAdminInitiateAuth,
    getUser: mockGetUser,
  })),
  SQS: jest.fn(() => ({
    sendMessage: mockSqsSendMessage,
  })),
}));

process.env.SERVICE = 'test-service';
process.env.OLD_CLIENT_ID = 'test-old-client-id';
process.env.OLD_CLIENT_SECRET = 'test-old-client-secret';
process.env.OLD_USER_POOL_ID = 'test-old-user-pool-id';
process.env.API_URL = 'api-url';
process.env.API_AUTH = 'api-auth';
process.env.IDENTITY_TABLE_NAME = 'identity-table-name';

import { handler } from '../migration';

describe('migration trigger', () => {

  beforeEach(() => {
    mockAxios = jest.mocked(axios);
    mockAdminInitiateAuth = jest.fn();
    mockGetUser = jest.fn();
    mockSqsSendMessage = jest.fn();
    mockClient(EventBridgeClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const authenticationEvent: UserMigrationTriggerEvent = {
    version: '1',
    region: 'eu-west-2',
    triggerSource: 'UserMigration_Authentication',
    userName: 'user@example.com',
    callerContext: {
      clientId: 'test-client',
      awsSdkVersion: 'test-sdk',
    },
    userPoolId: 'test-id',
    request: {
      password: 'test-Passw0rd!',
    },
    response: {
      userAttributes: {},
      desiredDeliveryMediums: [],
    },
  };

  it('should mirror unmatched events', async () => {
    // Arrange
    const invalidTriggerSourceEvent: any = {
      ...structuredClone(authenticationEvent),
      triggerSource: 'invalid-trigger-source',
    };

    // Act
    const response = await handler(invalidTriggerSourceEvent);

    // Assert
    expect(response).toEqual(invalidTriggerSourceEvent);
  });

  it('should validate email', async () => {
    // Arrange
    const invalidEmailEvent: any = {
      ...structuredClone(authenticationEvent),
      userName: 'invalid-email',
    };

    // Act
    const response = handler(invalidEmailEvent);

    // Assert
    expect(response).rejects.toThrow('The email you have entered is invalid, please enter a valid email');
  });

  it('should authenticate using old cognito pool', async () => {
    //Arrange
    mockAdminInitiateAuth.mockReturnValue({
      bob: {},
      promise: jest.fn().mockResolvedValue({
        AuthenticationResult: {
          AccessToken: 'test-access-token',
        },
      }),
    });
    mockGetUser.mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        UserAttributes: [
          { Name: 'sub', Value: 'test-sub' },
          { Name: 'email', Value: 'user@example.com' },
        ],
      }),
    });

    // Act
    const response = await handler(structuredClone(authenticationEvent));

    // Assert
    expect(mockAdminInitiateAuth).toHaveBeenCalledWith({
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      UserPoolId: 'test-old-user-pool-id',
      ClientId: 'test-old-client-id',
      AuthParameters: {
        USERNAME: 'user@example.com',
        SECRET_HASH: 'PPo2p6hk0vdPsmXJzV7S9HAh+B3vRm4c9ZQ8sqn3ltk=',
        PASSWORD: 'test-Passw0rd!',
      },
    });
    expect(mockGetUser).toHaveBeenCalledWith({
      AccessToken: 'test-access-token',
    });
    expect(response).toEqual({
      ...authenticationEvent,
      response: {
        ...authenticationEvent.response,
        finalUserStatus: 'CONFIRMED',
        messageAction: 'SUPPRESS',
        userAttributes: {
          email: 'user@example.com',
          'custom:migrated_old_pool': true,
        },
      },
    });
  });

  it('should validate password', async () => {
    //Arrange
    mockAdminInitiateAuth.mockReturnValue({
      bob: {},
      promise: jest.fn().mockResolvedValue({
        AuthenticationResult: {
          AccessToken: 'test-access-token',
        },
      }),
    });
    mockGetUser.mockReturnValue(undefined);

    const invalidPasswordEvent: any = {
      ...structuredClone(authenticationEvent),
      request: {
        password: 'invalid-password<',
      },
    };

    // Act
    const response = handler(invalidPasswordEvent);

    // Assert
    expect(response).rejects.toThrow('The password you have entered is invalid, please enter a valid password');
  });

  it('should authenticate using legacy login', async () => {
    //Arrange
    mockAdminInitiateAuth.mockReturnValue({
      bob: {},
      promise: jest.fn().mockResolvedValue({
        AuthenticationResult: {
          AccessToken: 'test-access-token',
        },
      }),
    });
    mockGetUser.mockReturnValue(undefined);
    mockAxios.mockResolvedValue({
      data: {
        success: true,
        data: {
          mobile: 'test-mobile',
          id: 'test-id',
          uuid: 'test-uuid',
          employerdata: {
            primarytrust: 'test-primarytrust',
            employer: 'test-employer',
          },
        },
      },
    });

    // Act
    const response = await handler(structuredClone(authenticationEvent));

    // Assert
    expect(response).toEqual({
      ...authenticationEvent,
      response: {
        ...authenticationEvent.response,
        finalUserStatus: 'CONFIRMED',
        messageAction: 'SUPPRESS',
        userAttributes: {
          email: 'user@example.com',
          'email_verified': 'true',
          'phone_number': '+440000000000',
          'phone_number_verified': 'true',
          'custom:blc_old_id': 'test-id',
          'custom:blc_old_uuid': 'test-uuid',
        },
      },
    });
  });
});
