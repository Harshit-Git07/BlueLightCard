import { COGNITO_CLIENT_ID, COGNITO_CLIENT_REGION, COGNITO_CLIENT_SECRET } from '@/global-vars';
import { secretHash } from './secret_hash';
import {
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import AuthTokensService from '../services/authTokensService';
import { AuthState } from '@/context/Auth/AuthContext';

export async function reAuthFromRefreshToken(
  username: string,
  refreshToken: string,
  updateAuthTokens: (tokens: AuthState) => void
) {
  const params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      SECRET_HASH: secretHash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      REFRESH_TOKEN: refreshToken,
    },
  } as const;

  const cognito = new CognitoIdentityProvider({ region: COGNITO_CLIENT_REGION });
  const command = new InitiateAuthCommand(params);

  try {
    const data = await cognito.send(command);
    const { AuthenticationResult } = data;
    updateAuthTokens({
      idToken: AuthenticationResult?.IdToken ?? '',
      accessToken: AuthenticationResult?.AccessToken ?? '',
      refreshToken,
      username,
    });
  } catch (err) {
    AuthTokensService.clearTokens();
    return false;
  }

  return true;
}
