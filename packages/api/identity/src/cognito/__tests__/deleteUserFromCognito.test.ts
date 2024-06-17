import { deleteUserFromCognito } from '../deleteUserFromCognito';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider';

let client: CognitoIdentityProviderClient;
let mock: ReturnType<typeof mockClient>;
describe('deleteUserFromCognito', () => {
  beforeAll(() => {
    process.env.SERVICE = 'test-identity-deleteUserFromCognito';
    client = new CognitoIdentityProviderClient({});
    mock = mockClient(CognitoIdentityProviderClient);
  });
  
  it('should delete a user from Cognito if user exists in the pool', async () => {
    mock.on(AdminGetUserCommand).resolves({
      $metadata: { httpStatusCode: 200 },
      UserAttributes: [
        { Name: 'sub', Value: 'sub' },
        { Name: 'email', Value: 'email' },
      ],
    });
    mock.on(AdminDeleteUserCommand).resolves({ $metadata: { httpStatusCode: 200 } });

    const result = await deleteUserFromCognito(client, 'testPoolId', 'email');
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'User email deleted' }),
    });
  });

  it('should throw a proper response if user does not exists in the pool', async () => {
    mock.on(AdminGetUserCommand).resolves({ $metadata: { httpStatusCode: 404 } });

    const result = await deleteUserFromCognito(client, 'testPoolId', 'email');
    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({ message: 'User email not found to delete from Cognito' }),
    });
  });

  it('should throw a proper response if username is not provided', async () => {
    const result = await deleteUserFromCognito(client, 'testPoolId', '');
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({ message: 'cognito client, poolId or username not provided' }),
    });
  });

  it('should handle Cognito API errors', async () => {
    mock.on(AdminGetUserCommand).resolves({
      $metadata: { httpStatusCode: 200 },
      UserAttributes: [
        { Name: 'sub', Value: 'sub' },
        { Name: 'email', Value: 'email' },
      ],
    });
    mock.on(AdminDeleteUserCommand).rejects({ $metadata: { httpStatusCode: 500 } });

    const result = await deleteUserFromCognito(client, 'testPoolId', 'email');
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'User email could not be deleted' }),
    });
  });
});
