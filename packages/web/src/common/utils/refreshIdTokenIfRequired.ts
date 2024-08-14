import { unpackJWT } from '@core/utils/unpackJWT';
import { reAuthFromRefreshToken } from '@/utils/reAuthFromRefreshToken';
import { nowInSecondsSinceEpoch } from '@/utils/dates';
import AuthTokensService from '@/root/src/common/services/authTokensService';

export async function refreshIdTokenIfRequired(): Promise<string> {
  let idToken = AuthTokensService.getIdToken();
  const refreshToken = AuthTokensService.getRefreshToken();

  const { exp: tokenExpiryInSecondsSinceEpoch, sub: usernameFromToken } = unpackJWT(idToken);

  if (expiryTimeHasPassed(tokenExpiryInSecondsSinceEpoch)) {
    // Token has expired so re-authentication is required
    const refreshedSuccessfully = await reAuthFromRefreshToken(usernameFromToken, refreshToken);
    if (refreshedSuccessfully) {
      // Need to get the idToken again as it has been updated in local storage
      idToken = AuthTokensService.getIdToken();
    }
  }
  return idToken;
}

const expiryTimeHasPassed = (tokenExpiryInSecondsSinceEpoch: number) =>
  nowInSecondsSinceEpoch() >= tokenExpiryInSecondsSinceEpoch;
