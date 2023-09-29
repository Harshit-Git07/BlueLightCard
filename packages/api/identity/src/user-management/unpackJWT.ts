import jwt_decode from 'jwt-decode';

type JWT = {
  client_id: number;
  'custom:blc_old_uuid': string;
};

export function unpackJWT(jwt: string) {
  return jwt_decode(jwt) as JWT;
}
