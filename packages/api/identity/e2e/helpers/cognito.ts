import {
  AdminCreateUserCommandInput,
  AdminGetUserCommandInput,
  CognitoIdentityProvider,
  UserNotFoundException
} from "@aws-sdk/client-cognito-identity-provider";

export async function addUserToCognito(username: string, password: string): Promise<void> {
  const cognitoProvider = new CognitoIdentityProvider({ region: process.env.E2E_AWS_REGION });
  const adminCreateUserParams: AdminCreateUserCommandInput = {
    Username: username,
    TemporaryPassword: password,
    UserPoolId: process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID
  }
  try {
    await cognitoProvider.adminCreateUser(adminCreateUserParams);
  } catch (e) {
    console.error("Error adding test user to Cognito", e);
  }
}

export async function userExistsInCognitoWithUsername(username: string): Promise<boolean> {
  const cognitoProvider = new CognitoIdentityProvider({ region: process.env.E2E_AWS_REGION });
  const adminGetUserCommandInput: AdminGetUserCommandInput = {
    Username: username,
    UserPoolId: process.env.E2E_IDENTITY_COGNITO_USER_POOL_ID
  }
  try {
    const response = await cognitoProvider.adminGetUser(adminGetUserCommandInput);
    return response.$metadata.httpStatusCode === 200;
  } catch (error: any) {
    if (error instanceof UserNotFoundException) {
      return false
    } else {
      console.error(error)
      throw error;
    }
  }
}