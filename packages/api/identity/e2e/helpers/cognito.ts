import {
  AdminCreateUserCommandInput,
  AdminGetUserCommandInput,
  CognitoIdentityProvider,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';

export async function addUserToCognito(
  username: string,
  password: string,
  region: string,
  userPoolId: string,
): Promise<void> {
  const cognitoProvider = new CognitoIdentityProvider({ region: region });
  const adminCreateUserParams: AdminCreateUserCommandInput = {
    Username: username,
    TemporaryPassword: password,
    UserPoolId: userPoolId,
  };
  try {
    await cognitoProvider.adminCreateUser(adminCreateUserParams);
  } catch (e) {
    console.error('Error adding test user to Cognito', e);
  }
}

export async function userExistsInCognitoWithUsername(
  username: string,
  region: string,
  userPoolId: string,
): Promise<boolean> {
  const cognitoProvider = new CognitoIdentityProvider({ region: region });
  const adminGetUserCommandInput: AdminGetUserCommandInput = {
    Username: username,
    UserPoolId: userPoolId,
  };
  try {
    const response = await cognitoProvider.adminGetUser(adminGetUserCommandInput);
    return response.$metadata.httpStatusCode === 200;
  } catch (error: any) {
    if (error instanceof UserNotFoundException) {
      return false;
    } else {
      console.error(error);
      throw error;
    }
  }
}
