import { unpackJWT } from '../../../core/src/utils/unpackJWT';
import { validateBearerToken } from './validateBearerToken';

export function getLegacyUserId(bearerToken: string): string | null {
  if(validateBearerToken(bearerToken)) {
    const token = bearerToken.split(' ')[1];
    const decodedToken = unpackJWT(token);
    return decodedToken['custom:blc_old_id'];
  } else {
    return null;
  }
}
