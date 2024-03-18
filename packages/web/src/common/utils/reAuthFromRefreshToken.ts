import { COGNITO_CLIENT_ID, COGNITO_CLIENT_REGION, COGNITO_CLIENT_SECRET } from '@/global-vars';
import { secretHash } from './secret_hash';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export function reAuthFromRefreshToken(username: string, refreshToken: string) {
  var params = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: COGNITO_CLIENT_ID,
    AuthParameters: {
      SECRET_HASH: secretHash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET),
      REFRESH_TOKEN: refreshToken,
    },
  };
  let cognito = new CognitoIdentityProvider({ region: COGNITO_CLIENT_REGION ?? 'eu-west-2' });
  cognito.initiateAuth(params, function (err: any, data: any) {
    if (err) {
      console.log(err, err.stack);
      return false;
    } else {
      localStorage.setItem('idToken', data.AuthenticationResult.IdToken);
      localStorage.setItem('accessToken', data.AuthenticationResult.AccessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      return true;
    }
  });
  return true;
}
