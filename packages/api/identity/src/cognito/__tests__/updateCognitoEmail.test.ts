import { updateCognitoEmail } from '../updateCognitoEmail';
import { mockClient } from 'aws-sdk-client-mock';
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';

let client: CognitoIdentityProviderClient;
let mock: ReturnType<typeof mockClient>;
describe('updateCognitoEmail', () => {
  beforeAll(() => {
    process.env.SERVICE = 'test-identity-deleteUserFromCognito';
    client = new CognitoIdentityProviderClient({});
    mock = mockClient(CognitoIdentityProviderClient);
  });

  it('should update the email of a user in Cognito if new email does not exist', async () => {
    mock.on(AdminGetUserCommand).resolves({ $metadata: { httpStatusCode: 500 } });
    mock.on(AdminUpdateUserAttributesCommand).resolves({ $metadata: { httpStatusCode: 200 } });

    const result = await updateCognitoEmail(client, 'testPoolId', 'email', 'newEmail');
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: 'user email updated in Cognito' }),
    });
  });

  it('should return proper response if new user email already exist in Cognito', async () => {
    mock.on(AdminGetUserCommand).resolves({
      $metadata: { httpStatusCode: 200 },
      UserAttributes: [
        { Name: 'sub', Value: 'sub' },
        { Name: 'email', Value: 'newEmail' },
      ],
    });

    const result = await updateCognitoEmail(client, 'testPoolId', 'noEmail', 'newEmail');
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'user email already exists in Cognito' }),
    });
  });

  it('should return proper response if the username or new email is not provided', async () => {
    const result = await updateCognitoEmail(client, 'testPoolId', 'email', '');
    expect(result).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: 'cognito client, poolId, username or new email not provided',
      }),
    });

    const result2 = await updateCognitoEmail(client, 'testPoolId', '', 'newEmail');
    expect(result2).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        message: 'cognito client, poolId, username or new email not provided',
      }),
    });
  });

  it('should handle errors thrown by the Cognito client', async () => {
    mock.on(AdminGetUserCommand).rejects({ $metadata: { httpStatusCode: 500 } });
    mock.on(AdminUpdateUserAttributesCommand).rejects({ $metadata: { httpStatusCode: 500 } });

    const result = await updateCognitoEmail(client, 'testPoolId', 'email', 'newEmail');
    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ message: 'user email could not be updated in Cognito' }),
    });
  });
});
