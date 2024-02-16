import { unpackJWT } from '../../../core/src/utils/unpackJWT';

export function getLegacyUserId(bearerToken: string): string {
  const token = bearerToken.split(' ')[1];
  const decodedToken = unpackJWT(token);
  return decodedToken['custom:blc_old_id'];
}
