import { unpackJWT } from '@core/utils/unpackJWT';
import AuthTokensService from '../../services/authTokensService';

const getLoggedInUserId = () => {
  let userId;

  const idToken = AuthTokensService.getIdToken();

  if (idToken) {
    const { 'custom:blc_old_uuid': userUuid } = unpackJWT(idToken);
    userId = userUuid ?? null;
  }

  return userId;
};

export default getLoggedInUserId;
