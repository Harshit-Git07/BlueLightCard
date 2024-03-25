import { COGNITO_CLIENT_ID, COGNITO_CLIENT_REGION, COGNITO_CLIENT_SECRET } from '@/global-vars';
import { secretHash } from './secret_hash';
import {
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export async function reAuthFromRefreshToken(username: string, refreshToken: string) {
  const params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      SECRET_HASH: secretHash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      REFRESH_TOKEN: refreshToken,
    },
  };

  const cognito = new CognitoIdentityProvider({ region: COGNITO_CLIENT_REGION });
  const command = new InitiateAuthCommand(params);

  try {
    const data = await cognito.send(command);
    const { AuthenticationResult } = data;

    localStorage.setItem('idToken', AuthenticationResult?.IdToken ?? '');
    localStorage.setItem('accessToken', AuthenticationResult?.AccessToken ?? '');
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', username);
  } catch (err) {
    return false;
  }

  return true;
}
