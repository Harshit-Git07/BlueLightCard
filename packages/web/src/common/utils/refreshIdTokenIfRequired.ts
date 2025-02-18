import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import AuthTokensService from '@/root/src/common/services/authTokensService';
import { Auth0Service } from '@/root/src/common/services/auth0Service';

export async function refreshIdTokenIfRequired(): Promise<string> {
  let idToken = AuthTokensService.getIdToken();
  const refreshToken = AuthTokensService.getRefreshToken();

  try {
    const {
      exp: tokenExpiryInSecondsSinceEpoch,
      sub: usernameFromToken,
      iss: issuer,
    } = unpackJWT(idToken);

    if (AuthTokensService.expiryTimeHasPassed(tokenExpiryInSecondsSinceEpoch)) {
      // Token has expired so re-authentication is required
      const refreshedSuccessfully = await performTokenRefresh(
        issuer,
        refreshToken,
        usernameFromToken
      );
      if (refreshedSuccessfully) {
        // Need to get the idToken again as it has been updated in local storage
        idToken = AuthTokensService.getIdToken();
      }
    }
  } catch (error) {
    // something went wrong refreshing or unpacking jwt - returning existing idToken
    return idToken;
  }

  return idToken;
}

async function performTokenRefresh(
  issuer: string,
  refreshToken: string,
  usernameFromToken: string
) {
  if (Auth0Service.isAuth0Issuer(issuer)) {
    return await Auth0Service.updateTokensUsingRefreshToken(
      refreshToken,
      AuthTokensService.setTokens
    );
  }

  return await reAuthFromRefreshToken(usernameFromToken, refreshToken, AuthTokensService.setTokens);
}
