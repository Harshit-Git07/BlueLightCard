import jwt_decode from "jwt-decode";

export type JWT = {
  sub: string;
  phone_number: string;
  exp: number;
  iss: string;
  iat: number;
  email: string;
  'custom:blc_old_uuid': string;
  'custom:blc_old_id': string;
}

export function unpackJWT(jwt: string) {
  try {
    return jwt_decode(jwt) as JWT;
  } catch (error) {
    throw error;
  }
}
